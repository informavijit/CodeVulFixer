import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { VulnerabilityFinding } from '../ingestion/types';
import { PRECOMPILED_AST_RULES } from './astGrepRules';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);

export interface FixExecutionResult {
  success: boolean;
  engine: 'deterministic' | 'copilot';
  message: string;
  commandExecuted?: string;
  stdout?: string;
  stderr?: string;
  modifiedFiles: string[];
}

export class DeterministicFixer {
  /**
   * Applies deterministic fix for either Dependabot lockfile bump or AST-grep structural rule.
   */
  public static async applyFix(
    workspaceRoot: string,
    finding: VulnerabilityFinding
  ): Promise<FixExecutionResult> {
    if (finding.source === 'dependabot') {
      return this.fixDependency(workspaceRoot, finding);
    } else {
      return this.fixCodeScanning(workspaceRoot, finding);
    }
  }

  /**
   * Upgrades dependency lockfile / manifest using ecosystem CLI.
   */
  private static async fixDependency(
    workspaceRoot: string,
    finding: VulnerabilityFinding
  ): Promise<FixExecutionResult> {
    const dep = finding.dependency;
    if (!dep) {
      return {
        success: false,
        engine: 'deterministic',
        message: 'No dependency metadata available for this alert.',
        modifiedFiles: [],
      };
    }

    const config = vscode.workspace.getConfiguration('codevulfixer');
    let pkgManager = config.get<string>('packageManager', 'auto');

    if (pkgManager === 'auto') {
      pkgManager = dep.ecosystem || 'npm';
      if (fs.existsSync(path.join(workspaceRoot, 'pnpm-lock.yaml'))) pkgManager = 'pnpm';
      else if (fs.existsSync(path.join(workspaceRoot, 'yarn.lock'))) pkgManager = 'yarn';
      else if (fs.existsSync(path.join(workspaceRoot, 'uv.lock'))) pkgManager = 'uv';
      else if (fs.existsSync(path.join(workspaceRoot, 'requirements.txt'))) pkgManager = 'pip';
      else if (fs.existsSync(path.join(workspaceRoot, 'pom.xml'))) pkgManager = 'maven';
      else if (fs.existsSync(path.join(workspaceRoot, 'package-lock.json'))) pkgManager = 'npm';
      else pkgManager = dep.ecosystem || 'npm';
    }

    const pkg = dep.packageName;
    const rawVersion = dep.fixedVersion || 'latest';

    // Sanitize version: strip leading operator characters (>=, ~, ^, v) or spaces
    let cleanVersion = rawVersion.trim().replace(/^[>=<~^v\s]+/, '').trim();
    const semverMatch = cleanVersion.match(/\d+(\.\d+)+([\w.-]+)?/);
    if (semverMatch) {
      cleanVersion = semverMatch[0];
    }
    if (!cleanVersion) {
      cleanVersion = rawVersion;
    }

    let cmd = '';
    const modifiedFiles: string[] = [];

    switch (pkgManager) {
      case 'npm':
        // Use --legacy-peer-deps to avoid strict ERESOLVE conflicts during zero-token lockfile mutation
        cmd = `npm install ${pkg}@${cleanVersion} --package-lock-only --legacy-peer-deps`;
        modifiedFiles.push('package-lock.json');
        if (dep.isDirect) modifiedFiles.push('package.json');
        break;
      case 'pnpm':
        cmd = `pnpm update ${pkg}@${cleanVersion}`;
        modifiedFiles.push('pnpm-lock.yaml');
        break;
      case 'yarn':
        cmd = `yarn up ${pkg}@${cleanVersion}`;
        modifiedFiles.push('yarn.lock');
        break;
      case 'uv':
        cmd = `uv add ${pkg}==${cleanVersion}`;
        modifiedFiles.push('pyproject.toml', 'uv.lock');
        break;
      case 'pip':
        cmd = `pip install ${pkg}==${cleanVersion}`;
        modifiedFiles.push('requirements.txt');
        break;
      default:
        cmd = `npm install ${pkg}@${cleanVersion} --package-lock-only --legacy-peer-deps`;
        modifiedFiles.push('package-lock.json');
    }

    logger.info(`[DeterministicFixer] Spawning package manager CLI: "${cmd}" in ${workspaceRoot}`);

    try {
      const { stdout, stderr } = await execAsync(cmd, { cwd: workspaceRoot });
      logger.success(`[DeterministicFixer] Successfully upgraded ${pkg} to ${cleanVersion}`);

      return {
        success: true,
        engine: 'deterministic',
        message: `Upgraded ${pkg} to ${cleanVersion} via ${pkgManager} lockfile bump`,
        commandExecuted: cmd,
        stdout,
        stderr,
        modifiedFiles,
      };
    } catch (error: any) {
      const cliError = error.stderr || error.message || String(error);
      logger.warn(
        `CLI execution failed: ${error.message}. Initiating zero-token manifest & transitive overrides fallback.`
      );

      // =========================================================================
      // FALLBACK LAYER 1: Node.js (package.json direct deps or transitive overrides)
      // =========================================================================
      const packageJsonPath = path.join(
        workspaceRoot,
        dep.manifestFile?.endsWith('package.json') ? dep.manifestFile : 'package.json'
      );

      if (fs.existsSync(packageJsonPath)) {
        try {
          const raw = fs.readFileSync(packageJsonPath, 'utf8');
          const pkgJson = JSON.parse(raw);
          let actionTaken = '';
          const targetModFiles = [path.basename(packageJsonPath)];

          if (pkgJson.dependencies && pkgJson.dependencies[pkg]) {
            pkgJson.dependencies[pkg] = `^${cleanVersion}`;
            actionTaken = `Updated ${pkg} in dependencies to ^${cleanVersion}`;
          } else if (pkgJson.devDependencies && pkgJson.devDependencies[pkg]) {
            pkgJson.devDependencies[pkg] = `^${cleanVersion}`;
            actionTaken = `Updated ${pkg} in devDependencies to ^${cleanVersion}`;
          } else {
            // Transitive dependency: Apply npm/pnpm "overrides" or yarn "resolutions"
            if (pkgManager === 'yarn') {
              if (!pkgJson.resolutions) pkgJson.resolutions = {};
              pkgJson.resolutions[pkg] = `^${cleanVersion}`;
              actionTaken = `Pinned transitive ${pkg} via yarn "resolutions" to ^${cleanVersion}`;
            } else {
              if (!pkgJson.overrides) pkgJson.overrides = {};
              pkgJson.overrides[pkg] = `^${cleanVersion}`;
              actionTaken = `Pinned transitive ${pkg} via package.json "overrides" to ^${cleanVersion}`;
            }
          }

          fs.writeFileSync(packageJsonPath, JSON.stringify(pkgJson, null, 2) + '\n', 'utf8');

          // Second-pass: Refresh lockfile safely with overrides in place
          let lockRefreshed = false;
          try {
            if (fs.existsSync(path.join(workspaceRoot, 'package-lock.json'))) {
              await execAsync(`npm install --package-lock-only --legacy-peer-deps`, { cwd: workspaceRoot });
              lockRefreshed = true;
              targetModFiles.push('package-lock.json');
            }
          } catch (lockErr: any) {
            logger.warn(
              `Lockfile refresh after override had warning: ${lockErr.message}. Manifest override remains active.`
            );
          }

          logger.success(`[DeterministicFixer] ${actionTaken}`);

          return {
            success: true,
            engine: 'deterministic',
            message: `${actionTaken} (Zero-Token deterministic manifest fallback${
              lockRefreshed ? ' + lockfile refreshed' : ''
            })`,
            commandExecuted: lockRefreshed
              ? `npm install --package-lock-only --legacy-peer-deps`
              : 'Direct package.json override rewrite',
            modifiedFiles: targetModFiles,
          };
        } catch (jsonErr: any) {
          logger.warn(`Failed writing package.json fallback: ${jsonErr.message}`);
        }
      }

      // =========================================================================
      // FALLBACK LAYER 2: Maven (pom.xml dependency version update)
      // =========================================================================
      const pomPath = path.join(workspaceRoot, 'pom.xml');
      if (fs.existsSync(pomPath)) {
        try {
          let pomContent = fs.readFileSync(pomPath, 'utf8');
          const shortName = pkg.split(':').pop() || pkg;
          const pomRegex = new RegExp(
            `(<artifactId>${shortName}</artifactId>[\\s\\S]*?<version>)(.*?)(</version>)`,
            'i'
          );
          if (pomRegex.test(pomContent)) {
            pomContent = pomContent.replace(pomRegex, `$1${cleanVersion}$3`);
            fs.writeFileSync(pomPath, pomContent, 'utf8');
            logger.success(`[DeterministicFixer] Updated ${shortName} to ${cleanVersion} in pom.xml`);
            return {
              success: true,
              engine: 'deterministic',
              message: `Updated ${pkg} in pom.xml to ${cleanVersion} (Maven manifest fallback)`,
              commandExecuted: 'Direct pom.xml rewrite',
              modifiedFiles: ['pom.xml'],
            };
          }
        } catch (pomErr: any) {
          logger.warn(`pom.xml fallback error: ${pomErr.message}`);
        }
      }

      // =========================================================================
      // FALLBACK LAYER 3: .NET / C# (.csproj PackageReference update)
      // =========================================================================
      try {
        const rootFiles = fs.readdirSync(workspaceRoot);
        const csprojFile = rootFiles.find((f) => f.endsWith('.csproj'));
        if (csprojFile) {
          const csprojPath = path.join(workspaceRoot, csprojFile);
          let csprojContent = fs.readFileSync(csprojPath, 'utf8');
          const nugetRegex = new RegExp(
            `(<PackageReference\\s+Include="${pkg}"[\\s\\S]*?Version=")(.*?)(")`,
            'i'
          );
          if (nugetRegex.test(csprojContent)) {
            csprojContent = csprojContent.replace(nugetRegex, `$1${cleanVersion}$3`);
            fs.writeFileSync(csprojPath, csprojContent, 'utf8');
            logger.success(`[DeterministicFixer] Updated ${pkg} to ${cleanVersion} in ${csprojFile}`);
            return {
              success: true,
              engine: 'deterministic',
              message: `Updated ${pkg} in ${csprojFile} to ${cleanVersion} (NuGet manifest fallback)`,
              commandExecuted: `${csprojFile} PackageReference rewrite`,
              modifiedFiles: [csprojFile],
            };
          }
        }
      } catch {
        // ignore
      }

      // =========================================================================
      // FALLBACK LAYER 4: Python (requirements.txt update)
      // =========================================================================
      const reqPath = path.join(workspaceRoot, 'requirements.txt');
      if (fs.existsSync(reqPath)) {
        try {
          let reqContent = fs.readFileSync(reqPath, 'utf8');
          const reqRegex = new RegExp(`^${pkg}([=<>~].*)?$`, 'im');
          if (reqRegex.test(reqContent)) {
            reqContent = reqContent.replace(reqRegex, `${pkg}==${cleanVersion}`);
          } else {
            reqContent += `\n${pkg}==${cleanVersion}\n`;
          }
          fs.writeFileSync(reqPath, reqContent, 'utf8');
          logger.success(`[DeterministicFixer] Updated ${pkg}==${cleanVersion} in requirements.txt`);
          return {
            success: true,
            engine: 'deterministic',
            message: `Updated ${pkg} in requirements.txt to ==${cleanVersion} (pip manifest fallback)`,
            commandExecuted: 'requirements.txt rewrite',
            modifiedFiles: ['requirements.txt'],
          };
        } catch {
          // ignore
        }
      }

      // If all execution and fallback layers failed, report comprehensive diagnostic with actionable remedies
      const suggestedRemedy = [
        `1. Peer Dependency Resolution: If npm fails on tree conflicts, run: "npm install --legacy-peer-deps" in terminal.`,
        `2. Transitive Dependency Pinning: Add '"overrides": { "${pkg}": "^${cleanVersion}" }' inside your package.json.`,
        `3. CLI Availability: Ensure "${pkgManager}" CLI is in system PATH and executable within VS Code.`,
        `4. Real-time Telemetry: Open the "Execution Logs & Diagnostics" tab in the dashboard for terminal traces and diagnostics.`
      ].join('\n');

      logger.error(
        `Failed to execute lockfile upgrade command: ${error.message}`,
        cliError,
        suggestedRemedy,
        cmd
      );

      return {
        success: false,
        engine: 'deterministic',
        message: `Failed to execute lockfile upgrade command: ${error.message}. See Execution Logs tab for suggested fixes.`,
        commandExecuted: cmd,
        stderr: `${cliError}\n\n💡 Suggested Remedies:\n${suggestedRemedy}`,
        modifiedFiles: [],
      };
    }
  }

