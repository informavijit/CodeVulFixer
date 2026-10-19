import * as fs from 'fs';
import * as path from 'path';
import { SprintState, VulnerabilityFinding } from '../ingestion/types';
import { ClubbingEngine } from '../analysis/clubbingEngine';
import { logger } from '../utils/logger';

export class StateStore {
  private static readonly DIR_NAME = '.codevulfixer';
  private static readonly FILE_NAME = 'sprint-state.json';

  private static getStatePath(workspaceRoot: string): string {
    return path.join(workspaceRoot, StateStore.DIR_NAME, StateStore.FILE_NAME);
  }

  public static async loadState(workspaceRoot: string): Promise<SprintState | undefined> {
    const filePath = this.getStatePath(workspaceRoot);
    if (!fs.existsSync(filePath)) {
      return undefined;
    }

    try {
      const raw = await fs.promises.readFile(filePath, 'utf8');
      const state: SprintState = JSON.parse(raw);
      if (!state.findings) state.findings = {};
      if (!state.sprints) state.sprints = [];
      if (!state.metrics) {
        state.metrics = {
          totalFindings: 0,
          resolvedCount: 0,
          pendingCount: 0,
          failedCount: 0,
          totalEstimatedHours: 0,
          hoursSaved: 0,
        };
      }
      this.recalculateMetrics(state);
      logger.info(`Loaded sprint state for ${state.repoOwner}/${state.repoName} from disk.`);
      return state;
    } catch (error) {
      logger.error('Failed to read sprint state file', error);
      return undefined;
    }
  }

  public static async saveState(workspaceRoot: string, state: SprintState): Promise<void> {
    const dirPath = path.join(workspaceRoot, StateStore.DIR_NAME);
    const filePath = this.getStatePath(workspaceRoot);

    try {
      if (!fs.existsSync(dirPath)) {
        await fs.promises.mkdir(dirPath, { recursive: true });
      }

      state.lastUpdated = new Date().toISOString();
      this.recalculateMetrics(state);

      await fs.promises.writeFile(filePath, JSON.stringify(state, null, 2), 'utf8');
      logger.info(`Persisted sprint state to ${filePath}`);
    } catch (error) {
      logger.error('Failed to save sprint state file', error);
      throw error;
    }
  }

  /**
   * Merges freshly ingested findings from GitHub with existing local state.
   * Retains:
   * - Local resolution statuses (applied, verified, staged, in_progress)
   * - Applied code diffs, timestamps, zero-token resolution engines, and notes
   * - Previously resolved findings even if GitHub has closed them and no longer returns them
   * Returns merged findings array and the count of retained resolutions.
   */
  public static mergeWithExistingState(
    existingState: SprintState | undefined,
    incomingFindings: VulnerabilityFinding[]
  ): { mergedFindings: VulnerabilityFinding[]; retainedCount: number } {
    if (!existingState || !existingState.findings) {
      return { mergedFindings: incomingFindings, retainedCount: 0 };
    }

    const existingMap = existingState.findings;
    const incomingMap: Record<string, VulnerabilityFinding> = {};
    let retainedCount = 0;

    for (const inc of incomingFindings) {
      const existing = existingMap[inc.id];
      if (existing) {
        // Retain status if already worked on or verified locally
        if (
          existing.status === 'applied' ||
          existing.status === 'verified' ||
          existing.status === 'in_progress'
        ) {
          inc.status = existing.status;
          inc.resolutionEngine = existing.resolutionEngine;
          inc.lastAttemptAt = existing.lastAttemptAt;
          inc.appliedDiff = existing.appliedDiff;
          inc.coRemediatedFromId = existing.coRemediatedFromId;
          inc.statusMessage = existing.statusMessage;
          inc.validationReport = existing.validationReport;
          retainedCount++;
        }
      }
      incomingMap[inc.id] = inc;
    }

    // Preserve previously resolved findings that GitHub may have closed (so they no longer appear in open alerts)
    for (const [id, prevFinding] of Object.entries(existingMap)) {
      if (!incomingMap[id]) {
        if (prevFinding.status === 'applied' || prevFinding.status === 'verified') {
          incomingMap[id] = prevFinding;
          retainedCount++;
        }
      }
    }

    return {
      mergedFindings: Object.values(incomingMap),
      retainedCount,
    };
  }

