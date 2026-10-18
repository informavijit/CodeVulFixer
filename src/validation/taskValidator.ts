import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ValidationSummary, VulnerabilityFinding } from '../ingestion/types';
import { CompatibilityAdvisor } from '../analysis/compatibilityAdvisor';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);

export class TaskValidator {
  /**
   * Runs automated compilation, regression tests, and collateral vulnerability / compatibility audits.
   */
  public static async validateWorkspace(
    workspaceRoot: string,
    finding?: VulnerabilityFinding
  ): Promise<ValidationSummary> {
    const config = vscode.workspace.getConfiguration('codevulfixer');
    const autoRun = config.get<boolean>('autoRunTests', true);
    const buildCmd = config.get<string>('buildCommand', 'npm run build');
    const testCmd = config.get<string>('testCommand', 'npm test');
    const auditCmd = config.get<string>('auditCommand', 'npm audit');

    const summary: ValidationSummary = {
      passed: true,
      timestamp: new Date().toISOString(),
      buildStatus: 'skipped',
      testStatus: 'skipped',
      auditStatus: 'skipped',
      compatibilityStatus: 'skipped',
    };

    if (!autoRun) {
      logger.info('Auto-validation is disabled in settings.');
      return summary;
    }

    // 1. Compatibility & Collateral / Cascading Vulnerability Audit Check
    if (finding?.dependency) {
      const dep = finding.dependency;
      logger.info(`[Validation] Inspecting collateral vulnerabilities and compatibility for ${dep.packageName}@${dep.fixedVersion}...`);

      // Check for cascading / collateral risks
      const cascading = CompatibilityAdvisor.evaluateCascadingVulnerabilities(dep, dep.fixedVersion);
      if (cascading.hasCascadingRisk) {
        summary.auditStatus = 'failed';
        summary.compatibilityStatus = 'failed';
        summary.passed = false;
        summary.cascadingVulnerabilitiesIntroduced = cascading.newVulnerabilities;
        summary.suggestedAlternativeVersion = cascading.alternativeVersion;
        summary.failureStackTrace = [
          `🚨 Validation Checkpoint: Upgrading to ${dep.packageName}@${dep.fixedVersion} introduces collateral risk / incompatibilities:`,
          ...cascading.newVulnerabilities.map((v) => `  • ${v}`),
          '',
          `💡 Smart Safe Alternative Recommendation:`,
          `  Upgrade to version "${cascading.alternativeVersion}" instead to eliminate the original vulnerability while avoiding collateral breaks.`,
        ].join('\n');
        logger.error(`[Validation] Collateral vulnerability intercepted for ${finding.id}: ${summary.failureStackTrace}`);
        return summary;
      }

      // Check for platform deadlock (e.g., Java 8 module constraint vs Java 17 requirement)
      if (finding.compatibilityAdvice?.hasDeadlock) {
        const advice = finding.compatibilityAdvice;
        summary.compatibilityStatus = 'failed';
        summary.passed = false;
        summary.compatibilityIssues = [advice.constraintSummary];
        summary.suggestedAlternativeVersion = advice.safeRecommendedVersion;
        summary.failureStackTrace = [
          `❌ Runtime Platform Deadlock Intercepted:`,
          `  ${advice.constraintSummary}`,
          '',
          `💡 Recommended Action:`,
          `  ${advice.tradeoffReason}`,
          `  Target Recommended Version: ${advice.safeRecommendedVersion}`,
        ].join('\n');
        logger.error(`[Validation] Platform deadlock intercepted for ${finding.id}`);
        return summary;
      }

      summary.compatibilityStatus = 'passed';
      summary.auditStatus = 'passed';
    }

    // 2. Check if package.json has build/test scripts
    const packageJsonPath = path.join(workspaceRoot, 'package.json');
    let hasBuildScript = false;
    let hasTestScript = false;

    if (fs.existsSync(packageJsonPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        hasBuildScript = !!(pkg.scripts && pkg.scripts.build);
        hasTestScript = !!(pkg.scripts && pkg.scripts.test);
      } catch {
        // ignore
      }
    }

    // 3. Compilation / Build Check
    if (hasBuildScript || fs.existsSync(path.join(workspaceRoot, 'tsconfig.json'))) {
      const start = Date.now();
      const actualBuildCmd = hasBuildScript ? buildCmd : 'npx tsc --noEmit';
      logger.info(`[Validation] Running compilation check: ${actualBuildCmd}`);

      try {
        const { stdout } = await execAsync(actualBuildCmd, {
          cwd: workspaceRoot,
          timeout: 60000,
        });
        summary.buildStatus = 'passed';
        summary.buildDurationMs = Date.now() - start;
        summary.buildOutput = stdout || 'Compilation passed with zero errors.';
        logger.success(`[Validation] Compilation check passed in ${summary.buildDurationMs}ms.`);
      } catch (error: any) {
        summary.buildStatus = 'failed';
        summary.passed = false;
        summary.buildDurationMs = Date.now() - start;
        summary.buildOutput = error.stdout || '';
        summary.failureStackTrace = error.stderr || error.message;
        logger.error(`[Validation] Compilation failed: ${error.message}`);
        return summary;
      }
    } else {
      summary.buildStatus = 'skipped';
    }

    // 4. Automated Test Suite
    if (hasTestScript) {
      const start = Date.now();
      logger.info(`[Validation] Running regression test suite: ${testCmd}`);

      try {
        const { stdout } = await execAsync(testCmd, {
          cwd: workspaceRoot,
          timeout: 60000,
        });
        summary.testStatus = 'passed';
        summary.testDurationMs = Date.now() - start;
        summary.testOutput = stdout || 'All tests passed.';
        logger.success(`[Validation] Test suite passed in ${summary.testDurationMs}ms.`);
      } catch (error: any) {
        summary.testStatus = 'failed';
        summary.passed = false;
        summary.testDurationMs = Date.now() - start;
        summary.testOutput = error.stdout || '';
        summary.failureStackTrace = error.stderr || error.message;
        logger.error(`[Validation] Test suite failed: ${error.message}`);
        return summary;
      }
    } else {
      summary.testStatus = 'skipped';
    }

    return summary;
  }
}
