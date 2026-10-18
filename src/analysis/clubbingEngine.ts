import {
  VulnerabilityFinding,
  VulnerabilityCluster,
  ClubbingSummary,
  Severity,
} from '../ingestion/types';
import { logger } from '../utils/logger';

export class ClubbingEngine {
  /**
   * Analyzes all workspace findings, clusters duplicates by root cause (package / CWE rule),
   * and computes remediation leverage metrics.
   */
  public static analyzeClusters(
    findings: VulnerabilityFinding[] | Record<string, VulnerabilityFinding>
  ): ClubbingSummary {
    const list = Array.isArray(findings) ? findings : Object.values(findings || {});
    const totalRaw = list.length;

    if (totalRaw === 0) {
      return {
        totalRawFindings: 0,
        uniqueIssuesCount: 0,
        remediationLeverageRatio: 1.0,
        uniquePackagesCount: 0,
        uniqueCweRulesCount: 0,
        clusters: [],
      };
    }

    const packageMap = new Map<string, VulnerabilityFinding[]>();
    const cweRuleMap = new Map<string, VulnerabilityFinding[]>();

    for (const f of list) {
      if (f.source === 'dependabot' && f.dependency?.packageName) {
        const pkgKey = f.dependency.packageName.toLowerCase().trim();
        if (!packageMap.has(pkgKey)) packageMap.set(pkgKey, []);
        packageMap.get(pkgKey)!.push(f);
      } else {
        const ruleKey = (f.ruleId || f.cweIds?.[0] || f.title || 'generic-code-finding').toLowerCase().trim();
        if (!cweRuleMap.has(ruleKey)) cweRuleMap.set(ruleKey, []);
        cweRuleMap.get(ruleKey)!.push(f);
      }
    }

    const clusters: VulnerabilityCluster[] = [];

    // 1. Process Dependabot Package Clusters
    for (const [pkgName, clusterFindings] of packageMap.entries()) {
      const clusterId = `cluster-pkg-${pkgName.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
      const highestSev = this.getHighestSeverity(clusterFindings);
      const manifests = Array.from(
        new Set(clusterFindings.map((f) => f.dependency?.manifestFile || 'package.json'))
      );
      const targetVersion = clusterFindings.find((f) => f.dependency?.fixedVersion)?.dependency?.fixedVersion;
      const resolvedCount = clusterFindings.filter((f) => f.status === 'verified').length;

      // Link findings to this cluster ID
      clusterFindings.forEach((f) => {
        f.linkedClusterId = clusterId;
      });

      clusters.push({
        clusterId,
        type: 'package',
        name: clusterFindings[0]?.dependency?.packageName || pkgName,
        category: 'dependabot',
        findingIds: clusterFindings.map((f) => f.id),
        totalFindings: clusterFindings.length,
        resolvedFindings: resolvedCount,
        highestSeverity: highestSev,
        targetFixedVersion: targetVersion,
        affectedManifestsOrFiles: manifests,
        remediationStrategy: 'zero_token_lockfile',
      });
    }

    // 2. Process Code Scanning CWE / Rule Clusters
    for (const [ruleKey, clusterFindings] of cweRuleMap.entries()) {
      const clusterId = `cluster-cwe-${ruleKey.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
      const highestSev = this.getHighestSeverity(clusterFindings);
      const files = Array.from(
        new Set(clusterFindings.map((f) => f.location?.filePath || 'workspace').filter(Boolean))
      );
      const resolvedCount = clusterFindings.filter((f) => f.status === 'verified').length;
      const primaryCwe = clusterFindings[0]?.cweIds?.[0];
      const displayName = primaryCwe
        ? `${primaryCwe}: ${clusterFindings[0]?.ruleId || clusterFindings[0]?.title}`
        : clusterFindings[0]?.ruleId || clusterFindings[0]?.title || ruleKey;

      clusterFindings.forEach((f) => {
        f.linkedClusterId = clusterId;
      });

      clusters.push({
        clusterId,
        type: 'cwe_rule',
        name: displayName,
        category: 'code_scanning',
        findingIds: clusterFindings.map((f) => f.id),
        totalFindings: clusterFindings.length,
        resolvedFindings: resolvedCount,
        highestSeverity: highestSev,
        affectedManifestsOrFiles: files,
        remediationStrategy: 'ai_synthesis',
      });
    }

    // Sort clusters: high severity first, then largest cluster size
    clusters.sort((a, b) => {
      const sevWeight: Record<Severity, number> = { critical: 4, high: 3, medium: 2, low: 1 };
      const weightDiff = sevWeight[b.highestSeverity] - sevWeight[a.highestSeverity];
      if (weightDiff !== 0) return weightDiff;
      return b.totalFindings - a.totalFindings;
    });

    const uniquePackages = packageMap.size;
    const uniqueCweRules = cweRuleMap.size;
    const uniqueIssues = uniquePackages + uniqueCweRules;
    const leverage = uniqueIssues > 0 ? Math.round((totalRaw / uniqueIssues) * 10) / 10 : 1.0;

    logger.info(
      `[ClubbingEngine] Consolidated ${totalRaw} raw alerts into ${uniqueIssues} unique root issues (${uniquePackages} packages, ${uniqueCweRules} rules) &mdash; Leverage: ${leverage}x.`
    );

    return {
      totalRawFindings: totalRaw,
      uniqueIssuesCount: uniqueIssues,
      remediationLeverageRatio: leverage,
      uniquePackagesCount: uniquePackages,
      uniqueCweRulesCount: uniqueCweRules,
      clusters,
    };
  }

  /**
   * Finds co-remediation candidates when a primary finding is resolved.
   * If a package upgrade is executed, other findings linked to the same package can be resolved
   * with Zero Tokens without requiring AI.
   */
  public static findCascadingCandidates(
    primaryFinding: VulnerabilityFinding,
    allFindings: VulnerabilityFinding[] | Record<string, VulnerabilityFinding>
  ): VulnerabilityFinding[] {
    const list = Array.isArray(allFindings) ? allFindings : Object.values(allFindings || {});

    if (primaryFinding.source === 'dependabot' && primaryFinding.dependency?.packageName) {
      const targetPkg = primaryFinding.dependency.packageName.toLowerCase().trim();
      return list.filter(
        (f) =>
          f.id !== primaryFinding.id &&
          f.source === 'dependabot' &&
          f.dependency?.packageName?.toLowerCase().trim() === targetPkg &&
          (f.status === 'pending' || f.status === 'failed' || f.status === 'in_progress')
      );
    }

    if (primaryFinding.source === 'code_scanning' && (primaryFinding.ruleId || primaryFinding.cweIds?.length)) {
      const targetRule = primaryFinding.ruleId;
      const targetCwe = primaryFinding.cweIds?.[0];

      return list.filter(
        (f) =>
          f.id !== primaryFinding.id &&
          f.source === 'code_scanning' &&
          ((targetRule && f.ruleId === targetRule) || (targetCwe && f.cweIds?.includes(targetCwe))) &&
          (f.status === 'pending' || f.status === 'failed' || f.status === 'in_progress')
      );
    }

    return [];
  }

  private static getHighestSeverity(findings: VulnerabilityFinding[]): Severity {
    if (findings.some((f) => f.severity === 'critical')) return 'critical';
    if (findings.some((f) => f.severity === 'high')) return 'high';
    if (findings.some((f) => f.severity === 'medium')) return 'medium';
    return 'low';
  }
}
