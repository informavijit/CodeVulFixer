import * as vscode from 'vscode';
import { VulnerabilityFinding, SprintDay, SprintState } from '../ingestion/types';

export interface SprintPlannerConfig {
  maxHighRiskPerDay: number;
  targetSprintDays: number;
}

export class SprintPlanner {
  /**
   * Reads user configuration settings.
   */
  public static getConfig(): SprintPlannerConfig {
    const config = vscode.workspace.getConfiguration('codevulfixer');
    return {
      maxHighRiskPerDay: config.get<number>('maxHighRiskPerDay', 3),
      targetSprintDays: config.get<number>('targetSprintDays', 4),
    };
  }

  /**
   * Plans multi-day sprint schedule based on findings and risk profiles.
   */
  public static planSprints(
    findings: VulnerabilityFinding[],
    repoOwner: string,
    repoName: string,
    customConfig?: SprintPlannerConfig
  ): SprintState {
    const config = customConfig || this.getConfig();

    // 1. Separate findings by category:
    // Category 1: High/Critical Severity + Low Effort (Size S) -> Day 1 Quick Wins
    // Category 2: High/Critical Severity + High Effort (Size M/L) -> Day 2 Architectural
    // Category 3: Medium/Low Severity -> Day 3+ Hygiene

    const day1Candidates: VulnerabilityFinding[] = [];
    const day2Candidates: VulnerabilityFinding[] = [];
    const day3Candidates: VulnerabilityFinding[] = [];

    for (const f of findings) {
      const isHighSev = f.severity === 'critical' || f.severity === 'high';
      const isLowEffort = f.sizing.size === 'S';

      if (isHighSev && isLowEffort) {
        day1Candidates.push(f);
      } else if (isHighSev) {
        day2Candidates.push(f);
      } else {
        day3Candidates.push(f);
      }
    }

    // 2. Build Sprints with Day constraint checks
    const sprints: SprintDay[] = [];
    const findingsMap: Record<string, VulnerabilityFinding> = {};

    // --- SPRINT 1: Quick Wins ---
    const sprint1Findings: VulnerabilityFinding[] = [...day1Candidates];
    // If Day 1 is light, pull some medium severity low-effort items
    if (sprint1Findings.length < 3 && day3Candidates.length > 0) {
      const extra = day3Candidates.splice(0, 2);
      sprint1Findings.push(...extra);
    }

    sprints.push(
      this.createSprintDay(
        1,
        'Sprint 1 (Day 1)',
        'Immediate Quick Wins: Lockfile Bumps & Localized Patches',
        'Direct dependencies, transitive deduplications, and self-contained security adjustments with zero breaking API impact.',
        sprint1Findings
      )
    );

    // --- SPRINT 2: High Severity Architectural ---
    // Enforce maxHighRiskPerDay
    const sprint2Findings: VulnerabilityFinding[] = [];
    const overflowHighRisk: VulnerabilityFinding[] = [];

    for (const item of day2Candidates) {
      if (sprint2Findings.length < config.maxHighRiskPerDay) {
        sprint2Findings.push(item);
      } else {
        overflowHighRisk.push(item);
      }
    }

    sprints.push(
      this.createSprintDay(
        2,
        'Sprint 2 (Day 2)',
        'Architectural Items: Major Upgrades & CodeQL SAST Rewrites',
        'Deep vulnerability refactoring, SQL/Command injections, and major package version shifts requiring test validation.',
        sprint2Findings
      )
    );

    // --- SPRINT 3: Overflow High-Risk or Security Hygiene ---
    const sprint3Findings: VulnerabilityFinding[] = [];
    if (overflowHighRisk.length > 0) {
      sprint3Findings.push(...overflowHighRisk);
    }
    // Add hygiene items
    sprint3Findings.push(...day3Candidates);

    // If sprint3 has too many items, split into Day 4
    if (sprint3Findings.length > 5 && config.targetSprintDays >= 4) {
      const chunk1 = sprint3Findings.slice(0, 4);
      const chunk2 = sprint3Findings.slice(4);

      sprints.push(
        this.createSprintDay(
          3,
          'Sprint 3 (Day 3)',
          'Security Hygiene & Low-Severity Maintenance',
          'Medium & low severity advisories, deprecation mitigation, and code hygiene polish.',
          chunk1
        )
      );

      sprints.push(
        this.createSprintDay(
          4,
          'Sprint 4 (Day 4)',
          'Sprint Closure & Final Audit Sweep',
          'Remaining security debt items and complete multi-ecosystem audit verification.',
          chunk2
        )
      );
    } else {
      sprints.push(
        this.createSprintDay(
          3,
          'Sprint 3 (Day 3+)',
          'Security Hygiene & Closure Verification',
          'Medium and low risk items, secondary dependencies, and final verification checks.',
          sprint3Findings
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
      sprints,
      findings: findingsMap,
      activeSprint: 1,
      metrics: {
        totalFindings: findings.length,
        resolvedCount: 0,
        pendingCount: findings.length,
        failedCount: 0,
        totalEstimatedHours: Math.round(totalEstHours * 10) / 10,
        hoursSaved: Math.round(totalEstHours * 0.75 * 10) / 10, // 75% estimated automation savings
      },
    };

    return state;
  }

  private static createSprintDay(
    sprintNumber: number,
    dayLabel: string,
    title: string,
    description: string,
    findings: VulnerabilityFinding[]
  ): SprintDay {
    const totalHours = findings.reduce((sum, f) => sum + f.sizing.estimatedHours, 0);
    return {
      sprintNumber,
      dayLabel,
      title,
      description,
      findings: findings.map((f) => f.id),
      totalEstimatedHours: Math.round(totalHours * 10) / 10,
      status: sprintNumber === 1 ? 'in_progress' : 'pending',
    };
  }
}
