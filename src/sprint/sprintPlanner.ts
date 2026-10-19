import * as vscode from 'vscode';
import { VulnerabilityFinding, SprintDay, SprintState, PlanningMode } from '../ingestion/types';
import { ClubbingEngine } from '../analysis/clubbingEngine';

export interface SprintPlannerConfig {
  planningMode?: PlanningMode;
  daysPerSprint?: number; // 10 days by default (standard 2-week Agile sprint)
  hoursPerDay?: number;   // 6 hours per day by default
  maxHighRiskPerDay?: number;
  targetSprintDays?: number;
}

export class SprintPlanner {
  public static readonly DEFAULT_DAYS_PER_SPRINT = 10;
  public static readonly DEFAULT_HOURS_PER_DAY = 6;
  public static readonly SPRINT_CAPACITY_HOURS = 60; // 10 days * 6 hours/day = 60 hours

  /**
   * Reads user configuration settings with defaults (10 days / sprint, 6h / day).
   */
  public static getConfig(): Required<SprintPlannerConfig> {
    const config = vscode.workspace.getConfiguration('codevulfixer');
    return {
      planningMode: 'sprint_wise',
      daysPerSprint: 10,
      hoursPerDay: 6,
      maxHighRiskPerDay: config.get<number>('maxHighRiskPerDay', 3),
      targetSprintDays: 10,
    };
  }

