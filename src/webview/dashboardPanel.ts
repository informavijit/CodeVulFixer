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
import { ExcelExporter } from '../export/excelExporter';
import { ClubbingEngine } from '../analysis/clubbingEngine';
import { LearnedPatternEngine } from '../engines/learnedPatternEngine';
import { logger } from '../utils/logger';
import * as path from 'path';
import * as fs from 'fs';

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
        enableFindWidget: true,
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
      this.selectedDiffFinding,
      logger.getEntries()
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

        case 'switchTabNoReload':
          this.activeTab = message.tab;
          break;

        case 'refreshLogs':
          await this.update();
          break;

        case 'clearLogs':
          logger.clear();
          await this.update();
          vscode.window.showInformationMessage('CodeVulFixer: Execution logs cleared.');
          break;

        case 'openOutputChannel':
          logger.show();
          break;

        case 'reloadState':
          await this.update();
          vscode.window.showInformationMessage('CodeVulFixer: Sprint state reloaded from disk.');
          break;

        case 'saveSprintStateJson':
          try {
            const parsed = JSON.parse(message.rawJson);
            await StateStore.saveState(workspaceRoot, parsed);
            await this.update();
            vscode.window.showInformationMessage('CodeVulFixer: Sprint state JSON saved successfully.');
          } catch (err: any) {
            vscode.window.showErrorMessage(`Failed to save sprint state JSON: ${err.message}`);
          }
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
          await this.executeSprint(workspaceRoot, message.sprintNumber, message.engine);
          break;

        case 'runSprintFullAi':
          await this.executeSprint(workspaceRoot, message.sprintNumber, 'copilot');
          break;

        case 'runAllSprintsFullAi':
          await this.executeAllSprints(workspaceRoot, 'copilot');
          break;

        case 'markManuallyFixed':
          await this.markFindingManuallyFixed(workspaceRoot, message.findingId);
          break;

        case 'markPending':
          await this.markFindingPending(workspaceRoot, message.findingId);
          break;

        case 'saveSettings':
          await this.updateSettings(message.settings);
          break;

        case 'exportToExcel':
          await this.exportToExcel(workspaceRoot);
          break;

        case 'validateLocal':
          await this.validateAndRescanLocalState(workspaceRoot);
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

        // Load existing local state to retain fixed / verified statuses
        const existingState = await StateStore.loadState(workspaceRoot);
        const { mergedFindings, retainedCount } = StateStore.mergeWithExistingState(existingState, sizedFindings);

        progress.report({ increment: 90, message: 'Planning multi-day remediation sprints...' });
        const sprintState = SprintPlanner.planSprints(mergedFindings, repoMeta.owner, repoMeta.repo);
        await StateStore.saveState(workspaceRoot, sprintState);

        // Auto-validate local code on disk for any zero-token resolutions
        await this.validateAndRescanLocalState(workspaceRoot, true);

        this.activeTab = 'sprint-board';
        await this.update();

        const retentionMsg = retainedCount > 0 ? ` Retained ${retainedCount} previously fixed/verified vulnerability status(es).` : '';
        vscode.window.showInformationMessage(
          `CodeVulFixer: Ingested ${allRaw.length} findings into ${sprintState.sprints.length} sprints.${retentionMsg}`
        );
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
        vscode.window.showInformationMessage(`CodeVulFixer: Loaded ${sizedFindings.length} realistic findings partitioned into ${sprintState.sprints.length} sprints (10-day Agile cycle @ 6h/day).`);
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

      const sizing = SizingEngine.evaluate(f, depInfo, contextReport, workspaceRoot);

      results.push({
        ...f,
        dependency: depInfo,
        sizing,
        compatibilityAdvice: f.compatibilityAdvice,
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
        progress.report({ increment: 25, message: `Executing ${engine} fix engine...` });
        let fixResult = await RepairCoordinator.executeRepair(workspaceRoot, finding, engine);

        // =========================================================================
        // AUTONOMOUS SELF-HEALING LOOP (Full AI Mode):
        // If initial fix or build fails, feed failure diagnostics back into Copilot LM
        // to solve the issue on its own before surfacing to the developer.
        // =========================================================================
        if (!fixResult.success && engine === 'copilot') {
          logger.warn(`[Self-Healing] Initial Copilot LM fix failed for ${findingId}. Initiating autonomous retry with error context...`);
          progress.report({ increment: 40, message: `Copilot LM self-healing: analyzing error & retrying...` });
          const retryFix = await RepairCoordinator.executeRepair(
            workspaceRoot,
            finding,
            'copilot',
            fixResult.stderr || fixResult.message
          );
          if (retryFix.success) {
            fixResult = retryFix;
          }
        }

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

          // Ask user for decision so the pipeline never gets stuck!
          const userChoice = await vscode.window.showWarningMessage(
            `Fix failed for ${findingId}: ${fixResult.message}`,
            'Mark as Fixed Manually',
            'Continue to Next Finding',
            'View Execution Logs'
          );

          if (userChoice === 'Mark as Fixed Manually') {
            await this.markFindingManuallyFixed(workspaceRoot, findingId);
          } else if (userChoice === 'View Execution Logs') {
            this.activeTab = 'logs';
            await this.update();
          }
          return;
        }

        // Automated Verification via task runner
        progress.report({ increment: 60, message: 'Running build & regression tests validation...' });
        let valSummary = await TaskValidator.validateWorkspace(workspaceRoot, finding);

        // If validation failed in Full AI mode: Attempt autonomous self-healing of the test/build failure!
        if (!valSummary.passed && engine === 'copilot') {
          const testFailure = valSummary.failureStackTrace || valSummary.testOutput || valSummary.buildOutput || 'Build or test failure';
          logger.warn(`[Self-Healing] Automated validation failed for ${findingId}. Feeding failure stack trace back to Copilot LM to resolve...`);
          progress.report({ increment: 75, message: `Copilot LM self-healing: correcting code to pass tests...` });

          const selfHealedFix = await RepairCoordinator.executeRepair(
            workspaceRoot,
            finding,
            'copilot',
            testFailure
          );

          if (selfHealedFix.success) {
            fixResult = selfHealedFix;
            valSummary = await TaskValidator.validateWorkspace(workspaceRoot, finding);
          }
        }

        // Inspect diff
        const fileToDiff = fixResult.modifiedFiles[0] || finding.location?.filePath || (finding.dependency?.ecosystem === 'maven' ? 'pom.xml' : 'package.json');
        const fileDiff = await DiffEngine.getFileDiff(workspaceRoot, fileToDiff);

        if (!valSummary.passed) {
          await StateStore.updateFinding(workspaceRoot, findingId, {
            status: 'failed',
            statusMessage: 'Fix applied but automated validation tests failed.',
            appliedDiff: fileDiff.rawDiff,
            validationReport: valSummary,
          });
          await this.update();

          const decision = await vscode.window.showWarningMessage(
            `Automated test verification failed after applying fix for ${findingId}.`,
            'Mark as Fixed Manually',
            'Continue to Next Finding',
            'View Execution Logs'
          );

          if (decision === 'Mark as Fixed Manually') {
            await this.markFindingManuallyFixed(workspaceRoot, findingId);
          } else if (decision === 'View Execution Logs') {
            this.activeTab = 'logs';
            await this.update();
          }
          return;
        }

        // Passed verification: Halt pipeline & trigger manual intercept checkpoint!
        const isLearned = fixResult.message.includes('Learned Fix') || fixResult.message.includes('learned');
        const resolutionEngine = isLearned ? 'learned_pattern' : fixResult.engine;

        await StateStore.updateFinding(workspaceRoot, findingId, {
          status: 'applied',
          statusMessage: isLearned
            ? '⚡ Fixed via repository learned pattern with Zero AI Tokens! Ready for review.'
            : 'Automated validation passed. Ready for Human-in-the-Loop review.',
          appliedDiff: fileDiff.rawDiff,
          validationReport: valSummary,
          resolutionEngine,
        });

        this.selectedDiffFinding = {
          ...finding,
          status: 'applied',
          appliedDiff: fileDiff.rawDiff,
          validationReport: valSummary,
          resolutionEngine,
        };
        this.activeTab = 'diff-inspector';
        await this.update();

        vscode.window.showInformationMessage(
          `CodeVulFixer: Fix applied & verified for ${findingId} (${resolutionEngine}). Review diff checkpoint to stage or rollback.`
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
        resolutionEngine: finding.resolutionEngine || (finding.sizing.isAutomatedCandidate ? 'deterministic' : 'copilot'),
      });

      // =========================================================================
      // APPROACH 1: CASCADING CO-REMEDIATION (ZERO-TOKEN RESOLUTION)
      // When a root package or shared pattern is fixed, identify all other
      // findings linked to the same root cause and auto-resolve them with Zero Tokens.
      // =========================================================================
      const cascadingCandidates = ClubbingEngine.findCascadingCandidates(finding, state.findings);
      if (cascadingCandidates.length > 0) {
        let cascadedCount = 0;
        for (const cand of cascadingCandidates) {
          // If manifest needs updating in dependent places without AI, do it deterministically:
          if (cand.dependency?.manifestFile && cand.dependency.fixedVersion) {
            const manifestPath = path.isAbsolute(cand.dependency.manifestFile)
              ? cand.dependency.manifestFile
              : path.join(workspaceRoot, cand.dependency.manifestFile);

            if (fs.existsSync(manifestPath) && manifestPath.endsWith('package.json')) {
              try {
                const raw = fs.readFileSync(manifestPath, 'utf8');
                const pkgJson = JSON.parse(raw);
                let changed = false;
                const pkg = cand.dependency.packageName;
                if (pkgJson.dependencies && pkgJson.dependencies[pkg]) {
                  pkgJson.dependencies[pkg] = `^${cand.dependency.fixedVersion}`;
                  changed = true;
                }
                if (pkgJson.devDependencies && pkgJson.devDependencies[pkg]) {
                  pkgJson.devDependencies[pkg] = `^${cand.dependency.fixedVersion}`;
                  changed = true;
                }
                if (changed) {
                  fs.writeFileSync(manifestPath, JSON.stringify(pkgJson, null, 2), 'utf8');
                }
              } catch {
                // ignore
              }
            }
          }

          await StateStore.updateFinding(workspaceRoot, cand.id, {
            status: 'verified',
            statusMessage: `Cascading Co-Remediation: Resolved with Zero AI Tokens via primary fix on ${finding.id} (${finding.dependency?.packageName || finding.ruleId})`,
            resolutionEngine: 'co_remediation',
            coRemediatedFromId: finding.id,
          });
          cascadedCount++;
        }

        if (cascadedCount > 0) {
          vscode.window.showInformationMessage(
            `CodeVulFixer: Staged ${finding.id} and automatically co-resolved ${cascadedCount} related findings with Zero AI Tokens!`
          );
        }
      }

      // =========================================================================
      // APPROACH 2: LOCAL PATTERN LEARNING (REPO-LEVEL KNOWLEDGE BASE)
      // Learn from developer-verified fixes so future similar findings use Zero Tokens.
      // =========================================================================
      if (finding.source === 'code_scanning') {
        try {
          await LearnedPatternEngine.learnFromFix(
            workspaceRoot,
            finding,
            finding.appliedDiff,
            finding.resolutionEngine === 'copilot' ? 'copilot' : 'developer_approved_diff'
          );
        } catch (err) {
          logger.warn(`Could not learn pattern from ${finding.id}: ${err}`);
        }
      }

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

  private async executeSprint(
    workspaceRoot: string,
    sprintNumber: number,
    engineOverride?: 'deterministic' | 'copilot'
  ): Promise<void> {
    const state = await StateStore.loadState(workspaceRoot);
    if (!state) return;

    const sprint = state.sprints.find((s) => s.sprintNumber === sprintNumber);
    if (!sprint) return;

    const engineModeDesc = engineOverride === 'copilot' ? 'Copilot LM (Full AI)' : 'Zero-Token / Deterministic';
    vscode.window.showInformationMessage(`Starting automated batch execution (${engineModeDesc}) for ${sprint.dayLabel}...`);

    for (const findingId of sprint.findings) {
      // Reload state on each iteration so status changes are up to date
      const freshState = await StateStore.loadState(workspaceRoot);
      const f = freshState?.findings[findingId];
      if (f && (f.status === 'pending' || f.status === 'failed')) {
        const engine = engineOverride || (f.sizing.isAutomatedCandidate ? 'deterministic' : 'copilot');
        await this.applyFindingFix(workspaceRoot, findingId, engine);
        if (engineOverride !== 'copilot') {
          break;
        }
      }
    }
  }

  private async executeAllSprints(
    workspaceRoot: string,
    engineOverride?: 'deterministic' | 'copilot'
  ): Promise<void> {
    const state = await StateStore.loadState(workspaceRoot);
    if (!state) return;

    const modeLabel = engineOverride === 'copilot' ? 'Full AI (Copilot LM)' : 'Zero-Token';
    vscode.window.showInformationMessage(`Starting full workspace remediation in ${modeLabel} mode...`);

    const findingIds = Object.keys(state.findings);
    for (const id of findingIds) {
      const freshState = await StateStore.loadState(workspaceRoot);
      const f = freshState?.findings[id];
      if (f && (f.status === 'pending' || f.status === 'failed')) {
        const engine = engineOverride || (f.sizing.isAutomatedCandidate ? 'deterministic' : 'copilot');
        await this.applyFindingFix(workspaceRoot, f.id, engine);
      }
    }
  }

  private async markFindingManuallyFixed(workspaceRoot: string, findingId: string): Promise<void> {
    const state = await StateStore.loadState(workspaceRoot);
    if (!state || !state.findings[findingId]) return;

    await StateStore.updateFinding(workspaceRoot, findingId, {
      status: 'manually_fixed',
      statusMessage: 'Manually verified and marked as fixed by developer.',
      resolutionEngine: 'manual',
    });
    await this.update();
    vscode.window.showInformationMessage(`CodeVulFixer: Finding ${findingId} marked as manually fixed.`);
  }

  private async markFindingPending(workspaceRoot: string, findingId: string): Promise<void> {
    const state = await StateStore.loadState(workspaceRoot);
    if (!state || !state.findings[findingId]) return;

    await StateStore.updateFinding(workspaceRoot, findingId, {
      status: 'pending',
      statusMessage: 'Status reset to pending.',
    });
    await this.update();
    vscode.window.showInformationMessage(`CodeVulFixer: Finding ${findingId} reset to pending.`);
  }

  private async updateSettings(settings: any): Promise<void> {
    const config = vscode.workspace.getConfiguration('codevulfixer');
    if (settings.planningMode) {
      await config.update('planningMode', settings.planningMode, vscode.ConfigurationTarget.Global);
    }
    if (settings.daysPerSprint) {
      await config.update('daysPerSprint', settings.daysPerSprint, vscode.ConfigurationTarget.Global);
    }
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
            planningMode: settings.planningMode || state.planningMode || 'sprint_wise',
            daysPerSprint: settings.daysPerSprint || state.daysPerSprint || 10,
            maxHighRiskPerDay: settings.maxHighRiskPerDay,
            targetSprintDays: settings.targetSprintDays,
          }
        );
        await StateStore.saveState(workspaceRoot, rePlanned);
        await this.update();
      }
    }

    vscode.window.showInformationMessage('CodeVulFixer settings saved and sprints replanned.');
  }

  public async exportToExcel(workspaceRoot: string): Promise<void> {
    const state = await StateStore.loadState(workspaceRoot);
    if (!state || Object.keys(state.findings || {}).length === 0) {
      vscode.window.showWarningMessage('CodeVulFixer: No vulnerability findings or sprint state to export. Run a scan or load demo data first.');
      return;
    }

    try {
      const xlsxBuffer = await ExcelExporter.generateXlsxWorkbook(state);
      const defaultFilename = `${state.repoName || 'CodeVulFixer'}_Security_Dashboard.xlsx`;
      const defaultUri = vscode.Uri.file(path.join(workspaceRoot, defaultFilename));

      const targetUri = await vscode.window.showSaveDialog({
        defaultUri,
        saveLabel: 'Export Excel Workbook',
        filters: {
          'Excel Workbook (*.xlsx)': ['xlsx'],
        },
      });

      if (targetUri) {
        await vscode.workspace.fs.writeFile(targetUri, xlsxBuffer);
        const choice = await vscode.window.showInformationMessage(
          `CodeVulFixer: Successfully exported dashboard to Excel workbook (${path.basename(targetUri.fsPath)}) with worksheets for Executive Summary, Unique Vulnerabilities, Dependabot, and Code Scanning.`,
          'Open File'
        );
        if (choice === 'Open File') {
          vscode.env.openExternal(targetUri);
        }
      }
    } catch (err: any) {
      logger.error('Failed to export Excel workbook', err);
      vscode.window.showErrorMessage(`CodeVulFixer Excel export failed: ${err.message}`);
    }
  }

  public async validateAndRescanLocalState(workspaceRoot: string, isSilent = false): Promise<void> {
    const state = await StateStore.loadState(workspaceRoot);
    if (!state || Object.keys(state.findings || {}).length === 0) {
      if (!isSilent) {
        vscode.window.showWarningMessage('CodeVulFixer: No active findings to validate. Load findings first.');
      }
      return;
    }

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'CodeVulFixer: Rescanning local workspace for zero-token resolutions...',
      },
      async (progress) => {
        progress.report({ increment: 20, message: 'Inspecting local manifests & source files...' });

        let newlyResolvedCount = 0;
        let zeroTokenCoRemediatedCount = 0;

        // 1. Inspect package.json / manifests for Dependabot packages
        const packageJsonPath = path.join(workspaceRoot, 'package.json');
        let pkgJson: any = null;
        if (fs.existsSync(packageJsonPath)) {
          try {
            pkgJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          } catch {
            // ignore
          }
        }

        const findingsList = Object.values(state.findings);

        for (const f of findingsList) {
          if (f.status === 'verified') continue;

          // A. Dependabot Local Check
          if (f.source === 'dependabot' && f.dependency) {
            const pkgName = f.dependency.packageName;
            const targetVersion = f.dependency.fixedVersion;

            let isUpdatedInManifest = false;
            if (pkgJson) {
              const currentInDep = pkgJson.dependencies?.[pkgName] || pkgJson.devDependencies?.[pkgName];
              if (currentInDep && targetVersion && currentInDep.includes(targetVersion)) {
                isUpdatedInManifest = true;
              }
            }

            if (isUpdatedInManifest) {
              f.status = 'verified';
              f.resolutionEngine = 'zero_token_local';
              f.statusMessage = `Locally Validated: ${pkgName} bumped to safe version in package.json (0 AI Tokens).`;
              newlyResolvedCount++;

              // Cascade to other findings in the same package cluster
              const cascaded = ClubbingEngine.findCascadingCandidates(f, state.findings);
              for (const cand of cascaded) {
                cand.status = 'verified';
                cand.resolutionEngine = 'co_remediation';
                cand.coRemediatedFromId = f.id;
                cand.statusMessage = `Cascading Co-Remediation: Resolved with Zero AI Tokens via primary fix on ${pkgName}.`;
                zeroTokenCoRemediatedCount++;
              }
            }
          }

          // B. Code Scanning Local Check
          if (f.source === 'code_scanning' && f.location?.filePath) {
            const filePath = path.isAbsolute(f.location.filePath)
              ? f.location.filePath
              : path.join(workspaceRoot, f.location.filePath);

            if (fs.existsSync(filePath)) {
              const content = fs.readFileSync(filePath, 'utf8');
              const snippet = f.location.snippet?.trim();

              // Check if vulnerable snippet is eliminated
              if (snippet && !content.includes(snippet)) {
                const learned = await LearnedPatternEngine.findMatchingPattern(workspaceRoot, f);
                f.status = 'verified';
                f.resolutionEngine = learned ? 'learned_pattern' : 'deterministic';
                f.statusMessage = learned
                  ? `Locally Validated: Remediated via Learned Pattern "${learned.name}" (0 AI Tokens).`
                  : `Locally Validated: Vulnerable AST snippet eliminated in source file (0 AI Tokens).`;
                newlyResolvedCount++;
              }
            }
          }
        }

        progress.report({ increment: 80, message: 'Updating clubbing telemetry & sprint metrics...' });
        await StateStore.saveState(workspaceRoot, state);
        await this.update();

        const totalRes = newlyResolvedCount + zeroTokenCoRemediatedCount;
        if (!isSilent) {
          if (totalRes > 0) {
            vscode.window.showInformationMessage(
              `CodeVulFixer: Validation complete! Successfully validated ${totalRes} finding(s) with Zero AI Tokens (${zeroTokenCoRemediatedCount} co-remediated from shared packages/patterns).`
            );
          } else {
            vscode.window.showInformationMessage(
              'CodeVulFixer: Local validation scan completed. All pending findings still require remediation.'
            );
          }
        }
      }
    );
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
