import { Octokit } from '@octokit/rest';
import { VulnerabilityFinding, Severity, DependencyInfo } from './types';
import { logger } from '../utils/logger';

export class DependabotIngestor {
  public static async fetchAlerts(
    octokit: Octokit,
    owner: string,
    repo: string
  ): Promise<VulnerabilityFinding[]> {
    logger.info(`Fetching Dependabot alerts for ${owner}/${repo}...`);
    try {
      const response = await octokit.rest.dependabot.listAlertsForRepo({
        owner,
        repo,
        state: 'open',
        per_page: 100,
      });

      const alerts = response.data;
      logger.info(`Received ${alerts.length} Dependabot alerts.`);

      return alerts.map((alert, index) => {
        const adv = alert.security_advisory as any;
        const dep = alert.dependency as any;
        const advisoryId = adv.cve_id || adv.ghsa_id || `DEP-${alert.number}`;

        const firstPatched = adv.vulnerabilities?.[0]?.first_patched_version?.identifier ||
          (adv.patched_versions && adv.patched_versions.length > 0 ? adv.patched_versions[0].identifier : undefined);
        const fixedVersion = firstPatched || 'latest';

        const vulnRange = adv.vulnerabilities?.[0]?.vulnerable_version_range || adv.vulnerable_version_range || 'vulnerable';

        const severity = this.normalizeSeverity(adv.severity);
        const ecosystem = dep?.package?.ecosystem || 'npm';
        const packageName = dep?.package?.name || 'unknown-package';
        const manifestFile = dep?.manifest_path || 'package.json';

        const dependencyInfo: DependencyInfo = {
          packageName,
          ecosystem,
          currentVersion: vulnRange,
          fixedVersion,
          isDirect: true, // Will be refined by DependencyAnalyzer
          manifestFile,
          vulnerableVersionRange: vulnRange,
          upgradeType: this.determineUpgradeType(vulnRange, fixedVersion),
        };

        const finding: VulnerabilityFinding = {
          id: `DEP-${alert.number}`,
          source: 'dependabot',
          alertNumber: alert.number,
          title: adv.summary || `Vulnerability in ${packageName}`,
          description: adv.description || `Dependabot flagged ${packageName} with ${advisoryId}`,
          severity,
          htmlUrl: alert.html_url,
          cveId: adv.cve_id || undefined,
          ghsaId: adv.ghsa_id || undefined,
          cweIds: adv.cwes?.map((c: any) => c.cwe_id) || [],
          dependency: dependencyInfo,
          status: 'pending',
          targetSprint: 1, // Will be computed by sprintPlanner
          remediationPlan: `Upgrade ${packageName} to >= ${fixedVersion} via lockfile bump`,
          sizing: {
            size: 'S',
            riskLevel: 'low',
            reasons: [],
            estimatedHours: 1,
            isAutomatedCandidate: true,
          },
        };

        return finding;
      });
    } catch (error) {
      logger.error(`Failed to fetch Dependabot alerts for ${owner}/${repo}`, error);
      throw error;
    }
  }

  private static normalizeSeverity(raw?: string): Severity {
    const s = (raw || '').toLowerCase();
    if (s === 'critical') return 'critical';
    if (s === 'high') return 'high';
    if (s === 'medium' || s === 'moderate') return 'medium';
    return 'low';
  }

  private static determineUpgradeType(
    range?: string,
    fixed?: string
  ): 'patch' | 'minor' | 'major' | 'unknown' {
    if (!fixed || fixed === 'latest') return 'minor';
    const match = fixed.match(/^(\d+)\.(\d+)\.(\d+)/);
    if (!match) return 'unknown';

    // Heuristic: check if major version changed from range
    if (range && range.includes('<')) {
      const targetMajor = parseInt(match[1], 10);
      const rangeMatch = range.match(/<\s*(\d+)/);
      if (rangeMatch) {
        const vulnerableMajor = parseInt(rangeMatch[1], 10);
        if (targetMajor > vulnerableMajor) {
          return 'major';
        }
      }
    }
    return 'patch';
  }
}
