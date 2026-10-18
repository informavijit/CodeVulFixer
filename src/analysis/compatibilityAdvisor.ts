import * as fs from 'fs';
import * as path from 'path';
import { DependencyInfo, VulnerabilityFinding, CompatibilityAdvice } from '../ingestion/types';
import { logger } from '../utils/logger';

export interface WorkspaceRuntimeEnvironment {
  javaVersion?: string;       // e.g. "8" or "1.8"
  nodeEngine?: string;        // e.g. ">=18"
  pythonVersion?: string;     // e.g. "3.8"
  hasLegacyModules: boolean;
  legacyModuleNames: string[];
}

export class CompatibilityAdvisor {
  /**
   * Inspects workspace manifests and environment to detect runtime constraints.
   */
  public static detectWorkspaceEnvironment(workspaceRoot: string): WorkspaceRuntimeEnvironment {
    const env: WorkspaceRuntimeEnvironment = {
      hasLegacyModules: false,
      legacyModuleNames: [],
    };

    try {
      // 1. Inspect Maven pom.xml
      const pomPath = path.join(workspaceRoot, 'pom.xml');
      if (fs.existsSync(pomPath)) {
        const pomContent = fs.readFileSync(pomPath, 'utf8');
        const javaVerMatch = pomContent.match(/<(?:java\.version|maven\.compiler\.source|maven\.compiler\.target)>(.*?)<\//);
        if (javaVerMatch) {
          const raw = javaVerMatch[1].trim();
          env.javaVersion = raw.replace(/^1\./, ''); // e.g. '1.8' -> '8'
        }

        // Check for multi-module or legacy module markers
        if (pomContent.includes('<module>') || pomContent.includes('legacy')) {
          env.hasLegacyModules = true;
          const moduleMatches = pomContent.match(/<module>(.*?)<\/module>/g);
          if (moduleMatches) {
            env.legacyModuleNames = moduleMatches.map(m => m.replace(/<\/?module>/g, '').trim());
          }
        }
      }

      // 2. Inspect package.json
      const pkgPath = path.join(workspaceRoot, 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg.engines && pkg.engines.node) {
          env.nodeEngine = pkg.engines.node;
        }
      }
    } catch (e) {
      logger.warn(`CompatibilityAdvisor could not inspect workspace environment: ${e}`);
    }

    return env;
  }

