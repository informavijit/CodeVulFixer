import * as fs from 'fs';
import * as path from 'path';
import { DependencyInfo } from '../ingestion/types';
import { logger } from '../utils/logger';

export class DependencyAnalyzer {
  /**
   * Refines dependency metadata by checking the actual workspace package manifest and lockfiles.
   */
  public static async analyze(
    workspaceRoot: string,
    dep: DependencyInfo
  ): Promise<DependencyInfo> {
    const updated = { ...dep };

    try {
      const packageJsonPath = path.join(workspaceRoot, dep.manifestFile || 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const raw = fs.readFileSync(packageJsonPath, 'utf8');
        const pkg = JSON.parse(raw);

        const inDirect =
          (pkg.dependencies && pkg.dependencies[dep.packageName]) ||
          (pkg.devDependencies && pkg.devDependencies[dep.packageName]) ||
          (pkg.peerDependencies && pkg.peerDependencies[dep.packageName]);

        if (inDirect) {
          updated.isDirect = true;
          updated.currentVersion = inDirect;
        } else {
          updated.isDirect = false; // Transitive dependency
        }
      }

      // Detect active lockfile
      if (fs.existsSync(path.join(workspaceRoot, 'package-lock.json'))) {
        updated.lockfile = 'package-lock.json';
        updated.ecosystem = 'npm';
      } else if (fs.existsSync(path.join(workspaceRoot, 'pnpm-lock.yaml'))) {
        updated.lockfile = 'pnpm-lock.yaml';
        updated.ecosystem = 'pnpm';
      } else if (fs.existsSync(path.join(workspaceRoot, 'yarn.lock'))) {
        updated.lockfile = 'yarn.lock';
        updated.ecosystem = 'yarn';
      } else if (fs.existsSync(path.join(workspaceRoot, 'uv.lock'))) {
        updated.lockfile = 'uv.lock';
        updated.ecosystem = 'uv';
      } else if (fs.existsSync(path.join(workspaceRoot, 'requirements.txt'))) {
        updated.lockfile = 'requirements.txt';
        updated.ecosystem = 'pip';
      }
    } catch (error) {
      logger.warn(`DependencyAnalyzer could not inspect manifest for ${dep.packageName}: ${error}`);
    }

    return updated;
  }
}
