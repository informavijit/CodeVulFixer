import * as vscode from 'vscode';
import { StateStore } from '../sprint/stateStore';
import { GitResolver } from '../ingestion/gitResolver';
import { DashboardPanel } from './dashboardPanel';
import { SprintState } from '../ingestion/types';

export class CodeVulFixerSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'codevulfixer.sidebarView';
  private view?: vscode.WebviewView;

  constructor(private readonly extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.command) {
        case 'openDashboard':
          DashboardPanel.createOrShow(this.extensionUri);
          break;
        case 'scan':
          await vscode.commands.executeCommand('codevulfixer.scan');
          this.refresh();
          break;
        case 'loadDemo':
          await vscode.commands.executeCommand('codevulfixer.loadDemoData');
          this.refresh();
          break;
        case 'runSprint':
          await vscode.commands.executeCommand('codevulfixer.runSprint');
          this.refresh();
          break;
        case 'exportExcel':
          await vscode.commands.executeCommand('codevulfixer.exportExcel');
          break;
        case 'validateLocal':
          await vscode.commands.executeCommand('codevulfixer.validateLocal');
          this.refresh();
          break;
      }
    });

    this.refresh();
  }

  public async refresh(): Promise<void> {
    if (!this.view) return;

    const workspaceRoot = GitResolver.getPrimaryWorkspacePath();
    let state: SprintState | undefined;
    if (workspaceRoot) {
      state = await StateStore.loadState(workspaceRoot);
    }

    this.view.webview.html = this.getSidebarHtml(state);
  }

  private getSidebarHtml(state?: SprintState): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-foreground);
      padding: 12px;
      margin: 0;
    }
    .btn {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      width: 100%;
      margin-bottom: 8px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .btn:hover {
      background: var(--vscode-button-hoverBackground);
    }
    .btn-secondary {
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
    }
    .btn-secondary:hover {
      background: var(--vscode-button-secondaryHoverBackground);
    }
    .btn-success {
      background: #28a745;
      color: white;
    }
    .btn-success:hover {
      background: #218838;
    }
    .metric-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      font-size: 12px;
    }
    .pill {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 10px;
    }
    .pill-danger { background: rgba(220,53,69,0.2); color: #dc3545; }
    .pill-success { background: rgba(40,167,69,0.2); color: #28a745; }
    .pill-warning { background: rgba(255,193,7,0.2); color: #ffc107; }
    .box {
      background: var(--vscode-editor-background);
      border: 1px solid var(--vscode-panel-border);
      border-radius: 6px;
      padding: 10px;
      margin-bottom: 14px;
    }
    .item-card {
      background: var(--vscode-sideBar-background);
      border: 1px solid var(--vscode-panel-border);
      border-radius: 4px;
      padding: 8px;
      margin-bottom: 8px;
      font-size: 11px;
    }
  </style>
</head>
<body>
  <div style="font-weight: bold; font-size: 14px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
    🛡️ CodeVulFixer
  </div>

  <button class="btn" onclick="post('openDashboard')">
    <span>📊</span> Open Full Dashboard
  </button>

  ${state ? `
    <div class="box">
      <div style="font-weight: 600; font-size: 12px; margin-bottom: 6px;">
        Sprint Status (${state.repoOwner}/${state.repoName})
      </div>
      <div class="metric-row">
        <span>Active Sprints:</span>
        <strong>${state.sprints.length} Days</strong>
      </div>
      <div class="metric-row">
        <span>Remediated:</span>
        <span class="pill pill-success">${state.metrics.resolvedCount} / ${state.metrics.totalFindings}</span>
      </div>
      <div class="metric-row">
        <span>Pending:</span>
        <span class="pill pill-warning">${state.metrics.pendingCount}</span>
      </div>
      <div class="metric-row">
        <span>Time Saved:</span>
        <strong>${state.metrics.hoursSaved} hrs</strong>
      </div>
    </div>

    <button class="btn btn-success" onclick="post('runSprint')">
      <span>⚡</span> Run Current Sprint
    </button>
  ` : `
    <div class="box" style="text-align: center; font-size: 12px; opacity: 0.8;">
      No active sprint plan loaded.
    </div>
  `}

  <button class="btn btn-secondary" onclick="post('validateLocal')">
    <span>🔍</span> Validate Local Fixes (0-Token)
  </button>

  <button class="btn btn-secondary" onclick="post('exportExcel')">
    <span>📊</span> Export to Excel (.xlsx)
  </button>

  <button class="btn btn-secondary" onclick="post('scan')">
    <span>🔄</span> Ingest & Scan
  </button>

  <button class="btn btn-secondary" onclick="post('loadDemo')">
    <span>🧪</span> Load Demo Findings
  </button>

  <script>
    const vscode = acquireVsCodeApi();
    function post(command) {
      vscode.postMessage({ command });
    }
  </script>
</body>
</html>`;
  }
}