  public static async updateFinding(
    workspaceRoot: string,
    findingId: string,
    updates: Partial<VulnerabilityFinding>
  ): Promise<SprintState | undefined> {
    const state = await this.loadState(workspaceRoot);
    if (!state) {
      logger.warn(`Cannot update finding ${findingId}: No active sprint state found.`);
      return undefined;
    }

    const current = state.findings[findingId];
    if (!current) {
      logger.warn(`Finding ${findingId} not present in state.`);
      return state;
    }

    state.findings[findingId] = {
      ...current,
      ...updates,
      lastAttemptAt: new Date().toISOString(),
    };

    await this.saveState(workspaceRoot, state);
    return state;
  }

  public static async updateSprintStatus(
    workspaceRoot: string,
    sprintNumber: number,
    status: 'pending' | 'in_progress' | 'completed'
  ): Promise<SprintState | undefined> {
    const state = await this.loadState(workspaceRoot);
    if (!state) return undefined;

    const target = state.sprints.find((s) => s.sprintNumber === sprintNumber);
    if (target) {
      target.status = status;
    }

    await this.saveState(workspaceRoot, state);
    return state;
  }

  public static async resetState(workspaceRoot: string): Promise<void> {
    const filePath = this.getStatePath(workspaceRoot);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      logger.info(`Reset sprint state: deleted ${filePath}`);
    }
  }

  private static recalculateMetrics(state: SprintState): void {
    const list = Object.values(state.findings || {});
    const total = list.length;
    let resolved = 0;
    let failed = 0;
    let pending = 0;
    let totalEstHours = 0;

    const depList = list.filter((f) => f.source === 'dependabot');
    const csList = list.filter((f) => f.source === 'code_scanning');

    const computeBreakdown = (items: typeof list) => {
      let r = 0;
      let fl = 0;
      let p = 0;
      let c = 0;
      let h = 0;
      let m = 0;
      let l = 0;
      let hrs = 0;
      let minHrs = 0;
      let maxHrs = 0;

      for (const f of items) {
        if (f.status === 'verified') r++;
        else if (f.status === 'failed' || f.status === 'rejected') fl++;
        else p++;

        if (f.severity === 'critical') c++;
        else if (f.severity === 'high') h++;
        else if (f.severity === 'medium') m++;
        else if (f.severity === 'low') l++;

        const curH = f.sizing?.estimatedHours || 0;
        hrs += curH;
        minHrs += f.sizing?.estimatedHoursMin || Math.max(0.5, curH * 0.75);
        maxHrs += f.sizing?.estimatedHoursMax || Math.max(1.0, curH * 1.4);
      }

      hrs = Math.round(hrs * 10) / 10;
      minHrs = Math.round(minHrs * 10) / 10;
      maxHrs = Math.round(maxHrs * 10) / 10;
      const savedMin = Math.round(minHrs * 0.75 * 10) / 10;
      const savedMax = Math.round(maxHrs * 0.75 * 10) / 10;

      return {
        totalFindings: items.length,
        criticalCount: c,
        highCount: h,
        mediumCount: m,
        lowCount: l,
        resolvedCount: r,
        pendingCount: p,
        failedCount: fl,
        totalEstimatedHours: hrs,
        estimatedHoursMin: minHrs,
        estimatedHoursMax: maxHrs,
        estimatedHoursRange: `${minHrs} – ${maxHrs} hrs`,
        hoursSaved: Math.round(hrs * 0.75 * 10) / 10,
        hoursSavedMin: savedMin,
        hoursSavedMax: savedMax,
        hoursSavedRange: `${savedMin} – ${savedMax} hrs`,
      };
    };

    let totalMinHours = 0;
    let totalMaxHours = 0;

    for (const f of list) {
      if (f.status === 'verified') {
        resolved++;
      } else if (f.status === 'failed' || f.status === 'rejected') {
        failed++;
      } else {
        pending++;
      }
      const curH = f.sizing?.estimatedHours || 0;
      totalEstHours += curH;
      totalMinHours += f.sizing?.estimatedHoursMin || Math.max(0.5, curH * 0.75);
      totalMaxHours += f.sizing?.estimatedHoursMax || Math.max(1.0, curH * 1.4);
    }

    totalMinHours = Math.round(totalMinHours * 10) / 10;
    totalMaxHours = Math.round(totalMaxHours * 10) / 10;
    const totalSavedMin = Math.round(totalMinHours * 0.75 * 10) / 10;
    const totalSavedMax = Math.round(totalMaxHours * 0.75 * 10) / 10;

    // Recompute each sprint's total estimated hours from its member findings
    if (state.sprints) {
      for (const sprint of state.sprints) {
        const sHours = (sprint.findings || []).reduce((sum, id) => sum + (state.findings[id]?.sizing?.estimatedHours || 0), 0);
        const sMin = (sprint.findings || []).reduce((sum, id) => sum + (state.findings[id]?.sizing?.estimatedHoursMin || 0.5), 0);
        const sMax = (sprint.findings || []).reduce((sum, id) => sum + (state.findings[id]?.sizing?.estimatedHoursMax || 1.0), 0);
        sprint.totalEstimatedHours = Math.round(sHours * 10) / 10;
        sprint.estimatedHoursMin = Math.round(sMin * 10) / 10;
        sprint.estimatedHoursMax = Math.round(sMax * 10) / 10;
        sprint.estimatedHoursRange = `${sprint.estimatedHoursMin} – ${sprint.estimatedHoursMax} hrs`;
      }
    }

    // Total hours must precisely match the sum of hours across all sprints
    const sprintSumHours = state.sprints && state.sprints.length > 0
      ? Math.round(state.sprints.reduce((sum, s) => sum + s.totalEstimatedHours, 0) * 10) / 10
      : totalEstHours;

    if (!state.metrics) {
      state.metrics = {
        totalFindings: total,
        resolvedCount: resolved,
        pendingCount: pending,
        failedCount: failed,
        totalEstimatedHours: sprintSumHours,
        estimatedHoursMin: totalMinHours,
        estimatedHoursMax: totalMaxHours,
        estimatedHoursRange: `${totalMinHours} – ${totalMaxHours} hrs`,
        hoursSaved: Math.round(sprintSumHours * 0.75 * 10) / 10,
        hoursSavedMin: totalSavedMin,
        hoursSavedMax: totalSavedMax,
        hoursSavedRange: `${totalSavedMin} – ${totalSavedMax} hrs`,
      };
    } else {
      state.metrics.totalFindings = total;
      state.metrics.resolvedCount = resolved;
      state.metrics.pendingCount = pending;
      state.metrics.failedCount = failed;
      state.metrics.totalEstimatedHours = sprintSumHours;
      state.metrics.estimatedHoursMin = totalMinHours;
      state.metrics.estimatedHoursMax = totalMaxHours;
      state.metrics.estimatedHoursRange = `${totalMinHours} – ${totalMaxHours} hrs`,
      state.metrics.hoursSaved = Math.round(sprintSumHours * 0.75 * 10) / 10;
      state.metrics.hoursSavedMin = totalSavedMin;
      state.metrics.hoursSavedMax = totalSavedMax;
      state.metrics.hoursSavedRange = `${totalSavedMin} – ${totalSavedMax} hrs`;
    }

    state.metrics.dependabotMetrics = computeBreakdown(depList);
    state.metrics.codeScanningMetrics = computeBreakdown(csList);
    state.clubbingSummary = ClubbingEngine.analyzeClusters(state.findings);
  }
}
