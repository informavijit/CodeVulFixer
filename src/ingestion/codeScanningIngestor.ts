import { Octokit } from '@octokit/rest';
import { VulnerabilityFinding, Severity, CodeLocation } from './types';
import { logger } from '../utils/logger';

export class CodeScanningIngestor {
  public static async fetchAlerts(
    octokit: Octokit,
    owner: string,
    repo: string
  ): Promise<VulnerabilityFinding[]> {
    try {
      logger.info(`Fetching Code Scanning (SAST/CodeQL) alerts for ${owner}/${repo} (all pages)...`);
      const alerts = await octokit.paginate(octokit.rest.codeScanning.listAlertsForRepo, {
        owner,
        repo,
        state: 'open',
        per_page: 100,
      });

      logger.info(`Received ${alerts.length} Code Scanning findings across all pages.`);

      return alerts.map((alert) => {
        const rule = alert.rule;
        const instance = alert.most_recent_instance;
        const loc = instance?.location;

        const severity = this.normalizeSeverity(
          rule.security_severity_level || rule.severity
        );

        const cweIds = this.extractCWEs(rule.tags ?? undefined);

        const codeLocation: CodeLocation | undefined = loc?.path
          ? {
              filePath: loc.path,
              startLine: loc.start_line || 1,
              endLine: loc.end_line || loc.start_line || 1,
              startColumn: loc.start_column ?? undefined,
              endColumn: loc.end_column ?? undefined,
            }
          : undefined;

        const finding: VulnerabilityFinding = {
          id: `CS-${alert.number}`,
          source: 'code_scanning',
          alertNumber: alert.number,
          title: rule.description || rule.id || `Code Scanning Alert #${alert.number}`,
          description: instance?.message?.text || rule.description || 'Static analysis finding flagged by CodeQL',
          severity,
          htmlUrl: alert.html_url,
          ruleId: rule.id ?? undefined,
          cweIds,
          location: codeLocation,
          status: 'pending',
          targetSprint: 1, // Computed by sprint planner
          remediationPlan: `Refactor code at ${loc?.path || 'file'} to resolve ${rule.id}`,
          sizing: {
            size: 'M',
            riskLevel: 'medium',
            reasons: [],
            estimatedHours: 2,
            isAutomatedCandidate: false,
          },
        };

        return finding;
      });
    } catch (error) {
      logger.error(`Failed to fetch Code Scanning alerts for ${owner}/${repo}`, error);
      throw error;
    }
  }

  private static normalizeSeverity(raw?: string | null): Severity {
    const s = (raw || '').toLowerCase();
    if (s === 'critical') return 'critical';
    if (s === 'high' || s === 'error') return 'high';
    if (s === 'medium' || s === 'warning') return 'medium';
    return 'low';
  }

  private static extractCWEs(tags?: string[]): string[] {
    if (!tags) return [];
    const cwes: string[] = [];
    for (const tag of tags) {
      if (tag.startsWith('external/cwe/cwe-')) {
        const id = tag.replace('external/cwe/cwe-', 'CWE-');
        cwes.push(id.toUpperCase());
      } else if (/^cwe-\d+/i.test(tag)) {
        cwes.push(tag.toUpperCase());
      }
    }
    return cwes;
  }
}
