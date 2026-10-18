import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';
import { GitRepoMetadata } from './types';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);

export class GitResolver {
  /**
   * Resolves the primary workspace folder path.
   */
  public static getPrimaryWorkspacePath(): string | undefined {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) {
      return undefined;
    }
    return folders[0].uri.fsPath;
  }

  /**
   * Resolves Git metadata for the active workspace folder.
   */
  public static async resolveRepoMetadata(): Promise<GitRepoMetadata | undefined> {
    const workspaceRoot = this.getPrimaryWorkspacePath();
    if (!workspaceRoot) {
      logger.warn('No active workspace folder found.');
      return undefined;
    }

    try {
      // 1. Get remote URL
      const { stdout: remoteOut } = await execAsync('git config --get remote.origin.url', {
        cwd: workspaceRoot,
      });
      const remoteUrl = remoteOut.trim();
      if (!remoteUrl) {
        logger.warn('No Git remote origin configured in workspace.');
        return undefined;
      }

      // 2. Parse owner and repo name from remote URL
      const parsed = this.parseGitHubUrl(remoteUrl);
      if (!parsed) {
        logger.warn(`Could not parse GitHub owner/repo from remote URL: ${remoteUrl}`);
        return undefined;
      }

      // 3. Optional: Get current branch
      let currentBranch = 'main';
      try {
        const { stdout: branchOut } = await execAsync('git rev-parse --abbrev-ref HEAD', {
          cwd: workspaceRoot,
        });
        currentBranch = branchOut.trim() || 'main';
      } catch {
        // Fallback to default
      }

      const meta: GitRepoMetadata = {
        owner: parsed.owner,
        repo: parsed.repo,
        remoteUrl,
        currentBranch,
      };

      logger.info(`Resolved GitHub repository: ${meta.owner}/${meta.repo} (branch: ${meta.currentBranch})`);
      return meta;
    } catch (error) {
      logger.warn(`Git resolution failed or workspace is not a git repository: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  /**
   * Parses various GitHub remote URL schemes:
   * - https://github.com/owner/repo.git
   * - git@github.com:owner/repo.git
   * - ssh://git@github.com/owner/repo.git
   */
  public static parseGitHubUrl(url: string): { owner: string; repo: string } | undefined {
    const cleanUrl = url.trim();

    // Regex for HTTPS or SSH URLs
    // matches: github.com[:/](owner)/(repo)(.git)?
    const match = cleanUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)(?:\.git)?$/i);
    if (match && match[1] && match[2]) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, ''),
      };
    }

    return undefined;
  }
}
