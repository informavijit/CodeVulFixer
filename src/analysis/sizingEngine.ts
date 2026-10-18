import { VulnerabilityFinding, SizingResult, TShirtSize, RiskLevel } from '../ingestion/types';
import { DependencyInfo } from '../ingestion/types';
import { CodeContextReport } from './codeContextAnalyzer';
import { CompatibilityAdvisor } from './compatibilityAdvisor';

export class SizingEngine {
  /**
   * Applies the T-Shirt Sizing Matrix to a finding based on dependency metrics, version gaps, and code context.
   */
  public static evaluate(
    finding: VulnerabilityFinding,
    depInfo?: DependencyInfo,
    contextReport?: CodeContextReport,
    workspaceRoot?: string
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

      // Calculate major version distance (e.g. Spring 1.x -> 5.x = gap of 4)
      let majorGap = dep?.majorGap || 1;
      const currentMajorMatch = dep?.currentVersion?.match(/(\d+)/);
      const fixedMajorMatch = dep?.fixedVersion?.match(/(\d+)/);
      if (currentMajorMatch && fixedMajorMatch) {
        const cMaj = parseInt(currentMajorMatch[1], 10);
        const fMaj = parseInt(fixedMajorMatch[1], 10);
        majorGap = Math.max(1, fMaj - cMaj);
        if (dep) dep.majorGap = majorGap;
      }

      // Check smart compatibility and platform matrix advice
      const advice = CompatibilityAdvisor.advise(finding, workspaceRoot || '', dep);
      if (advice) {
        finding.compatibilityAdvice = advice;
      }

      if (upgradeType === 'major' && majorGap >= 2) {
        // Multi-generation architectural migration (e.g. Spring 1.x -> 5.x, Angular.js -> Angular 17)
        size = 'XL';
        riskLevel = 'high';
        // Scaled non-linear estimation: 2-version gap ~24h, 4-version gap (Spring 1.x->5.x) ~72h
        estimatedHours = Math.min(96, Math.round(16 * Math.pow(1.5, majorGap - 1)));
        isAutomatedCandidate = false;
        reasons.push(
          `Multi-generational major version jump (v${currentMajorMatch?.[1] || '1'}.x ➔ v${fixedMajorMatch?.[1] || '5'}.x) spans ${majorGap} major releases with extensive architectural breaking changes`
        );
        reasons.push('Requires comprehensive configuration refactoring, API migration, and regression test suites');
        if (isDirect) {
          reasons.push('Direct package definition requires codebase API audit');
        }

        if (advice?.hasDeadlock) {
          reasons.push(`⚠️ Platform Deadlock Detected: ${advice.constraintSummary}`);
          reasons.push(
            `💡 Smart Remediation Recommendation: Upgrade to ${advice.safeRecommendedVersion} instead of ${advice.idealVersion} to eliminate compatibility risk`
          );
        }
      } else if (upgradeType === 'major') {
        size = 'L';
        riskLevel = 'high';
        estimatedHours = 3.5;
        isAutomatedCandidate = false;
        reasons.push('Major version upgrade introduces potential API breaking changes');
        if (isDirect) {
          reasons.push('Direct package definition requires codebase API audit');
        }
        if (advice) {
          reasons.push(`💡 Compatibility Advice: ${advice.tradeoffReason}`);
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

      // Technology-Specific Sizing Adjustments:
      const filePath = finding.location?.filePath?.toLowerCase() || '';
      const ruleId = finding.ruleId?.toLowerCase() || '';

      // 1. Delphi / Object Pascal (Unmanaged Native Memory)
      if (filePath.endsWith('.pas') || filePath.endsWith('.dpr') || filePath.endsWith('.dproj') || ruleId.includes('delphi') || ruleId.includes('pascal')) {
        if (size === 'S') size = 'M';
        estimatedHours = Math.max(3.0, estimatedHours * 1.5);
        isAutomatedCandidate = false;
        reasons.push('Delphi / Object Pascal unmanaged binary: requires manual memory boundary verification, pointer arithmetic inspection, and ABI compiler regression checks');
      }

      // 2. PowerShell (.ps1 / Script Injection)
      else if (filePath.endsWith('.ps1') || filePath.endsWith('.psm1') || ruleId.includes('powershell') || ruleId.includes('posh')) {
        reasons.push('PowerShell script environment: requires AST scriptblock restructuring and CmdletBinding parameter validation');
      }

      // 3. .NET / C# (Managed Assembly & LINQ/EF)
      else if (filePath.endsWith('.cs') || ruleId.startsWith('cs/')) {
        reasons.push('.NET / C# ecosystem: requires parameterized LINQ/SqlCommand refactoring and target assembly compatibility check');
      }

      // 4. Java / Spring / Apache
      else if (filePath.endsWith('.java') || ruleId.startsWith('java/')) {
        reasons.push('Java / Spring ecosystem: requires JVM runtime compliance and PreparedStatement / Spring Security filter chain audit');
      }

      // 5. C / C++ (Unmanaged Native Memory / Pointer Corruption)
      else if (
        filePath.endsWith('.cpp') ||
        filePath.endsWith('.c') ||
        filePath.endsWith('.cc') ||
        filePath.endsWith('.cxx') ||
        filePath.endsWith('.h') ||
        filePath.endsWith('.hpp') ||
        ruleId.startsWith('cpp/') ||
        ruleId.startsWith('c/')
      ) {
        if (size === 'S') size = 'M';
        estimatedHours = Math.max(3.5, estimatedHours * 1.6);
        isAutomatedCandidate = false;
        reasons.push(
          'C/C++ native unmanaged code: high memory-safety risk (CWE-120/416/125); requires AddressSanitizer (ASAN) audit, valgrind boundary verification, and manual ABI testing'
        );
      }

      // 6. Go (Golang)
      else if (filePath.endsWith('.go') || ruleId.startsWith('go/')) {
        reasons.push('Go ecosystem: requires goroutine concurrency leak audit and safe slice/pointer boundary validation');
      }

      // 7. Rust
      else if (filePath.endsWith('.rs') || ruleId.startsWith('rust/')) {
        reasons.push('Rust ecosystem: requires unsafe block { unsafe { ... } } audit and borrow checker lifetime verification');
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