  /**
   * Plans remediation schedule based on 10-day Agile Sprints (1 day = 6 hours -> 60h capacity per sprint).
   * Totals hours of estimates, then divides into 10-day sprints.
   */
  public static planSprints(
    findings: VulnerabilityFinding[],
    repoOwner: string,
    repoName: string,
    customConfig?: Partial<SprintPlannerConfig>
  ): SprintState {
    const daysPerSprint = customConfig?.daysPerSprint || this.DEFAULT_DAYS_PER_SPRINT;
    const hoursPerDay = customConfig?.hoursPerDay || this.DEFAULT_HOURS_PER_DAY;
    const sprintCapacity = daysPerSprint * hoursPerDay; // 10 * 6 = 60h

    // Prioritization: Phase 1: Dependabot Vulnerabilities, Phase 2: Code Scanning findings
    const depFindings = findings.filter((f) => f.source === 'dependabot');
    const csFindings = findings.filter((f) => f.source === 'code_scanning');

    const severityOrder = (s: string) => {
      switch (s) {
        case 'critical': return 4;
        case 'high': return 3;
        case 'medium': return 2;
        default: return 1;
      }
    };

    const sizeOrder = (sz?: string) => {
      switch (sz) {
        case 'S': return 1;
        case 'M': return 2;
        case 'L': return 3;
        case 'XL': return 4;
        default: return 2;
      }
    };

    const sortFindings = (items: VulnerabilityFinding[]) => {
      return [...items].sort((a, b) => {
        const diffSev = severityOrder(b.severity) - severityOrder(a.severity);
        if (diffSev !== 0) return diffSev;
        return sizeOrder(a.sizing?.size) - sizeOrder(b.sizing?.size);
      });
    };

    const sortedDep = sortFindings(depFindings);
    const sortedCs = sortFindings(csFindings);
    const orderedFindings = [...sortedDep, ...sortedCs];

    // Compute total estimated hours and ranges
    let totalEstHours = 0;
    for (const f of orderedFindings) {
      const h = f.sizing?.estimatedHours ?? (f.sizing?.size === 'XL' ? 8 : f.sizing?.size === 'L' ? 4 : f.sizing?.size === 'M' ? 2 : 1);
      const sz = f.sizing?.size || 'M';
      let minH = f.sizing?.estimatedHoursMin;
      let maxH = f.sizing?.estimatedHoursMax;

      if (!minH || !maxH) {
        if (sz === 'S') {
          minH = 0.5;
          maxH = 1.0;
        } else if (sz === 'M') {
          minH = 1.5;
          maxH = 3.0;
        } else if (sz === 'L') {
          minH = Math.max(4.0, Math.round(h * 0.8 * 10) / 10);
          maxH = Math.max(8.0, Math.round(h * 1.4 * 10) / 10);
        } else {
          minH = Math.max(16.0, Math.round(h * 0.75 * 10) / 10);
          maxH = Math.max(32.0, Math.round(h * 1.3 * 10) / 10);
        }
      }

      if (!f.sizing) {
        f.sizing = {
          size: sz,
          riskLevel: 'medium',
          reasons: [],
          estimatedHours: h,
          estimatedHoursMin: minH,
          estimatedHoursMax: maxH,
          estimatedHoursRange: `${minH} – ${maxH} hrs`,
          isAutomatedCandidate: false,
        };
      } else {
        f.sizing.estimatedHours = h;
        f.sizing.estimatedHoursMin = minH;
        f.sizing.estimatedHoursMax = maxH;
        f.sizing.estimatedHoursRange = `${minH} – ${maxH} hrs`;
      }
      totalEstHours += h;
    }
    totalEstHours = Math.round(totalEstHours * 10) / 10;

    const sprints: SprintDay[] = [];
    const findingsMap: Record<string, VulnerabilityFinding> = {};

    if (orderedFindings.length > 0) {
      const targetSprintCount = Math.max(1, Math.ceil(totalEstHours / sprintCapacity));
      const targetPerSprint = totalEstHours / targetSprintCount;
      const sprintBuckets: VulnerabilityFinding[][] = Array.from({ length: targetSprintCount }, () => []);
      let currentSprintIdx = 0;
      let currentSprintHours = 0;

      for (const finding of orderedFindings) {
        const hours = finding.sizing.estimatedHours;

        // Advance to next sprint bucket if not on the last sprint and target capacity threshold met
        if (currentSprintIdx < targetSprintCount - 1 && sprintBuckets[currentSprintIdx].length > 0) {
          if (currentSprintHours >= targetPerSprint || (currentSprintHours + hours > sprintCapacity && currentSprintHours >= targetPerSprint * 0.7)) {
            currentSprintIdx++;
            currentSprintHours = 0;
          }
        }

        finding.targetSprint = currentSprintIdx + 1;
        sprintBuckets[currentSprintIdx].push(finding);
        currentSprintHours = Math.round((currentSprintHours + hours) * 10) / 10;
        findingsMap[finding.id] = finding;
      }

      for (let i = 0; i < targetSprintCount; i++) {
        const bucket = sprintBuckets[i];
        if (bucket.length > 0) {
          sprints.push(
            this.buildSprintDay(
              i + 1,
              daysPerSprint,
              sprintCapacity,
              bucket
            )
          );
        }
      }
    }

    // Precision calculation: sum of sprint hours MUST precisely match summary total
    const sprintTotalHours = sprints.length > 0
      ? Math.round(sprints.reduce((sum, s) => sum + s.totalEstimatedHours, 0) * 10) / 10
      : totalEstHours;
    const totalMinHours = Math.round(orderedFindings.reduce((sum, f) => sum + (f.sizing?.estimatedHoursMin || 0.5), 0) * 10) / 10;
    const totalMaxHours = Math.round(orderedFindings.reduce((sum, f) => sum + (f.sizing?.estimatedHoursMax || 1.0), 0) * 10) / 10;
    const totalSavedMin = Math.round(totalMinHours * 0.75 * 10) / 10;
    const totalSavedMax = Math.round(totalMaxHours * 0.75 * 10) / 10;

    // Sizing and estimation separated calculations
    const depTotalHours = Math.round(depFindings.reduce((sum, f) => sum + (f.sizing?.estimatedHours || 0), 0) * 10) / 10;
    const depMinHours = Math.round(depFindings.reduce((sum, f) => sum + (f.sizing?.estimatedHoursMin || 0.5), 0) * 10) / 10;
    const depMaxHours = Math.round(depFindings.reduce((sum, f) => sum + (f.sizing?.estimatedHoursMax || 1.0), 0) * 10) / 10;
    const depSavedMin = Math.round(depMinHours * 0.75 * 10) / 10;
    const depSavedMax = Math.round(depMaxHours * 0.75 * 10) / 10;

    const csTotalHours = Math.round(csFindings.reduce((sum, f) => sum + (f.sizing?.estimatedHours || 0), 0) * 10) / 10;
    const csMinHours = Math.round(csFindings.reduce((sum, f) => sum + (f.sizing?.estimatedHoursMin || 0.5), 0) * 10) / 10;
    const csMaxHours = Math.round(csFindings.reduce((sum, f) => sum + (f.sizing?.estimatedHoursMax || 1.0), 0) * 10) / 10;
    const csSavedMin = Math.round(csMinHours * 0.75 * 10) / 10;
    const csSavedMax = Math.round(csMaxHours * 0.75 * 10) / 10;

    const state: SprintState = {
      version: '1.0.5',
      repoOwner,
      repoName,
      lastUpdated: new Date().toISOString(),
      planningMode: 'sprint_wise',
      daysPerSprint,
      sprints,
      findings: findingsMap,
      activeSprint: 1,
      metrics: {
        totalFindings: findings.length,
        resolvedCount: 0,
        pendingCount: findings.length,
        failedCount: 0,
        totalEstimatedHours: sprintTotalHours,
        estimatedHoursMin: totalMinHours,
        estimatedHoursMax: totalMaxHours,
        estimatedHoursRange: `${totalMinHours} – ${totalMaxHours} hrs`,
        hoursSaved: Math.round(sprintTotalHours * 0.75 * 10) / 10,
        hoursSavedMin: totalSavedMin,
        hoursSavedMax: totalSavedMax,
        hoursSavedRange: `${totalSavedMin} – ${totalSavedMax} hrs`,
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
          estimatedHoursMin: depMinHours,
          estimatedHoursMax: depMaxHours,
          estimatedHoursRange: `${depMinHours} – ${depMaxHours} hrs`,
          hoursSaved: Math.round(depTotalHours * 0.75 * 10) / 10,
          hoursSavedMin: depSavedMin,
          hoursSavedMax: depSavedMax,
          hoursSavedRange: `${depSavedMin} – ${depSavedMax} hrs`,
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
          estimatedHoursMin: csMinHours,
          estimatedHoursMax: csMaxHours,
          estimatedHoursRange: `${csMinHours} – ${csMaxHours} hrs`,
          hoursSaved: Math.round(csTotalHours * 0.75 * 10) / 10,
          hoursSavedMin: csSavedMin,
          hoursSavedMax: csSavedMax,
          hoursSavedRange: `${csSavedMin} – ${csSavedMax} hrs`,
        },
      },
      clubbingSummary: ClubbingEngine.analyzeClusters(Object.values(findingsMap)),
    };