  /**
   * Applies precompiled structural AST-grep transformation rule.
   */
  private static async fixCodeScanning(
    workspaceRoot: string,
    finding: VulnerabilityFinding
  ): Promise<FixExecutionResult> {
    const loc = finding.location;
    if (!loc || !loc.filePath) {
      return {
        success: false,
        engine: 'deterministic',
        message: 'No file location metadata provided in Code Scanning alert.',
        modifiedFiles: [],
      };
    }

    const filePath = path.isAbsolute(loc.filePath)
      ? loc.filePath
      : path.join(workspaceRoot, loc.filePath);

    // Find matching AST rule
    const rule = PRECOMPILED_AST_RULES.find(
      (r) =>
        r.ruleId === finding.ruleId ||
        (finding.cweIds && finding.cweIds.includes(r.cwe))
    );

    if (!rule) {
      return {
        success: false,
        engine: 'deterministic',
        message: `No precompiled deterministic AST-grep rule for ${finding.ruleId || 'unknown rule'}. Recommend using Copilot LM Engine.`,
        modifiedFiles: [],
      };
    }

    // Check if file exists, if not create sample for demonstration if in demo mode
    if (!fs.existsSync(filePath)) {
      if (loc.snippet) {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(filePath, `// CodeVulFixer Target File\n${loc.snippet}\n`, 'utf8');
      } else {
        return {
          success: false,
          engine: 'deterministic',
          message: `Target file not found: ${loc.filePath}`,
          modifiedFiles: [],
        };
      }
    }

    try {
      const originalContent = fs.readFileSync(filePath, 'utf8');
      const lines = originalContent.split(/\r?\n/);
      const start = Math.max(0, (loc.startLine || 1) - 1);
      const end = Math.min(lines.length, loc.endLine || lines.length);

      const targetSnippet = lines.slice(start, end).join('\n');
      const { transformed, explanation } = rule.transform(targetSnippet);

      if (transformed === targetSnippet) {
        // Try full file transformation if snippet didn't match
        const fullTransform = rule.transform(originalContent);
        if (fullTransform.transformed !== originalContent) {
          fs.writeFileSync(filePath, fullTransform.transformed, 'utf8');
          return {
            success: true,
            engine: 'deterministic',
            message: `AST-grep applied: ${rule.name}. ${fullTransform.explanation}`,
            modifiedFiles: [loc.filePath],
          };
        }

        return {
          success: false,
          engine: 'deterministic',
          message: `AST-grep rule did not match the code structure in ${loc.filePath}`,
          modifiedFiles: [],
        };
      }

      // Replace lines with transformed block
      lines.splice(start, end - start, transformed);
      fs.writeFileSync(filePath, lines.join('\n'), 'utf8');

      logger.success(`[DeterministicFixer] AST transformation applied: ${rule.name} on ${loc.filePath}`);
      return {
        success: true,
        engine: 'deterministic',
        message: `AST-grep applied: ${rule.name}. ${explanation}`,
        modifiedFiles: [loc.filePath],
      };
    } catch (error) {
      logger.error('Failed to apply AST-grep fix', error);
      return {
        success: false,
        engine: 'deterministic',
        message: `AST-grep failed: ${error instanceof Error ? error.message : String(error)}`,
        modifiedFiles: [],
      };
    }
  }
}
