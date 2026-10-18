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

      for (const f of items) {
        if (f.status === 'verified') r++;
        else if (f.status === 'failed' || f.status === 'rejected') fl++;
        else p++;

        if (f.severity === 'critical') c++;
        else if (f.severity === 'high') h++;
        else if (f.severity === 'medium') m++;
        else if (f.severity === 'low') l++;

        hrs += f.sizing?.estimatedHours || 0;
      }

      hrs = Math.round(hrs * 10) / 10;
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
        hoursSaved: Math.round(hrs * 0.75 * 10) / 10,
      };
    };

    for (const f of list) {
      if (f.status === 'verified') {
        resolved++;
      } else if (f.status === 'failed' || f.status === 'rejected') {
        failed++;
      } else {
        pending++;
      }
      totalEstHours += f.sizing?.estimatedHours || 0;
    }

    totalEstHours = Math.round(totalEstHours * 10) / 10;

    if (!state.metrics) {
      state.metrics = {
        totalFindings: total,
        resolvedCount: resolved,
        pendingCount: pending,
        failedCount: failed,
        totalEstimatedHours: totalEstHours,
        hoursSaved: Math.round(totalEstHours * 0.75 * 10) / 10,
      };
    } else {
      state.metrics.totalFindings = total;
      state.metrics.resolvedCount = resolved;
      state.metrics.pendingCount = pending;
      state.metrics.failedCount = failed;
      if (!state.metrics.totalEstimatedHours) {
        state.metrics.totalEstimatedHours = totalEstHours;
        state.metrics.hoursSaved = Math.round(totalEstHours * 0.75 * 10) / 10;
      }
    }

    state.metrics.dependabotMetrics = computeBreakdown(depList);
    state.metrics.codeScanningMetrics = computeBreakdown(csList);
    state.clubbingSummary = ClubbingEngine.analyzeClusters(state.findings);
  }
}