    return state;
  }

  private static buildSprintDay(
    sprintNumber: number,
    daysPerSprint: number,
    sprintCapacityHours: number,
    findings: VulnerabilityFinding[]
  ): SprintDay {
    const totalHours = Math.round(findings.reduce((sum, f) => sum + (f.sizing?.estimatedHours || 0), 0) * 10) / 10;
    const minHours = Math.round(findings.reduce((sum, f) => sum + (f.sizing?.estimatedHoursMin || 0.5), 0) * 10) / 10;
    const maxHours = Math.round(findings.reduce((sum, f) => sum + (f.sizing?.estimatedHoursMax || 1.0), 0) * 10) / 10;
    const hasDep = findings.some((f) => f.source === 'dependabot');
    const hasCs = findings.some((f) => f.source === 'code_scanning');

    let category: 'dependabot' | 'code_scanning' | undefined;
    let categoryTitle = 'Remediation & Verification';
    if (hasDep && !hasCs) {
      category = 'dependabot';
      categoryTitle = 'Dependabot Dependency Upgrades & Manifest Locking';
    } else if (hasCs && !hasDep) {
      category = 'code_scanning';
      categoryTitle = 'Code Scanning SAST & CodeQL Vulnerability Remediation';
    } else {
      categoryTitle = 'Combined Dependency Hardening & SAST Remediation';
    }

    const dayLabel = `Sprint ${sprintNumber} (${daysPerSprint}-Day Agile Sprint)`;
    const title = `Sprint ${sprintNumber}: ${categoryTitle} (${totalHours}h / ${sprintCapacityHours}h Capacity)`;
    const description = `Standard ${daysPerSprint}-day Agile sprint (${totalHours}h of ${sprintCapacityHours}h capacity allocated at 6h/day). Targets ${findings.length} vulnerabilities.`;

    return {
      sprintNumber,
      planningMode: 'sprint_wise',
      durationDays: daysPerSprint,
      dayLabel,
      title,
      description,
      findings: findings.map((f) => f.id),
      totalEstimatedHours: totalHours,
      estimatedHoursMin: minHours,
      estimatedHoursMax: maxHours,
      estimatedHoursRange: `${minHours} – ${maxHours} hrs`,
      status: sprintNumber === 1 ? 'in_progress' : 'pending',
      category,
    };
  }
}