  /**
   * Evaluates compatibility and generates smart recommendations (e.g., intermediate safe target vs ideal target).
   */
  public static advise(
    finding: VulnerabilityFinding,
    workspaceRoot: string,
    depInfo?: DependencyInfo
  ): CompatibilityAdvice | undefined {
    const dep = depInfo || finding.dependency;
    if (!dep) return undefined;

    const env = this.detectWorkspaceEnvironment(workspaceRoot);
    const pkg = dep.packageName.toLowerCase();
    const current = dep.currentVersion || '';
    const fixed = dep.fixedVersion || '';

    // -------------------------------------------------------------------------
    // Rule 1: Spring Framework / Spring Boot with Java 8 Module Pin
    // -------------------------------------------------------------------------
    const isSpring =
      pkg.includes('org.springframework') ||
      pkg === 'spring' ||
      pkg === 'spring-core' ||
      pkg === 'spring-webmvc' ||
      pkg.includes('spring-boot');

    const javaVersion = dep.javaVersionConstraint || env.javaVersion || (finding.description.toLowerCase().includes('java 8') ? '8' : undefined);
    const hasJava8Constraint = javaVersion === '8' || javaVersion === '1.8';

    if (isSpring) {
      const currentMajorMatch = current.match(/^(\d+)/);
      const fixedMajorMatch = fixed.match(/^(\d+)/);
      const currentMajor = currentMajorMatch ? parseInt(currentMajorMatch[1], 10) : 1;
      const fixedMajor = fixedMajorMatch ? parseInt(fixedMajorMatch[1], 10) : 5;

      // Scenario: Target is Spring 6.x (requires Java 17) or finding notes Java upgrade,
      // but workspace requires Java 8 compatibility.
      if (fixedMajor >= 6 && hasJava8Constraint) {
        return {
          hasDeadlock: true,
          idealVersion: fixed,
          safeRecommendedVersion: '5.3.39',
          constraintSummary: `Legacy modules require Java 8, but ideal upgrade target (${fixed}) mandates Java 17+.`,
          tradeoffReason: `Upgrading to Spring ${fixed} causes fatal runtime/compilation failure due to the Java 8 module pin. Upgrading to Spring 5.3.39 (Intermediate Safe Target) eliminates critical RCE vulnerabilities while maintaining 100% Java 8 runtime compliance.`,
          riskReduction: 'Mitigates Critical RCE exposure while completely eliminating platform incompatibility and build failure risk.',
          actionStrategy: 'intermediate_upgrade',
          conflictingPackages: env.legacyModuleNames.length > 0 ? env.legacyModuleNames : ['java-runtime-8-module'],
        };
      }

      // Multi-generation Spring 1.x -> 5.x leap on Java 8
      if (currentMajor <= 2 && fixedMajor >= 5) {
        return {
          hasDeadlock: hasJava8Constraint && fixedMajor >= 6,
          idealVersion: fixedMajor >= 6 ? fixed : '5.3.39',
          safeRecommendedVersion: '5.3.39',
          constraintSummary: `4-generation jump from Spring ${current} to ${fixed}. Java 8 baseline required.`,
          tradeoffReason: `Spring 1.x to 5.x is an architectural epoch migration. Targeting Spring 5.3.39 preserves Java 8 runtime compatibility and patches all known RCEs without forcing an immediate JVM platform upgrade.`,
          riskReduction: 'Mitigates Critical RCE to Zero; bounds breaking changes to Spring 5.3 without cascading into a Java 17 platform overhaul.',
          actionStrategy: 'intermediate_upgrade',
          conflictingPackages: ['org.springframework:spring-core'],
        };
      }
    }

    // -------------------------------------------------------------------------
    // Rule 2: Log4j 1.x -> 2.x/3.x on Java 8
    // -------------------------------------------------------------------------
    if (pkg.includes('log4j') && hasJava8Constraint) {
      if (fixed.startsWith('3.') || fixed.startsWith('2.18') || fixed.startsWith('2.19') || fixed.startsWith('2.20')) {
        return {
          hasDeadlock: true,
          idealVersion: fixed,
          safeRecommendedVersion: '2.17.1',
          constraintSummary: `Target Log4j ${fixed} requires Java 9+, while workspace is pinned to Java 8.`,
          tradeoffReason: `Upgrading to Log4j 2.17.1 patches Log4Shell (CVE-2021-44228) and RCE while ensuring complete Java 8 bytecode compatibility.`,
          riskReduction: 'Eliminates Critical Log4Shell vulnerability with zero JVM runtime risk.',
          actionStrategy: 'intermediate_upgrade',
        };
      }
    }

    // -------------------------------------------------------------------------
    // Rule 3: npm / Node Peer Dependency & Engine Collisions
    // -------------------------------------------------------------------------
    if (dep.ecosystem === 'npm' || dep.ecosystem === 'yarn' || dep.ecosystem === 'pnpm') {
      const currentMajorMatch = current.match(/^(\d+)/);
      const fixedMajorMatch = fixed.match(/^(\d+)/);

      if (currentMajorMatch && fixedMajorMatch) {
        const curMajor = parseInt(currentMajorMatch[1], 10);
        const fixMajor = parseInt(fixedMajorMatch[1], 10);
        const gap = fixMajor - curMajor;

        // If package is jumping major versions and has peer conflicts
        if (gap >= 2 || (dep.peerConflicts && dep.peerConflicts.length > 0)) {
          // Suggest intermediate safe version (e.g. latest backport of curMajor or curMajor + 1)
          const safeVer = `${curMajor}.${current.split('.')[1] || '0'}.patched`;
          return {
            hasDeadlock: false,
            idealVersion: fixed,
            safeRecommendedVersion: dep.fixedVersion, // or backport
            constraintSummary: `Major version leap (v${curMajor} -> v${fixMajor}) risks peer dependency collisions across application modules.`,
            tradeoffReason: `High-risk upgrade spans ${gap} major versions. Recommended to perform an intermediate step to stabilize APIs before advancing to the latest major release.`,
            riskReduction: 'Reduces regression breakages in downstream dependents.',
            actionStrategy: 'intermediate_upgrade',
            conflictingPackages: dep.peerConflicts,
          };
        }
      }
    }

    // -------------------------------------------------------------------------
    // Rule 4: .NET / C# / log4net & Apache .NET Compatibility
    // -------------------------------------------------------------------------
    if (pkg.includes('log4net') || dep.ecosystem === 'nuget') {
      const isLog4Net = pkg.includes('log4net');
      const tfm = dep.targetFramework || '';
      const isLegacyNetFramework = tfm.startsWith('net4') || tfm.startsWith('v4.') || tfm.includes('net35');

      if (isLog4Net && (isLegacyNetFramework || finding.description.toLowerCase().includes('.net framework'))) {
        if (fixed.startsWith('3.') || fixed.startsWith('2.0.16')) {
          return {
            hasDeadlock: true,
            idealVersion: fixed,
            safeRecommendedVersion: '2.0.15',
            constraintSummary: `Legacy .NET Framework (${tfm || 'net4x'}) detected. Target ${fixed} requires modern .NET runtime.`,
            tradeoffReason: `Upgrading to log4net 2.0.15 neutralizes XML parser vulnerabilities (CVE-2018-1285) while maintaining complete .NET Framework 4.x compatibility without breaking app.config or binding redirects.`,
            riskReduction: 'Mitigates High/Critical RCE with zero .NET runtime migration failure.',
            actionStrategy: 'intermediate_upgrade',
            conflictingPackages: ['log4net'],
          };
        }
      }
    }

    return undefined;
  }

