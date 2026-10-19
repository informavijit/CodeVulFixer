import { Octokit } from '@octokit/rest';
import { logger } from '../utils/logger';

export class OctokitClientFactory {
  public static create(token: string): Octokit {
    logger.info('Initializing Octokit client with user session token.');
    return new Octokit({
      auth: token,
      userAgent: 'CodeVulFixer-VSCode-Extension/1.0.5',
    });
  }
}
