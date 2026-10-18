import * as vscode from 'vscode';
import { logger } from '../utils/logger';

export class GitHubAuthService {
  private static readonly SCOPES = ['repo', 'security_events'];

  /**
   * Retrieves an active GitHub authentication session or prompts the user.
   * Uses VS Code's native authentication provider.
   */
  public static async getSession(createIfNone = true): Promise<vscode.AuthenticationSession | undefined> {
    try {
      logger.info(`Requesting GitHub session with scopes: [${GitHubAuthService.SCOPES.join(', ')}]`);
      
      const session = await vscode.authentication.getSession('github', GitHubAuthService.SCOPES, {
        createIfNone,
      });

      if (session) {
        logger.success(`GitHub authentication successful for user: ${session.account.label}`);
        return session;
      } else {
        logger.warn('GitHub authentication session was not granted or cancelled by user.');
        return undefined;
      }
    } catch (error) {
      logger.error('Failed to obtain GitHub authentication session', error);
      throw error;
    }
  }

  /**
   * Quick check whether a valid GitHub session is already stored.
   */
  public static async hasExistingSession(): Promise<boolean> {
    try {
      const session = await vscode.authentication.getSession('github', GitHubAuthService.SCOPES, {
        createIfNone: false,
      });
      return !!session;
    } catch {
      return false;
    }
  }
}
