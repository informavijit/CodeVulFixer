import * as vscode from 'vscode';
import { VulnerabilityFinding, SprintDay, SprintState, PlanningMode } from '../ingestion/types';

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

    // 1. Classify findings by severity and sizing effort
    const highSevLowEffort: VulnerabilityFinding[] = [];
    const highSevHighEffort: VulnerabilityFinding[] = [];
    const mediumLowHygiene: VulnerabilityFinding[] = [];

    for (const f of findings) {
      const isHighSev = f.severity === 'critical' || f.severity === 'high';
      const isLowEffort = f.sizing.size === 'S';

      if (isHighSev && isLowEffort) {
        highSevLowEffort.push(f);
      } else if (isHighSev) {
        highSevHighEffort.push(f);
      } else {
        mediumLowHygiene.push(f);
      }
    }

    const sprints: SprintDay[] = [];
    const findingsMap: Record<string, VulnerabilityFinding> = {};

    if (isSprintWise) {
      // =========================================================================
      // SPRINT-WISE PLAN (10 Days per Sprint / 2-Week Agile Cadence)
      // =========================================================================
      // In a 10-day Agile sprint, the engineering capacity over 2 weeks comfortably
      // absorbs both immediate quick wins and the primary high-risk items.
      const sprint1Findings: VulnerabilityFinding[] = [
        ...highSevLowEffort,
        ...highSevHighEffort.slice(0, 4), // Up to 4 major high-risk architectural tasks in Sprint 1
      ];

      // Any remaining high-risk items + hygiene go into Sprint 2 (Sprint Weeks 3-4, 10 days)
      const remainingHighRisk = highSevHighEffort.slice(4);
      const sprint2Findings: VulnerabilityFinding[] = [
        ...remainingHighRisk,
        ...mediumLowHygiene.slice(0, 6),
      ];

      // Any overflow goes into Sprint 3
      const overflow = mediumLowHygiene.slice(6);

      sprints.push(
        this.createSprintDay(
          1,
          config.planningMode,
          daysPerSprint,
          `Sprint 1 (${daysPerSprint}-Day Agile Sprint)`,
          `Sprint 1: Critical Security Remediation & Quick Wins (${daysPerSprint} Working Days)`,
          `Standard 2-week Agile sprint (${daysPerSprint} working days) targeting all direct lockfile bumps, quick-win patches, and core critical CodeQL findings.`,
          sprint1Findings
        )
      );

      sprints.push(
        this.createSprintDay(
          2,
          config.planningMode,
          daysPerSprint,
          `Sprint 2 (${daysPerSprint}-Day Agile Sprint)`,
          `Sprint 2: Architectural Rewrites & Secondary Upgrades (${daysPerSprint} Working Days)`,
          `Standard 2-week Agile sprint (${daysPerSprint} working days) allocated for major version migrations, complex taint refactoring, and regression test suites.`,
          sprint2Findings.length > 0 ? sprint2Findings : mediumLowHygiene
        )
      );

      if (overflow.length > 0) {
        sprints.push(
          this.createSprintDay(
            3,
            config.planningMode,
            daysPerSprint,
            `Sprint 3 (${daysPerSprint}-Day Agile Sprint)`,
            `Sprint 3: Security Hygiene, Deprecations & Audit Sign-Off (${daysPerSprint} Working Days)`,
            `Long-term hygiene maintenance, third-party dependency deprecation, and final compliance sign-off over ${daysPerSprint} working days.`,
            overflow
          )
        );
      }
    } else {
      // =========================================================================
      // DAY-WISE PLAN (1 Day per Micro-Chunk / Daily Focus Cadence)
      // =========================================================================
      // Sprint 1 (Day 1): Quick Wins
      const day1Findings = [...highSevLowEffort];
      if (day1Findings.length < 3 && mediumLowHygiene.length > 0) {
        day1Findings.push(...mediumLowHygiene.splice(0, 2));
      }

      sprints.push(
        this.createSprintDay(
          1,
          config.planningMode,
          1,
          'Day 1 (Daily Focus)',
          'Day 1: Immediate Quick Wins (1 Day Duration)',
          'Direct dependency lockfile bumps, transitive deduplications, and self-contained AST sanitizers.',
          day1Findings
        )
      );

      // Sprint 2 (Day 2): High Severity Architectural (capped at maxHighRiskPerDay)
      const day2Findings = highSevHighEffort.slice(0, config.maxHighRiskPerDay);
      const overflowHighRisk = highSevHighEffort.slice(config.maxHighRiskPerDay);

      sprints.push(
        this.createSprintDay(
          2,
          config.planningMode,
          1,
          'Day 2 (Daily Focus)',
          `Day 2: High Severity Architectural Items (Capped at ${config.maxHighRiskPerDay}/day)`,
          'Complex SQL/Command injections, prototype pollutions, and major package upgrades requiring test validation.',
          day2Findings
        )
      );

      // Sprint 3 (Day 3+): Overflow or Hygiene
      const day3Findings = [...overflowHighRisk, ...mediumLowHygiene];
      sprints.push(
        this.createSprintDay(
          3,
          config.planningMode,
          1,
          'Day 3+ (Daily Focus)',
          'Day 3: Security Hygiene & Audit Sweep',
          'Medium and low risk items, secondary dependencies, and final verification checks.',
          day3Findings
        )
      );
    }

    // Populate findingsMap and update targetSprint on each finding
    let totalEstHours = 0;
    for (const s of sprints) {
      for (const id of s.findings) {
        const found = findings.find((f) => f.id === id);
        if (found) {
          found.targetSprint = s.sprintNumber;
          findingsMap[found.id] = found;
          totalEstHours += found.sizing.estimatedHours;
        }
      }
    }

    const state: SprintState = {
      version: '1.0.0',
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
      },
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
    findings: VulnerabilityFinding[]
  ): SprintDay {
    const totalHours = findings.reduce((sum, f) => sum + f.sizing.estimatedHours, 0);
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
    };
  }
}
