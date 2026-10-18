import * as vscode from 'vscode';
import { VulnerabilityFinding, SprintDay, SprintState, PlanningMode } from '../ingestion/types';
import { ClubbingEngine } from '../analysis/clubbingEngine';

export interface SprintPlannerConfig {
  planningMode: PlanningMode;
  daysPerSprint: number; // e.g. 10 days for standard 2-week Agile sprint
  maxHighRiskPerDay: number;
  targetSprintDays: number;
}

export class SprintPlanner {
  /**
   * Reads user configuration settings with defaults.
   */
  public static getConfig(): SprintPlannerConfig {
    const config = vscode.workspace.getConfiguration('codevulfixer');
    return {
      planningMode: config.get<string>('planningMode', 'sprint_wise') as PlanningMode,
      daysPerSprint: config.get<number>('daysPerSprint', 10),
      maxHighRiskPerDay: config.get<number>('maxHighRiskPerDay', 3),
      targetSprintDays: config.get<number>('targetSprintDays', 4),
    };
  }

  /**
   * Plans remediation schedule based on chosen cadence (Day-wise vs Sprint-wise).
   */
  public static planSprints(
    findings: VulnerabilityFinding[],
    repoOwner: string,
    repoName: string,
    customConfig?: Partial<SprintPlannerConfig>
  ): SprintState {
    const config: SprintPlannerConfig = {
      ...this.getConfig(),
      ...customConfig,
    };

    const isSprintWise = config.planningMode === 'sprint_wise';
    const daysPerSprint = isSprintWise ? (config.daysPerSprint || 10) : 1;

    const depFindings = findings.filter((f) => f.source === 'dependabot');
    const csFindings = findings.filter((f) => f.source === 'code_scanning');

    // Helper to bucket findings by severity and size
    const categorize = (items: VulnerabilityFinding[]) => {
      const highSevLowEffort: VulnerabilityFinding[] = [];
      const highSevHighEffort: VulnerabilityFinding[] = [];
      const mediumLowHygiene: VulnerabilityFinding[] = [];

      for (const f of items) {
        const isHighSev = f.severity === 'critical' || f.severity === 'high';
        const isLowEffort = f.sizing?.size === 'S';

        if (isHighSev && isLowEffort) {
          highSevLowEffort.push(f);
        } else if (isHighSev) {
          highSevHighEffort.push(f);
        } else {
          mediumLowHygiene.push(f);
        }
      }
      return { highSevLowEffort, highSevHighEffort, mediumLowHygiene };
    };

    const depBuckets = categorize(depFindings);
    const csBuckets = categorize(csFindings);

    const sprints: SprintDay[] = [];
    const findingsMap: Record<string, VulnerabilityFinding> = {};
    let sprintIndex = 1;

    if (isSprintWise) {
      // =========================================================================
      // SPRINT-WISE PLAN (10 Days per Sprint / 2-Week Agile Cadence)
      // Phase 1: Dependabot Vulnerabilities are prioritized and planned first.
      // Phase 2: Code Scanning findings are planned next for subsequent sprints.
      // =========================================================================
      if (depFindings.length > 0) {
        const depSprint1Findings = [
          ...depBuckets.highSevLowEffort,
          ...depBuckets.highSevHighEffort.slice(0, 4),
        ];
        const depRemainingHigh = depBuckets.highSevHighEffort.slice(4);
        const depSprint2Findings = [
          ...depRemainingHigh,
          ...depBuckets.mediumLowHygiene.slice(0, 6),
        ];
        const depOverflow = depBuckets.mediumLowHygiene.slice(6);

        if (depSprint2Findings.length === 0 && depSprint1Findings.length > 0) {
          sprints.push(
            this.createSprintDay(
              sprintIndex++,
              config.planningMode,
              daysPerSprint,
              `Sprint 1 (${daysPerSprint}-Day Agile Sprint)`,
              `Sprint 1: Dependabot Vulnerabilities — Immediate Quick Wins & Dependency Upgrades (${daysPerSprint} Working Days)`,
              `Standard 2-week Agile sprint (${daysPerSprint} working days) targeting all direct lockfile bumps, quick-win patches, and core critical dependency advisories.`,
              depSprint1Findings,
              'dependabot'
            )
          );
        } else {
          sprints.push(
            this.createSprintDay(
              sprintIndex++,
              config.planningMode,
              daysPerSprint,
              `Sprint ${sprintIndex} (${daysPerSprint}-Day Agile Sprint)`,
              `Sprint 1: Dependabot Vulnerabilities — Critical Quick Wins & Direct Bumps (${daysPerSprint} Working Days)`,
              `Standard 2-week Agile sprint (${daysPerSprint} working days) targeting all direct lockfile bumps, quick-win patches, and core critical dependency advisories.`,
              depSprint1Findings,
              'dependabot'
            )
          );

          if (depSprint2Findings.length > 0) {
            const currentSprint = sprintIndex++;
            sprints.push(
              this.createSprintDay(
                currentSprint,
                config.planningMode,
                daysPerSprint,
                `Sprint ${currentSprint} (${daysPerSprint}-Day Agile Sprint)`,
                `Sprint ${currentSprint}: Dependabot Vulnerabilities — Architectural Upgrades & Framework Migrations (${daysPerSprint} Working Days)`,
                `Major version migrations, complex dependency refactoring, and regression test suites for Dependabot findings.`,
                depSprint2Findings,
                'dependabot'
              )
            );
          }

          if (depOverflow.length > 0) {
            const currentSprint = sprintIndex++;
            sprints.push(
              this.createSprintDay(
                currentSprint,
                config.planningMode,
                daysPerSprint,
                `Sprint ${currentSprint} (${daysPerSprint}-Day Agile Sprint)`,
                `Sprint ${currentSprint}: Dependabot Vulnerabilities — Secondary Package Hygiene & Clean-up (${daysPerSprint} Working Days)`,
                `Secondary dependency deprecation and lockfile alignment over ${daysPerSprint} working days.`,
                depOverflow,
                'dependabot'
              )
            );
          }
        }
      }

      // Phase 2: Code Scanning Findings
      if (csFindings.length > 0) {
        const csSprint1Findings = [
          ...csBuckets.highSevLowEffort,
          ...csBuckets.highSevHighEffort.slice(0, 4),
        ];
        const csRemainingHigh = csBuckets.highSevHighEffort.slice(4);
        const csSprint2Findings = [
          ...csRemainingHigh,
          ...csBuckets.mediumLowHygiene.slice(0, 6),
        ];
        const csOverflow = csBuckets.mediumLowHygiene.slice(6);

        const currentSprint = sprintIndex++;
        sprints.push(
          this.createSprintDay(
            currentSprint,
            config.planningMode,
            daysPerSprint,
            `Sprint ${currentSprint} (${daysPerSprint}-Day Agile Sprint)`,
            `Sprint ${currentSprint}: Code Scanning — Critical SAST Taint Flow & Injection Refactoring (${daysPerSprint} Working Days)`,
            `Standard 2-week Agile sprint (${daysPerSprint} working days) allocated for complex data-flow taint analysis, SQL/Command injection refactoring, and security verification.`,
            csSprint1Findings.length > 0 ? csSprint1Findings : csFindings,
            'code_scanning'
          )
        );

        if (csSprint2Findings.length > 0 && csSprint1Findings.length > 0) {
          const nextSprint = sprintIndex++;
          sprints.push(
            this.createSprintDay(
              nextSprint,
              config.planningMode,
              daysPerSprint,
              `Sprint ${nextSprint} (${daysPerSprint}-Day Agile Sprint)`,
              `Sprint ${nextSprint}: Code Scanning — SAST Code Hygiene & AST Transformations (${daysPerSprint} Working Days)`,
              `Medium/low SAST alerts, self-contained syntax updates, and structural security hygiene over ${daysPerSprint} working days.`,
              csSprint2Findings,
              'code_scanning'
            )
          );
        }

        if (csOverflow.length > 0) {
          const nextSprint = sprintIndex++;
          sprints.push(
            this.createSprintDay(
              nextSprint,
              config.planningMode,
              daysPerSprint,
              `Sprint ${nextSprint} (${daysPerSprint}-Day Agile Sprint)`,
              `Sprint ${nextSprint}: Code Scanning — Security Hygiene & Final Compliance Sweep (${daysPerSprint} Working Days)`,
              `Long-term code hygiene maintenance, secondary SAST warnings, and final compliance sign-off.`,
              csOverflow,
              'code_scanning'
            )
          );
        }
      }

      // Ensure at least 2 sprints if total findings >= 2
      if (sprints.length === 1 && findings.length >= 2) {
        const first = sprints[0];
        if (first.findings.length > 1) {
          const mid = Math.ceil(first.findings.length / 2);
          const f1Ids = first.findings.slice(0, mid);
          const f2Ids = first.findings.slice(mid);
          const f1 = f1Ids.map((id) => findings.find((f) => f.id === id)!).filter(Boolean);
          const f2 = f2Ids.map((id) => findings.find((f) => f.id === id)!).filter(Boolean);
          sprints.length = 0;
          sprints.push(
            this.createSprintDay(
              1,
              config.planningMode,
              daysPerSprint,
              `Sprint 1 (${daysPerSprint}-Day Agile Sprint)`,
              first.title,
              first.description,
              f1,
              first.category
            )
          );
          sprints.push(
            this.createSprintDay(
              2,
              config.planningMode,
              daysPerSprint,
              `Sprint 2 (${daysPerSprint}-Day Agile Sprint)`,
              `Sprint 2: Secondary Remediation & Verification (${daysPerSprint} Working Days)`,
              first.description,
              f2,
              first.category
            )
          );
        }
      }
    } else {
      // =========================================================================
      // DAY-WISE PLAN (1 Day per Micro-Chunk / Daily Focus Cadence)
      // Dependabot Vulnerability daily chunks first, then Code Scanning daily chunks.
      // =========================================================================
      if (depFindings.length > 0) {
        const depDay1 = [...depBuckets.highSevLowEffort];
        if (depDay1.length < 3 && depBuckets.mediumLowHygiene.length > 0) {
          depDay1.push(...depBuckets.mediumLowHygiene.splice(0, 2));
        }

        sprints.push(
          this.createSprintDay(
            sprintIndex++,
            config.planningMode,
            1,
            'Day 1 (Daily Focus)',
            'Day 1: Dependabot Immediate Quick Wins (1 Day Duration)',
            'Direct dependency lockfile bumps, transitive deduplications, and self-contained updates.',
            depDay1.length > 0 ? depDay1 : depFindings.slice(0, 2),
            'dependabot'
          )
        );

        const depHighRisk = depBuckets.highSevHighEffort.slice(0, config.maxHighRiskPerDay);
        const depOverflowHigh = depBuckets.highSevHighEffort.slice(config.maxHighRiskPerDay);
        const depDay2 = depHighRisk.length > 0 ? depHighRisk : depFindings.slice(2, 2 + config.maxHighRiskPerDay);

        if (depDay2.length > 0) {
          sprints.push(
            this.createSprintDay(
              sprintIndex++,
              config.planningMode,
              1,
              'Day 2 (Daily Focus)',
              `Day 2: Dependabot High-Risk Architectural Items (Capped at ${config.maxHighRiskPerDay}/day)`,
              'High-severity dependency upgrades, multi-major jumps, and framework compatibility refactoring.',
              depDay2,
              'dependabot'
            )
          );
        }

        const depRemaining = [...depOverflowHigh, ...depBuckets.mediumLowHygiene];
        if (depRemaining.length > 0) {
          const currentDayNum = sprintIndex;
          sprints.push(
            this.createSprintDay(
              sprintIndex++,
              config.planningMode,
              1,
              `Day ${currentDayNum} (Daily Focus)`,
              `Day ${currentDayNum}: Dependabot Security Hygiene & Secondary Packages`,
              'Secondary package bumps, minor lockfile updates, and dependency maintenance.',
              depRemaining,
              'dependabot'
            )
          );
        }
      }

      // Next: Code Scanning Days
      if (csFindings.length > 0) {
        const csDayNum = sprintIndex;
        const csDay1 = [...csBuckets.highSevLowEffort];
        if (csDay1.length < 2 && csBuckets.mediumLowHygiene.length > 0) {
          csDay1.push(...csBuckets.mediumLowHygiene.splice(0, 1));
        }

        sprints.push(
          this.createSprintDay(
            sprintIndex++,
            config.planningMode,
            1,
            `Day ${csDayNum} (Daily Focus)`,
            `Day ${csDayNum}: Code Scanning Quick Wins & AST Patterns (1 Day Duration)`,
            'Self-contained syntax replacements, sanitized assignments, and deterministic AST patterns.',
            csDay1.length > 0 ? csDay1 : csFindings.slice(0, 2),
            'code_scanning'
          )
        );

        const csHighRisk = csBuckets.highSevHighEffort.slice(0, config.maxHighRiskPerDay);
        const csOverflowHigh = csBuckets.highSevHighEffort.slice(config.maxHighRiskPerDay);
        const csDay2Findings = csHighRisk.length > 0 ? csHighRisk : csFindings.slice(2, 2 + config.maxHighRiskPerDay);

        if (csDay2Findings.length > 0) {
          const currentDayNum = sprintIndex;
          sprints.push(
            this.createSprintDay(
              sprintIndex++,
              config.planningMode,
              1,
              `Day ${currentDayNum} (Daily Focus)`,
              `Day ${currentDayNum}: Code Scanning Complex Injections (Capped at ${config.maxHighRiskPerDay}/day)`,
              'Complex data-flow taint analysis, SQL injection refactoring, and command execution parameterization.',
              csDay2Findings,
              'code_scanning'
            )
          );
        }

        const csRemaining = [...csOverflowHigh, ...csBuckets.mediumLowHygiene];
        if (csRemaining.length > 0) {
          const currentDayNum = sprintIndex;
          sprints.push(
            this.createSprintDay(
              sprintIndex++,
              config.planningMode,
              1,
              `Day ${currentDayNum}+ (Daily Focus)`,
              `Day ${currentDayNum}: Code Scanning Security Hygiene Sweep`,
              'Medium and low static analysis findings, boundary checks, and final validation.',
              csRemaining,
              'code_scanning'
            )
          );
        }
      }
    }

    // Populate findingsMap and update targetSprint on each finding
    for (const f of findings) {
      findingsMap[f.id] = { ...f };
    }

    let totalEstHours = 0;
    for (const s of sprints) {
      for (const id of s.findings) {
        if (findingsMap[id]) {
          findingsMap[id].targetSprint = s.sprintNumber;
          totalEstHours += findingsMap[id].sizing?.estimatedHours || 0;
        }
      }
    }

    // Sizing and estimation separated calculations
    const depTotalHours = Math.round(depFindings.reduce((sum, f) => sum + (f.sizing?.estimatedHours || 0), 0) * 10) / 10;
    const csTotalHours = Math.round(csFindings.reduce((sum, f) => sum + (f.sizing?.estimatedHours || 0), 0) * 10) / 10;

    const state: SprintState = {
      version: '1.0.3',
      repoOwner,
      repoName,
      lastUpdated: new Date().toISOString(),
      planningMode: config.planningMode,
      daysPerSprint,
      sprints,
      findings: findingsMap,
      activeSprint: 1,
      metrics: {
        totalFindings: findings.length,
        resolvedCount: 0,
        pendingCount: findings.length,
        failedCount: 0,
        totalEstimatedHours: Math.round(totalEstHours * 10) / 10,
        hoursSaved: Math.round(totalEstHours * 0.75 * 10) / 10,
        dependabotMetrics: {
          totalFindings: depFindings.length,
          criticalCount: depFindings.filter((f) => f.severity === 'critical').length,
          highCount: depFindings.filter((f) => f.severity === 'high').length,
          mediumCount: depFindings.filter((f) => f.severity === 'medium').length,
          lowCount: depFindings.filter((f) => f.severity === 'low').length,
          resolvedCount: 0,
          pendingCount: depFindings.length,
          failedCount: 0,
          totalEstimatedHours: depTotalHours,
          hoursSaved: Math.round(depTotalHours * 0.75 * 10) / 10,
        },
        codeScanningMetrics: {
          totalFindings: csFindings.length,
          criticalCount: csFindings.filter((f) => f.severity === 'critical').length,
          highCount: csFindings.filter((f) => f.severity === 'high').length,
          mediumCount: csFindings.filter((f) => f.severity === 'medium').length,
          lowCount: csFindings.filter((f) => f.severity === 'low').length,
          resolvedCount: 0,
          pendingCount: csFindings.length,
          failedCount: 0,
          totalEstimatedHours: csTotalHours,
          hoursSaved: Math.round(csTotalHours * 0.75 * 10) / 10,
        },
      },
      clubbingSummary: ClubbingEngine.analyzeClusters(Object.values(findingsMap)),
    };

    return state;
  }

  private static createSprintDay(
    sprintNumber: number,
    planningMode: PlanningMode,
    durationDays: number,
    dayLabel: string,
    title: string,
    description: string,
    findings: VulnerabilityFinding[],
    category?: 'dependabot' | 'code_scanning'
  ): SprintDay {
    const totalHours = findings.reduce((sum, f) => sum + (f.sizing?.estimatedHours || 0), 0);
    return {
      sprintNumber,
      planningMode,
      durationDays,
      dayLabel,
      title,
      description,
      findings: findings.map((f) => f.id),
      totalEstimatedHours: Math.round(totalHours * 10) / 10,
      status: sprintNumber === 1 ? 'in_progress' : 'pending',
      category,
    };
  }
}
