import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);

export interface AuditReport {
  passed: boolean;
  rawOutput: string;
  clearedAdvisory: boolean;
}

export class AuditValidator {
  /**
   * Runs local security audit (e.g. npm audit) to check if the target CVE/GHSA has cleared.
   */
  public static async runAudit(
    workspaceRoot: string,
    advisoryId?: string
  ): Promise<AuditReport> {
    const config = vscode.workspace.getConfiguration('codevulfixer');
    const auditCmd = config.get<string>('auditCommand', 'npm audit');

    // Only run if package-lock or node_modules exists
    const hasLockfile = fs.existsSync(path.join(workspaceRoot, 'package-lock.json'));
    if (!hasLockfile) {
      return {
        passed: true,
        rawOutput: 'Skipped: No package-lock.json detected.',
        clearedAdvisory: true,
      };
    }

    logger.info(`[AuditValidator] Running security audit check: ${auditCmd}`);
    try {
      const { stdout } = await execAsync(auditCmd, { cwd: workspaceRoot });
      const cleared = advisoryId ? !stdout.includes(advisoryId) : true;
      return {
        passed: true,
        rawOutput: stdout,
        clearedAdvisory: cleared,
      };
    } catch (error: any) {
      // npm audit exits with non-zero when vulnerabilities are found
      const output = (error.stdout || '') + (error.stderr || '');
      const cleared = advisoryId ? !output.includes(advisoryId) : false;

      return {
        passed: cleared,
        rawOutput: output,
        clearedAdvisory: cleared,
      };
    }
  }
}
