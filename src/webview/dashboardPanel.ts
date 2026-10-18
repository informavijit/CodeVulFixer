import * as vscode from 'vscode';
import { SprintState, VulnerabilityFinding, ValidationSummary } from '../ingestion/types';
import { StateStore } from '../sprint/stateStore';
import { SprintPlanner } from '../sprint/sprintPlanner';
import { GitResolver } from '../ingestion/gitResolver';
import { GitHubAuthService } from '../auth/githubAuth';
import { OctokitClientFactory } from '../ingestion/octokitClient';
import { DependabotIngestor } from '../ingestion/dependabotIngestor';
import { CodeScanningIngestor } from '../ingestion/codeScanningIngestor';
import { DependencyAnalyzer } from '../analysis/dependencyAnalyzer';
import { CodeContextAnalyzer } from '../analysis/codeContextAnalyzer';
import { SizingEngine } from '../analysis/sizingEngine';
import { RepairCoordinator } from '../engines/repairCoordinator';
import { TaskValidator } from '../validation/taskValidator';
import { DiffEngine } from '../validation/diffEngine';
import { GitScmHandler } from '../scm/gitScmHandler';
import { REALISTIC_DEMO_FINDINGS } from '../ingestion/mockData';
import { getDashboardHtml } from './htmlTemplate';
import { logger } from '../utils/logger';

export class DashboardPanel {
  public static currentPanel: DashboardPanel | undefined;
  private readonly panel: vscode.WebviewPanel;
  private readonly extensionUri: vscode.Uri;
  private disposables: vscode.Disposable[] = [];
  private activeTab = 'risk-profile';
  private selectedDiffFinding?: VulnerabilityFinding;

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this.panel = panel;
    this.extensionUri = extensionUri;

    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

    this.panel.webview.onDidReceiveMessage(
      async (message) => {
        await this.handleMessage(message);
      },
      null,
      this.disposables
    );

