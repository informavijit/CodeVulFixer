import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';
import { VulnerabilityFinding } from '../ingestion/types';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);

export class GitScmHandler {
  /**
   * Stages modified files for check-in and auto-populates the SCM commit message.
   */
  public static async stageAndSetCommitMessage(
    workspaceRoot: string,
    finding: VulnerabilityFinding,
    modifiedFiles: string[]
  ): Promise<boolean> {
    try {
      // 1. Stage each file via Git CLI
      for (const file of modifiedFiles) {
        logger.info(`[SCM] Staging file: git add "${file}"`);
        await execAsync(`git add "${file}"`, { cwd: workspaceRoot });
      }

      // 2. Format structured commit message
      // security(fix): [CodeVulFixer] resolved [ID] in [Context]
      const context = finding.source === 'dependabot'
        ? finding.dependency?.packageName || 'dependencies'
        : finding.location?.filePath || 'security-audit';

      const advisoryId = finding.cveId || finding.ghsaId || finding.ruleId || finding.id;
      const commitMsg = `security(fix): [CodeVulFixer] resolved ${advisoryId} in ${context}\n\n${finding.title}\nRemediation: ${finding.remediationPlan}`;

      // 3. Populate VS Code SCM commit box if available
      try {
        const gitExtension = vscode.extensions.getExtension('vscode.git');
        if (gitExtension) {
          const gitApi = gitExtension.exports.getAPI(1);
          if (gitApi && gitApi.repositories.length > 0) {
            const repo = gitApi.repositories[0];
            repo.inputBox.value = commitMsg;
            logger.info('[SCM] Populated VS Code Git commit message box.');
          }
        }
      } catch (e) {
        logger.warn(`Could not set VS Code SCM input box: ${e}`);
      }

      vscode.window.showInformationMessage(
        `CodeVulFixer: Staged fixes for ${finding.id} and populated commit message.`
      );
      return true;
    } catch (error) {
      logger.error('Failed to stage files in Git', error);
      return false;
    }
  }

  /**
   * Reverts changes to modified files, rolling back workspace mutations.
   */
  public static async rollbackChanges(
    workspaceRoot: string,
    modifiedFiles: string[]
  ): Promise<boolean> {
    try {
      for (const file of modifiedFiles) {
        logger.info(`[SCM] Rolling back mutations in: ${file}`);
        try {
          await execAsync(`git restore "${file}"`, { cwd: workspaceRoot });
        } catch {
          await execAsync(`git checkout -- "${file}"`, { cwd: workspaceRoot });
        }
      }
      vscode.window.showWarningMessage(
        `CodeVulFixer: Rolled back workspace changes for ${modifiedFiles.join(', ')}.`
      );
      return true;
    } catch (error) {
      logger.error('Failed to rollback Git changes', error);
      return false;
    }
  }
}
