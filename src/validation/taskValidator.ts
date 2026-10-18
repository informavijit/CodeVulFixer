import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ValidationSummary } from '../ingestion/types';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);

export class TaskValidator {
  /**
   * Runs automated compilation and test validation suites.
   */
  public static async validateWorkspace(
    workspaceRoot: string
  ): Promise<ValidationSummary> {
    const config = vscode.workspace.getConfiguration('codevulfixer');
    const autoRun = config.get<boolean>('autoRunTests', true);
    const buildCmd = config.get<string>('buildCommand', 'npm run build');
    const testCmd = config.get<string>('testCommand', 'npm test');

    const summary: ValidationSummary = {
      passed: true,
      timestamp: new Date().toISOString(),
      buildStatus: 'skipped',
      testStatus: 'skipped',
      auditStatus: 'skipped',
    };

    if (!autoRun) {
      logger.info('Auto-validation is disabled in settings.');
      return summary;
    }

    // 1. Check if package.json has build/test scripts
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

    // 2. Compilation / Build Check
    if (hasBuildScript || fs.existsSync(path.join(workspaceRoot, 'tsconfig.json'))) {
      const start = Date.now();
      const actualBuildCmd = hasBuildScript ? buildCmd : 'npx tsc --noEmit';
      logger.info(`[Validation] Running compilation check: ${actualBuildCmd}`);

      try {
        const { stdout, stderr } = await execAsync(actualBuildCmd, {
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

    // 3. Automated Test Suite
    if (hasTestScript) {
      const start = Date.now();
      logger.info(`[Validation] Running regression test suite: ${testCmd}`);

      try {
        const { stdout, stderr } = await execAsync(testCmd, {
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