    this.update();
  }

  public static createOrShow(extensionUri: vscode.Uri): DashboardPanel {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (DashboardPanel.currentPanel) {
      DashboardPanel.currentPanel.panel.reveal(column);
      DashboardPanel.currentPanel.update();
      return DashboardPanel.currentPanel;
    }

    const panel = vscode.window.createWebviewPanel(
      'codevulfixer.dashboard',
      'CodeVulFixer Sprint & Risk Dashboard',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [extensionUri],
      }
    );

    DashboardPanel.currentPanel = new DashboardPanel(panel, extensionUri);
    return DashboardPanel.currentPanel;
  }

  public async update(): Promise<void> {
    const workspaceRoot = GitResolver.getPrimaryWorkspacePath();
    let state: SprintState | undefined;

    if (workspaceRoot) {
      state = await StateStore.loadState(workspaceRoot);
    }

    this.panel.webview.html = getDashboardHtml(
      state,
      this.activeTab,
      this.selectedDiffFinding
    );
  }

  private async handleMessage(message: any): Promise<void> {
    const workspaceRoot = GitResolver.getPrimaryWorkspacePath();
    if (!workspaceRoot) {
      vscode.window.showErrorMessage('CodeVulFixer requires an open workspace folder.');
      return;
    }

    try {
      switch (message.command) {
        case 'switchTab':
          this.activeTab = message.tab;
          await this.update();
          break;

        case 'scan':
          await this.performScan(workspaceRoot);
          break;

        case 'loadDemoData':
          await this.loadDemoFindings(workspaceRoot);
          break;

        case 'resetState':
          await StateStore.resetState(workspaceRoot);
          this.selectedDiffFinding = undefined;
          this.activeTab = 'risk-profile';
          await this.update();
          vscode.window.showInformationMessage('CodeVulFixer: Sprint state reset successfully.');
          break;

        case 'applyFix':
          await this.applyFindingFix(workspaceRoot, message.findingId, message.engine);
          break;

        case 'inspectDiff':
          await this.inspectFindingDiff(workspaceRoot, message.findingId);
          break;

        case 'verifyStage':
          await this.verifyAndStageFinding(workspaceRoot, message.findingId);
          break;

        case 'rejectRollback':
          await this.rejectAndRollbackFinding(workspaceRoot, message.findingId);
          break;

        case 'runSprint':
          await this.executeSprint(workspaceRoot, message.sprintNumber);
          break;

        case 'saveSettings':
          await this.updateSettings(message.settings);
          break;
      }
    } catch (error) {
      logger.error('Error handling Webview message', error);
      vscode.window.showErrorMessage(`CodeVulFixer error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public async performScan(workspaceRoot: string): Promise<void> {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'CodeVulFixer: Ingesting GitHub Vulnerabilities...',
        cancellable: false,
      },
      async (progress) => {
        progress.report({ increment: 10, message: 'Resolving repository metadata...' });
        const repoMeta = await GitResolver.resolveRepoMetadata();

        if (!repoMeta) {
          const action = await vscode.window.showWarningMessage(
            'No GitHub remote origin found for workspace. Would you like to load realistic demo findings for evaluation?',
            'Load Demo Findings',
            'Cancel'
          );
          if (action === 'Load Demo Findings') {
            await this.loadDemoFindings(workspaceRoot);
          }
          return;
        }

        progress.report({ increment: 30, message: 'Authenticating with GitHub API...' });
        const session = await GitHubAuthService.getSession(true);
        if (!session) {
          vscode.window.showErrorMessage('GitHub authentication was cancelled or unavailable.');
          return;
        }

        const octokit = OctokitClientFactory.create(session.accessToken);

        progress.report({ increment: 50, message: 'Fetching Dependabot & Code Scanning alerts...' });
        let dependabotFindings: VulnerabilityFinding[] = [];
        let codeScanningFindings: VulnerabilityFinding[] = [];

        try {
          dependabotFindings = await DependabotIngestor.fetchAlerts(octokit, repoMeta.owner, repoMeta.repo);
        } catch (e) {
          logger.warn(`Could not ingest Dependabot alerts (might lack GHAS permission or none exist): ${e}`);
        }

        try {
          codeScanningFindings = await CodeScanningIngestor.fetchAlerts(octokit, repoMeta.owner, repoMeta.repo);
        } catch (e) {
          logger.warn(`Could not ingest Code Scanning alerts (might lack GHAS permission or none exist): ${e}`);
        }

        const allRaw = [...dependabotFindings, ...codeScanningFindings];
        if (allRaw.length === 0) {
          const choice = await vscode.window.showInformationMessage(
            `Zero open alerts returned by GitHub for ${repoMeta.owner}/${repoMeta.repo}. Load sample findings to test sprint orchestration?`,
            'Load Demo Findings',
            'Dismiss'
          );
          if (choice === 'Load Demo Findings') {
            await this.loadDemoFindings(workspaceRoot);
            return;
          }
        }

        progress.report({ increment: 75, message: 'Running impact analysis & T-shirt sizing...' });
        const sizedFindings = await this.enrichAndSizeFindings(workspaceRoot, allRaw);

        progress.report({ increment: 90, message: 'Planning multi-day remediation sprints...' });
        const sprintState = SprintPlanner.planSprints(sizedFindings, repoMeta.owner, repoMeta.repo);
        await StateStore.saveState(workspaceRoot, sprintState);

        this.activeTab = 'sprint-board';
        await this.update();
        vscode.window.showInformationMessage(`CodeVulFixer: Ingested ${allRaw.length} findings into ${sprintState.sprints.length} sprints.`);
      }
    );
  }

  public async loadDemoFindings(workspaceRoot: string): Promise<void> {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'CodeVulFixer: Loading Realistic Vulnerabilities...',
      },
      async (progress) => {
        progress.report({ increment: 30, message: 'Analyzing manifests and taint graph...' });
        const sizedFindings = await this.enrichAndSizeFindings(workspaceRoot, REALISTIC_DEMO_FINDINGS);

        progress.report({ increment: 70, message: 'Generating multi-day sprint schedule...' });
        const sprintState = SprintPlanner.planSprints(sizedFindings, 'enterprise', 'demo-workspace');
        await StateStore.saveState(workspaceRoot, sprintState);

        this.activeTab = 'sprint-board';
        await this.update();
        vscode.window.showInformationMessage('CodeVulFixer: Loaded 9 realistic findings partitioned into 3 remediation sprints.');
      }
    );
  }

  private async enrichAndSizeFindings(
    workspaceRoot: string,
    rawFindings: VulnerabilityFinding[]
  ): Promise<VulnerabilityFinding[]> {
    const results: VulnerabilityFinding[] = [];

    for (const f of rawFindings) {
      let depInfo = f.dependency;
      if (depInfo) {
        depInfo = await DependencyAnalyzer.analyze(workspaceRoot, depInfo);
      }

      const contextReport = await CodeContextAnalyzer.analyze(
        workspaceRoot,
        f.location,
        f.cweIds,
        f.ruleId
      );

      const sizing = SizingEngine.evaluate(f, depInfo, contextReport);

      results.push({
        ...f,
        dependency: depInfo,
        sizing,
      });
    }

    return results;
  }

  private async applyFindingFix(
    workspaceRoot: string,
    findingId: string,
    engine: 'deterministic' | 'copilot'
  ): Promise<void> {
    const state = await StateStore.loadState(workspaceRoot);
    if (!state || !state.findings[findingId]) return;

    const finding = state.findings[findingId];
    await StateStore.updateFinding(workspaceRoot, findingId, { status: 'in_progress' });
    await this.update();

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `CodeVulFixer: Remediating ${findingId}...`,
      },
      async (progress) => {
        progress.report({ increment: 30, message: `Executing ${engine} fix engine...` });
        const fixResult = await RepairCoordinator.executeRepair(workspaceRoot, finding, engine);

        if (!fixResult.success) {
          await StateStore.updateFinding(workspaceRoot, findingId, {
            status: 'failed',
            statusMessage: fixResult.message,
            validationReport: {
              passed: false,
              timestamp: new Date().toISOString(),
              buildStatus: 'skipped',
              testStatus: 'skipped',
              auditStatus: 'skipped',
              failureStackTrace: fixResult.stderr || fixResult.message,
            },
          });
          await this.update();
          vscode.window.showErrorMessage(`Fix failed for ${findingId}: ${fixResult.message}`);
          return;
        }

        // Automated Verification via task runner
        progress.report({ increment: 60, message: 'Running build & regression tests validation...' });
        const valSummary = await TaskValidator.validateWorkspace(workspaceRoot);

        // Inspect diff
        const fileToDiff = fixResult.modifiedFiles[0] || finding.location?.filePath || 'package.json';
        const fileDiff = await DiffEngine.getFileDiff(workspaceRoot, fileToDiff);

        if (!valSummary.passed) {
          await StateStore.updateFinding(workspaceRoot, findingId, {
            status: 'failed',
            statusMessage: 'Fix applied but automated validation tests failed.',
            appliedDiff: fileDiff.rawDiff,
            validationReport: valSummary,
          });
          await this.update();
          vscode.window.showErrorMessage(`Automated test verification failed after applying fix for ${findingId}.`);
          return;
        }

        // Passed verification: Halt pipeline & trigger mandatory manual intercept!
        await StateStore.updateFinding(workspaceRoot, findingId, {
          status: 'applied',
          statusMessage: 'Automated validation passed. Ready for Human-in-the-Loop review.',
          appliedDiff: fileDiff.rawDiff,
          validationReport: valSummary,
        });

        this.selectedDiffFinding = {
          ...finding,
          status: 'applied',
          appliedDiff: fileDiff.rawDiff,
          validationReport: valSummary,
        };
        this.activeTab = 'diff-inspector';
        await this.update();

        vscode.window.showInformationMessage(
          `CodeVulFixer: Fix applied & verified for ${findingId}. Review diff checkpoint to stage or rollback.`
        );
      }
    );
  }

  private async inspectFindingDiff(workspaceRoot: string, findingId: string): Promise<void> {
    const state = await StateStore.loadState(workspaceRoot);
    if (!state || !state.findings[findingId]) return;

    this.selectedDiffFinding = state.findings[findingId];
    this.activeTab = 'diff-inspector';
    await this.update();
  }

  private async verifyAndStageFinding(workspaceRoot: string, findingId: string): Promise<void> {
    const state = await StateStore.loadState(workspaceRoot);
    if (!state || !state.findings[findingId]) return;

    const finding = state.findings[findingId];
    const modifiedFiles = finding.location?.filePath
      ? [finding.location.filePath]
      : ['package.json', 'package-lock.json'];

    const success = await GitScmHandler.stageAndSetCommitMessage(
      workspaceRoot,
      finding,
      modifiedFiles
    );

    if (success) {
      await StateStore.updateFinding(workspaceRoot, findingId, {
        status: 'verified',
        statusMessage: 'Verified by developer and staged into Git SCM.',
      });
      await this.update();
    }
  }

  private async rejectAndRollbackFinding(workspaceRoot: string, findingId: string): Promise<void> {
    const state = await StateStore.loadState(workspaceRoot);
    if (!state || !state.findings[findingId]) return;

    const finding = state.findings[findingId];
    const modifiedFiles = finding.location?.filePath
      ? [finding.location.filePath]
      : ['package.json', 'package-lock.json'];

    await GitScmHandler.rollbackChanges(workspaceRoot, modifiedFiles);

    await StateStore.updateFinding(workspaceRoot, findingId, {
      status: 'rejected',
      statusMessage: 'Rejected by developer. Workspace mutations reverted.',
    });
    await this.update();
  }

  private async executeSprint(workspaceRoot: string, sprintNumber: number): Promise<void> {
    const state = await StateStore.loadState(workspaceRoot);
    if (!state) return;

    const sprint = state.sprints.find((s) => s.sprintNumber === sprintNumber);
    if (!sprint) return;

    vscode.window.showInformationMessage(`Starting automated batch execution for ${sprint.dayLabel}...`);

    for (const findingId of sprint.findings) {
      const f = state.findings[findingId];
      if (f && (f.status === 'pending' || f.status === 'failed')) {
        await this.applyFindingFix(workspaceRoot, findingId, f.sizing.isAutomatedCandidate ? 'deterministic' : 'copilot');
        // Stop after first applied so developer can intercept checkpoint
        break;
      }
    }
  }

  private async updateSettings(settings: any): Promise<void> {
    const config = vscode.workspace.getConfiguration('codevulfixer');
    await config.update('maxHighRiskPerDay', settings.maxHighRiskPerDay, vscode.ConfigurationTarget.Global);
    await config.update('targetSprintDays', settings.targetSprintDays, vscode.ConfigurationTarget.Global);
    await config.update('packageManager', settings.packageManager, vscode.ConfigurationTarget.Global);
    await config.update('preferredFixEngine', settings.preferredFixEngine, vscode.ConfigurationTarget.Global);

    const workspaceRoot = GitResolver.getPrimaryWorkspacePath();
    if (workspaceRoot) {
      const state = await StateStore.loadState(workspaceRoot);
      if (state) {
        const rePlanned = SprintPlanner.planSprints(
          Object.values(state.findings),
          state.repoOwner,
          state.repoName,
          {
            maxHighRiskPerDay: settings.maxHighRiskPerDay,
            targetSprintDays: settings.targetSprintDays,
          }
        );
        await StateStore.saveState(workspaceRoot, rePlanned);
        await this.update();
      }
    }

    vscode.window.showInformationMessage('CodeVulFixer settings saved and sprints updated.');
  }

  public dispose(): void {
    DashboardPanel.currentPanel = undefined;
    this.panel.dispose();
    while (this.disposables.length) {
      const x = this.disposables.pop();
      if (x) x.dispose();
    }
  }
}
