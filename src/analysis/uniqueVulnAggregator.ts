import { VulnerabilityFinding, Severity } from '../ingestion/types';

export interface UniqueVulnerabilityItem {
  key: string;
  title: string;
  identifier: string; // CVE, GHSA, or Rule ID
  source: 'dependabot' | 'code_scanning';
  severity: Severity;
  cweIds: string[];
  occurrenceCount: number;
  findingIds: string[];
  affectedTargets: string[];
  totalEstimatedHours: number;
  estimatedHoursRange?: string;
  targetSprints: number[];
  statusSummary: {
    pending: number;
    in_progress: number;
    applied: number;
    verified: number;
    failed: number;
  };
  overallStatus: 'resolved' | 'in_progress' | 'pending' | 'failed';
}

export class UniqueVulnAggregator {
  private static readonly SEVERITY_WEIGHTS: Record<Severity, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  /**
   * Aggregates raw vulnerability alerts into unique vulnerabilities with occurrence counts.
   */
  public static aggregate(findingsInput: Record<string, VulnerabilityFinding> | VulnerabilityFinding[]): UniqueVulnerabilityItem[] {
    const findings = Array.isArray(findingsInput) ? findingsInput : Object.values(findingsInput || {});
    const map = new Map<string, UniqueVulnerabilityItem>();

    for (const f of findings) {
      const isCodeScanning = f.source === 'code_scanning';
      let key: string;
      let identifier: string;

      if (isCodeScanning) {
        identifier = f.ruleId || (f.cweIds && f.cweIds.length > 0 ? f.cweIds[0] : 'SAST');
        key = `CS:${identifier.toLowerCase()}`;
      } else {
        identifier = f.cveId || f.ghsaId || f.dependency?.packageName || 'Dependabot';
        key = `DEP:${identifier.toLowerCase()}`;
      }

      let item = map.get(key);
      if (!item) {
        item = {
          key,
          title: f.title,
          identifier,
          source: f.source,
          severity: f.severity,
          cweIds: [...(f.cweIds || [])],
          occurrenceCount: 0,
          findingIds: [],
          affectedTargets: [],
          totalEstimatedHours: 0,
          targetSprints: [],
          statusSummary: {
            pending: 0,
            in_progress: 0,
            applied: 0,
            verified: 0,
            failed: 0,
          },
          overallStatus: 'pending',
        };
        map.set(key, item);
      }

      // Increment occurrence
      item.occurrenceCount++;
      item.findingIds.push(f.id);

      // Sizing hours
      const hours = f.sizing?.estimatedHours ?? (f.sizing?.size === 'XL' ? 8 : f.sizing?.size === 'L' ? 4 : f.sizing?.size === 'M' ? 2 : 1);
      item.totalEstimatedHours = Math.round((item.totalEstimatedHours + hours) * 10) / 10;
      const minH = Math.max(0.5, Math.round(item.totalEstimatedHours * 0.75 * 10) / 10);
      const maxH = Math.round(item.totalEstimatedHours * 1.4 * 10) / 10;
      item.estimatedHoursRange = `${minH} – ${maxH} hrs`;

      // Higher severity takes precedence
      if (this.SEVERITY_WEIGHTS[f.severity] > this.SEVERITY_WEIGHTS[item.severity]) {
        item.severity = f.severity;
      }

      // Merge CWEs
      if (f.cweIds) {
        for (const cwe of f.cweIds) {
          if (!item.cweIds.includes(cwe)) {
            item.cweIds.push(cwe);
          }
        }
      }

      // Affected target
      const target = isCodeScanning
        ? (f.location?.filePath ? `${f.location.filePath}${f.location.startLine ? `:${f.location.startLine}` : ''}` : 'workspace file')
        : (f.dependency?.packageName ? `${f.dependency.packageName}${f.dependency.manifestFile ? ` (${f.dependency.manifestFile})` : ''}` : 'dependency');

      if (!item.affectedTargets.includes(target)) {
        item.affectedTargets.push(target);
      }

      // Target sprint
      if (f.targetSprint && !item.targetSprints.includes(f.targetSprint)) {
        item.targetSprints.push(f.targetSprint);
      }

      // Status
      const status = f.status || 'pending';
      if (status === 'applied') item.statusSummary.applied++;
      else if (status === 'verified') item.statusSummary.verified++;
      else if (status === 'in_progress') item.statusSummary.in_progress++;
      else if (status === 'failed' || status === 'rejected') item.statusSummary.failed++;
      else item.statusSummary.pending++;
    }

    // Determine overall status and sort
    const result = Array.from(map.values());
    for (const item of result) {
      item.targetSprints.sort((a, b) => a - b);
      const totalResolved = item.statusSummary.applied + item.statusSummary.verified;
      if (totalResolved === item.occurrenceCount) {
        item.overallStatus = 'resolved';
      } else if (item.statusSummary.failed > 0) {
        item.overallStatus = 'failed';
      } else if (item.statusSummary.in_progress > 0 || totalResolved > 0) {
        item.overallStatus = 'in_progress';
      } else {
        item.overallStatus = 'pending';
      }
    }

    // Sort: Critical > High > Medium > Low, then by occurrence count desc, then total hours desc
    result.sort((a, b) => {
      const diffSev = this.SEVERITY_WEIGHTS[b.severity] - this.SEVERITY_WEIGHTS[a.severity];
      if (diffSev !== 0) return diffSev;
      const diffOcc = b.occurrenceCount - a.occurrenceCount;
      if (diffOcc !== 0) return diffOcc;
      return b.totalEstimatedHours - a.totalEstimatedHours;
    });

    return result;
  }
}
