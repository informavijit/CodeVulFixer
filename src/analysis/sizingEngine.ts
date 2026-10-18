import { VulnerabilityFinding, SizingResult, TShirtSize, RiskLevel } from '../ingestion/types';
import { DependencyInfo } from '../ingestion/types';
import { CodeContextReport } from './codeContextAnalyzer';

export class SizingEngine {
  /**
   * Applies the T-Shirt Sizing Matrix to a finding based on dependency metrics and code context.
   */
  public static evaluate(
    finding: VulnerabilityFinding,
    depInfo?: DependencyInfo,
    contextReport?: CodeContextReport
  ): SizingResult {
    const reasons: string[] = [];
    let size: TShirtSize = 'S';
    let riskLevel: RiskLevel = 'low';
    let estimatedHours = 1.0;
    let isAutomatedCandidate = true;

    if (finding.source === 'dependabot') {
      const dep = depInfo || finding.dependency;
      const upgradeType = dep?.upgradeType || 'patch';
      const isDirect = dep ? dep.isDirect : true;

      if (upgradeType === 'major') {
        size = 'L';
        riskLevel = 'high';
        estimatedHours = 3.5;
        isAutomatedCandidate = false;
        reasons.push('Major version upgrade introduces potential API breaking changes');
        if (isDirect) {
          reasons.push('Direct package definition requires codebase API audit');
        }
      } else if (finding.severity === 'critical') {
        size = 'M';
        riskLevel = 'medium';
        estimatedHours = 2.0;
        isAutomatedCandidate = true;
        reasons.push('Critical severity dependency patch; prioritized for rapid lockfile refresh');
      } else {
        size = 'S';
        riskLevel = 'low';
        estimatedHours = 0.5;
        isAutomatedCandidate = true;
        reasons.push(
          isDirect
            ? 'Direct dependency patch bump with backward compatibility'
            : 'Transitive lockfile bump without source modifications'
        );
      }
    } else {
      // Code Scanning (SAST/CodeQL)
      const complexity = contextReport?.taintComplexity || 'moderate';
      const isSelfContained = contextReport?.isSelfContained ?? false;
      const severity = finding.severity;

      if (complexity === 'complex' || severity === 'critical') {
        size = 'L';
        riskLevel = 'high';
        estimatedHours = 4.0;
        isAutomatedCandidate = false;
        reasons.push('Complex data-flow / taint across application layers (e.g. SQL Injection or Command Injection)');
        reasons.push('High-risk vulnerability requiring human-in-the-loop verification');
      } else if (!isSelfContained || complexity === 'moderate' || severity === 'high') {
        size = 'M';
        riskLevel = 'medium';
        estimatedHours = 2.0;
        isAutomatedCandidate = false;
        reasons.push('Code modification touches non-trivial function block');
        reasons.push('Requires regression test validation');
      } else {
        size = 'S';
        riskLevel = 'low';
        estimatedHours = 0.5;
        isAutomatedCandidate = true;
        reasons.push('Self-contained, localized syntax or security sanitizer replacement');
        reasons.push('Eligible for deterministic AST-grep / AI automated repair');
      }
    }

    return {
      size,
      riskLevel,
      reasons,
      estimatedHours,
      isAutomatedCandidate,
    };
  }
}
