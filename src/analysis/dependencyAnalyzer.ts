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

      // Check Maven pom.xml
      const pomPath = path.join(workspaceRoot, dep.manifestFile || 'pom.xml');
      if (fs.existsSync(pomPath) && (dep.ecosystem === 'maven' || dep.packageName.includes(':') || dep.packageName.includes('spring'))) {
        const pomContent = fs.readFileSync(pomPath, 'utf8');
        updated.manifestFile = 'pom.xml';
        updated.ecosystem = 'maven';

        const javaVerMatch = pomContent.match(/<(?:java\.version|maven\.compiler\.source|maven\.compiler\.target)>(.*?)<\//);
        if (javaVerMatch) {
          updated.javaVersionConstraint = javaVerMatch[1].trim().replace(/^1\./, '');
        }

        // Check if package is direct in pom.xml
        const shortName = dep.packageName.split(':').pop() || dep.packageName;
        if (pomContent.includes(`<artifactId>${shortName}</artifactId>`) || pomContent.includes(dep.packageName)) {
          updated.isDirect = true;
        }
      }

      // Check .NET / C# .csproj (NuGet, log4net, etc.)
      const isDotNet = dep.ecosystem === 'nuget' ||
        dep.packageName.toLowerCase().includes('log4net') ||
        dep.packageName.toLowerCase().includes('microsoft.') ||
        dep.packageName.toLowerCase().includes('system.');

      if (isDotNet || dep.manifestFile?.endsWith('.csproj')) {
        const files = fs.readdirSync(workspaceRoot);
        const csproj = files.find(f => f.endsWith('.csproj'));
        if (csproj) {
          const csprojContent = fs.readFileSync(path.join(workspaceRoot, csproj), 'utf8');
          updated.manifestFile = csproj;
          updated.ecosystem = 'nuget';

          // Extract TargetFramework (e.g. net48, net6.0, net8.0, netstandard2.0)
          const tfmMatch = csprojContent.match(/<TargetFramework(?:Version)?>(.*?)<\/TargetFramework(?:Version)?>/);
          if (tfmMatch) {
            updated.targetFramework = tfmMatch[1].trim();
          }

          if (csprojContent.toLowerCase().includes(dep.packageName.toLowerCase())) {
            updated.isDirect = true;
          }
        }
      }

      // Detect active lockfile & build manifest across ecosystems
      if (fs.existsSync(path.join(workspaceRoot, 'package-lock.json'))) {
        updated.lockfile = 'package-lock.json';
        if (updated.ecosystem !== 'maven' && updated.ecosystem !== 'nuget') updated.ecosystem = 'npm';
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
      } else if (fs.existsSync(path.join(workspaceRoot, 'Cargo.lock')) || fs.existsSync(path.join(workspaceRoot, 'Cargo.toml'))) {
        updated.lockfile = fs.existsSync(path.join(workspaceRoot, 'Cargo.lock')) ? 'Cargo.lock' : 'Cargo.toml';
        updated.manifestFile = 'Cargo.toml';
        updated.ecosystem = 'cargo';
      } else if (fs.existsSync(path.join(workspaceRoot, 'go.mod'))) {
        updated.lockfile = 'go.sum';
        updated.manifestFile = 'go.mod';
        updated.ecosystem = 'go';
      } else if (fs.existsSync(path.join(workspaceRoot, 'CMakeLists.txt')) || fs.existsSync(path.join(workspaceRoot, 'vcpkg.json'))) {
        updated.manifestFile = fs.existsSync(path.join(workspaceRoot, 'CMakeLists.txt')) ? 'CMakeLists.txt' : 'vcpkg.json';
        updated.ecosystem = 'cpp';
        // Extract C++ standard (e.g. CMAKE_CXX_STANDARD 17)
        if (fs.existsSync(path.join(workspaceRoot, 'CMakeLists.txt'))) {
          const cmake = fs.readFileSync(path.join(workspaceRoot, 'CMakeLists.txt'), 'utf8');
          const stdMatch = cmake.match(/CMAKE_CXX_STANDARD\s+(\d+)/);
          if (stdMatch) updated.cppStandard = `c++${stdMatch[1]}`;
        }
      }

      // Compute majorGap
      const curMatch = updated.currentVersion.match(/(\d+)/);
      const fixMatch = updated.fixedVersion.match(/(\d+)/);
      if (curMatch && fixMatch) {
        const curMajor = parseInt(curMatch[1], 10);
        const fixMajor = parseInt(fixMatch[1], 10);
        updated.majorGap = Math.max(1, fixMajor - curMajor);
      }
    } catch (error) {
      logger.warn(`DependencyAnalyzer could not inspect manifest for ${dep.packageName}: ${error}`);
    }

    return updated;
  }
}