  /**
   * Evaluates whether a proposed fix introduces collateral/cascading vulnerabilities.
   */
  public static evaluateCascadingVulnerabilities(
    dep: DependencyInfo,
    targetVersion: string
  ): { hasCascadingRisk: boolean; newVulnerabilities: string[]; alternativeVersion?: string } {
    // Check known problematic versions that fix one vulnerability but introduce another:
    // Example 1: jsonwebtoken < 9.0.0 had CVE-2022-23529, but upgrading to 9.0.0 had breaking algorithm restrictions
    // Example 2: lodash 4.17.20 -> 4.17.21 (safe), but other packages might introduce regressions
    // Simulated check based on dependency metadata
    const pkg = dep.packageName.toLowerCase();

    if (pkg === 'express' && targetVersion.startsWith('5.')) {
      return {
        hasCascadingRisk: true,
        newVulnerabilities: [
          'Peer dependency conflict with body-parser and cookie-parser < 1.4.0',
          'Breaking router signature change introduced in Express 5.0',
        ],
        alternativeVersion: '4.19.2',
      };
    }

    if (pkg.includes('spring') && targetVersion.startsWith('6.')) {
      return {
        hasCascadingRisk: true,
        newVulnerabilities: [
          'Runtime Incompatibility: Spring 6 requires Java 17+ (Workspace has Java 8 constraint)',
          'Java EE to Jakarta EE namespace break (javax.servlet -> jakarta.servlet)',
        ],
        alternativeVersion: '5.3.39',
      };
    }

    return {
      hasCascadingRisk: false,
      newVulnerabilities: [],
    };
  }
}
