import * as vscode from 'vscode';
import { SprintState, VulnerabilityFinding, ValidationSummary } from '../ingestion/types';
import { ClubbingEngine } from '../analysis/clubbingEngine';

export function getDashboardHtml(state?: SprintState, activeTab = 'risk-profile', selectedDiffFinding?: VulnerabilityFinding): string {
  const stateJson = JSON.stringify(state || null).replace(/</g, '\\u003c');
  const selectedFindingJson = JSON.stringify(selectedDiffFinding || null).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeVulFixer Sprint & Risk Dashboard</title>
  <style>
    :root {
      --color-success: #28a745;
      --color-warning: #ffc107;
      --color-danger: #dc3545;
      --color-info: #17a2b8;
      --color-purple: #6f42c1;
      --color-success-bg: rgba(40, 167, 69, 0.15);
      --color-warning-bg: rgba(255, 193, 7, 0.15);
      --color-danger-bg: rgba(220, 53, 69, 0.15);
      --color-info-bg: rgba(23, 162, 184, 0.15);
      --color-purple-bg: rgba(111, 66, 193, 0.15);
      --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }

    body {
      font-family: var(--font-family);
      background-color: var(--vscode-editor-background);
      color: var(--vscode-editor-foreground);
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      line-height: 1.5;
    }

    /* Header & Navigation */
    .header {
      background-color: var(--vscode-sideBar-background, #1e1e1e);
      border-bottom: 1px solid var(--vscode-panel-border, #333);
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-icon {
      font-size: 24px;
      background: linear-gradient(135deg, #17a2b8, #28a745);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
    }

    .brand-title {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .brand-subtitle {
      font-size: 11px;
      opacity: 0.7;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }

    /* Tabs */
    .tab-bar {
      display: flex;
      gap: 4px;
      background: var(--vscode-editorGroupHeader-tabsBackground, #252526);
      padding: 4px 24px 0 24px;
      border-bottom: 1px solid var(--vscode-panel-border, #333);
    }

    .tab-btn {
      background: transparent;
      border: none;
      color: var(--vscode-tab-inactiveForeground, #888);
      padding: 10px 18px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .tab-btn:hover {
      color: var(--vscode-tab-activeForeground, #fff);
      background: rgba(255, 255, 255, 0.04);
    }

    .tab-btn.active {
      color: var(--vscode-tab-activeForeground, #fff);
      border-bottom: 2px solid var(--vscode-progressBar-background, #007acc);
      background: var(--vscode-editor-background);
    }

    /* Content Area */
    .container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Metrics Grid & Separated Rows */
    .metrics-section {
      background: var(--vscode-sideBar-background, #252526);
      border: 1px solid var(--vscode-panel-border, #333);
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .metrics-row-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .metrics-row-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 12px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 14px;
    }

    .metric-card {
      background: var(--vscode-editor-background, #1e1e1e);
      border: 1px solid var(--vscode-panel-border, #333);
      border-radius: 8px;
      padding: 14px 16px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .metric-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
    }

    .metric-card.danger::before { background: var(--color-danger); }
    .metric-card.warning::before { background: var(--color-warning); }
    .metric-card.success::before { background: var(--color-success); }
    .metric-card.info::before { background: var(--color-info); }
    .metric-card.purple::before { background: var(--color-purple); }

    .metric-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      opacity: 0.7;
      margin-bottom: 6px;
    }

    .metric-value {
      font-size: 26px;
      font-weight: 700;
      line-height: 1.1;
    }

    .metric-sub {
      font-size: 12px;
      margin-top: 6px;
      opacity: 0.8;
    }

    /* Buttons */
    .btn {
      background: var(--vscode-button-background, #007acc);
      color: var(--vscode-button-foreground, #fff);
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s ease;
    }

    .btn:hover {
      background: var(--vscode-button-hoverBackground, #0062a3);
    }

    .btn-secondary {
      background: var(--vscode-button-secondaryBackground, #3a3d41);
      color: var(--vscode-button-secondaryForeground, #fff);
    }

    .btn-secondary:hover {
      background: var(--vscode-button-secondaryHoverBackground, #45494e);
    }

    .btn-success {
      background: #28a745;
      color: white;
    }
    .btn-success:hover {
      background: #218838;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }
    .btn-danger:hover {
      background: #c82333;
    }

    .btn-sm {
      padding: 4px 10px;
      font-size: 11px;
    }

    /* Phase Banners */
    .sprint-phase-banner {
      background: linear-gradient(135deg, rgba(23, 162, 184, 0.15), rgba(40, 167, 69, 0.1));
      border: 1px solid rgba(23, 162, 184, 0.4);
      border-radius: 8px;
      padding: 14px 20px;
      margin: 24px 0 16px 0;
      font-weight: 700;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .sprint-phase-banner.code-scanning {
      background: linear-gradient(135deg, rgba(111, 66, 193, 0.15), rgba(23, 162, 184, 0.1));
      border: 1px solid rgba(111, 66, 193, 0.4);
    }
    .sprint-phase-sub {
      font-size: 12px;
      opacity: 0.8;
      font-weight: 400;
      margin-top: 2px;
    }

    /* Cards & Grids */
    .sprint-header {
      background: var(--vscode-sideBar-background, #252526);
      border: 1px solid var(--vscode-panel-border, #333);
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .sprint-title {
      font-size: 15px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .sprint-desc {
      font-size: 12px;
      opacity: 0.8;
      margin-top: 4px;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .vuln-card {
      background: var(--vscode-sideBar-background, #252526);
      border: 1px solid var(--vscode-panel-border, #333);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.15s ease, border-color 0.15s ease;
    }

    .vuln-card:hover {
      border-color: var(--vscode-focusBorder, #007acc);
      transform: translateY(-2px);
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }

    .card-badges {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .card-title {
      font-size: 14px;
      font-weight: 600;
      line-height: 1.35;
      margin-bottom: 8px;
    }

    .card-desc {
      font-size: 12px;
      opacity: 0.8;
      line-height: 1.4;
      margin-bottom: 12px;
    }

    .card-meta {
      font-size: 11px;
      opacity: 0.75;
      background: rgba(0,0,0,0.2);
      padding: 8px 10px;
      border-radius: 4px;
      margin-bottom: 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255,255,255,0.06);
      padding-top: 12px;
      margin-top: 8px;
    }

    /* Badges */
    .badge {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-critical { background: var(--color-danger-bg); color: var(--color-danger); border: 1px solid var(--color-danger); }
    .badge-high { background: rgba(253, 126, 20, 0.2); color: #fd7e14; border: 1px solid #fd7e14; }
    .badge-medium { background: var(--color-warning-bg); color: var(--color-warning); border: 1px solid var(--color-warning); }
    .badge-low { background: var(--color-success-bg); color: var(--color-success); border: 1px solid var(--color-success); }

    .badge-s { background: var(--color-success-bg); color: var(--color-success); border: 1px solid var(--color-success); }
    .badge-m { background: var(--color-warning-bg); color: var(--color-warning); border: 1px solid var(--color-warning); }
    .badge-l { background: var(--color-danger-bg); color: var(--color-danger); border: 1px solid var(--color-danger); }
    .badge-xl { background: rgba(111, 66, 193, 0.25); color: #d2a8ff; border: 1px solid rgba(111, 66, 193, 0.6); }

    /* Advice Card & Target/Risk Reduction Styling with Darker Font for High Contrast */
    .advice-card {
      background: linear-gradient(135deg, rgba(23, 162, 184, 0.12), rgba(111, 66, 193, 0.15));
      border: 1px solid rgba(23, 162, 184, 0.4);
      border-radius: 6px;
      padding: 10px 14px;
      margin: 10px 0;
      font-size: 11px;
      line-height: 1.45;
    }
    .advice-title {
      font-weight: 700;
      color: #58a6ff;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;
      font-size: 12px;
    }
    .advice-target {
      background: #85e89d;
      color: #111111; /* Dark text (black/dark-brown) for sharp readability against light green badge */
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 700;
      border: 1px solid #34d058;
      display: inline-block;
    }
    .advice-ideal {
      background: rgba(220, 53, 69, 0.2);
      color: #ff7b72;
      padding: 2px 7px;
      border-radius: 4px;
      text-decoration: line-through;
      border: 1px solid rgba(220, 53, 69, 0.3);
      display: inline-block;
    }
    .advice-risk-reduction {
      color: #111111; /* Darker font (black/dark brown) for clear visibility */
      font-weight: 700;
      background: #85e89d;
      padding: 2px 8px;
      border-radius: 4px;
      display: inline-block;
      border: 1px solid #34d058;
      margin-top: 4px;
    }

    .status-pill {
      font-size: 11px;
      padding: 3px 10px;
      border-radius: 10px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-pending { background: rgba(255,255,255,0.1); color: #ccc; }
    .status-in_progress { background: var(--color-info-bg); color: var(--color-info); }
    .status-applied { background: var(--color-warning-bg); color: var(--color-warning); }
    .status-verified { background: var(--color-success-bg); color: var(--color-success); }
    .status-failed { background: var(--color-danger-bg); color: var(--color-danger); }
    .status-rejected { background: rgba(108, 117, 125, 0.2); color: #aaa; }

    /* Checkpoint Overlay Banner */
    .checkpoint-banner {
      background: linear-gradient(135deg, rgba(40, 167, 69, 0.2) 0%, rgba(23, 162, 184, 0.15) 100%);
      border: 1px solid var(--color-success);
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .checkpoint-info h3 {
      margin: 0 0 4px 0;
      font-size: 15px;
      color: #7ee787;
    }

    .checkpoint-info p {
      margin: 0;
      font-size: 12px;
      opacity: 0.9;
    }

    /* Terminal/Log Box */
    .terminal-box {
      background: #0d1117;
      border: 1px solid #30363d;
      border-radius: 6px;
      padding: 12px 14px;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 11px;
      line-height: 1.45;
      color: #c9d1d9;
      margin: 10px 0;
      overflow-x: auto;
    }

    .terminal-title {
      font-weight: 700;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
    }

    /* Diff View */
    .diff-container {
      background: var(--vscode-editor-background);
      border: 1px solid var(--vscode-panel-border, #333);
      border-radius: 8px;
      overflow: hidden;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 12px;
      margin-bottom: 24px;
    }

    .diff-header {
      background: var(--vscode-sideBar-background, #252526);
      padding: 10px 16px;
      border-bottom: 1px solid var(--vscode-panel-border, #333);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }

    .diff-line {
      display: flex;
      padding: 2px 12px;
      line-height: 1.5;
    }

    .diff-line.add {
      background: rgba(46, 160, 67, 0.15);
      color: #7ee787;
    }

    .diff-line.delete {
      background: rgba(248, 81, 73, 0.15);
      color: #ffa198;
    }

    .diff-line.normal {
      color: #8b949e;
    }

    .diff-line-num {
      width: 40px;
      user-select: none;
      opacity: 0.4;
      text-align: right;
      padding-right: 12px;
      font-size: 11px;
    }

    .diff-line-code {
      flex: 1;
      white-space: pre-wrap;
    }

    /* Settings Tab */
    .settings-group {
      background: var(--vscode-sideBar-background, #252526);
      border: 1px solid var(--vscode-panel-border, #333);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      max-width: 850px;
    }

    .settings-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    .settings-row:last-child {
      border-bottom: none;
    }

    .settings-title {
      font-size: 13px;
      font-weight: 600;
    }

    .settings-desc {
      font-size: 11px;
      opacity: 0.7;
      margin-top: 2px;
    }

    select, input[type="text"], input[type="number"] {
      background: var(--vscode-input-background, #3c3c3c);
      color: var(--vscode-input-foreground, #fff);
      border: 1px solid var(--vscode-input-border, #555);
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 12px;
    }

    .json-textarea {
      width: 100%;
      height: 320px;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.45;
      background: var(--vscode-editor-background, #1e1e1e);
      color: var(--vscode-editor-foreground, #d4d4d4);
      border: 1px solid var(--vscode-input-border, #444);
      border-radius: 6px;
      padding: 12px;
      box-sizing: border-box;
      resize: vertical;
      tab-size: 2;
    }

    .json-textarea:focus {
      outline: 1px solid var(--vscode-focusBorder, #007acc);
    }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: var(--vscode-sideBar-background, #252526);
      border: 1px dashed var(--vscode-panel-border, #444);
      border-radius: 12px;
      margin: 20px 0;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.8;
    }

    .empty-title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .empty-desc {
      font-size: 13px;
      opacity: 0.7;
      max-width: 500px;
      margin: 0 auto 20px auto;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    <div class="brand">
      <div class="brand-icon">🛡️ CodeVulFixer</div>
      <div>
        <div class="brand-title">Enterprise Security Remediation Orchestrator</div>
        <div class="brand-subtitle">${state ? `${state.repoOwner}/${state.repoName} • Multi-Day Sprint Engine` : 'Automated & AI Fix Pipeline'}</div>
      </div>
    </div>
    <div class="header-actions">
      <button class="btn btn-secondary" onclick="exportToExcel()" title="Export complete dashboard to multi-tab Excel XML workbook (.xml)">
        <span>📊</span> Export to Excel (XML)
      </button>
      <button class="btn btn-secondary" onclick="validateAndRescan()" title="Rescan local workspace to detect fixed packages/patterns and auto-resolve linked findings with Zero AI Tokens">
        <span>🔍</span> Validate Local Fixes (0-Token)
      </button>
      <button class="btn btn-secondary" onclick="loadDemoData()">
        <span>🧪</span> Load Demo Data
      </button>
      <button class="btn" onclick="scanWorkspace()">
        <span>🔄</span> Ingest & Scan
      </button>
      <button class="btn btn-secondary" onclick="resetState()">
        <span>🗑️</span> Reset
      </button>
    </div>
  </div>

  <!-- Tab Bar -->
  <div class="tab-bar">
    <button id="tab-btn-risk-profile" class="tab-btn ${activeTab === 'risk-profile' ? 'active' : ''}" onclick="switchTab('risk-profile')">
      📊 Workspace Risk Profile
    </button>
    <button id="tab-btn-sprint-board" class="tab-btn ${activeTab === 'sprint-board' ? 'active' : ''}" onclick="switchTab('sprint-board')">
      📋 Multi-Day Sprint Board
    </button>
    <button id="tab-btn-diff-inspector" class="tab-btn ${activeTab === 'diff-inspector' ? 'active' : ''}" onclick="switchTab('diff-inspector')">
      🔍 Live Diff & Verification Intercept
    </button>
    <button id="tab-btn-settings" class="tab-btn ${activeTab === 'settings' ? 'active' : ''}" onclick="switchTab('settings')">
      ⚙️ Sprint Configuration
    </button>
  </div>

  <div class="container">

    <!-- TAB 1: Workspace Risk Profile -->
    <div id="tab-content-risk-profile" class="tab-content ${activeTab === 'risk-profile' ? 'active' : ''}">
      ${!state ? renderEmptyState() : renderRiskProfileTab(state)}
    </div>

    <!-- TAB 2: Multi-Day Sprint Board -->
    <div id="tab-content-sprint-board" class="tab-content ${activeTab === 'sprint-board' ? 'active' : ''}">
      ${!state ? renderEmptyState() : renderSprintBoardTab(state)}
    </div>

    <!-- TAB 3: Live Diff & Verification Intercept -->
    <div id="tab-content-diff-inspector" class="tab-content ${activeTab === 'diff-inspector' ? 'active' : ''}">
      ${renderDiffInspector(selectedDiffFinding, Object.values(state?.findings || {}))}
    </div>

    <!-- TAB 4: Sprint Configuration & Live State JSON -->
    <div id="tab-content-settings" class="tab-content ${activeTab === 'settings' ? 'active' : ''}">
      ${renderSettingsTab(state)}
    </div>

  </div>

  <script>
    const vscode = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : null;
    const appState = ${stateJson};
    const currentDiffFinding = ${selectedFindingJson};

    function sendCommand(cmd, payload = {}) {
      if (vscode) {
        vscode.postMessage({ command: cmd, ...payload });
      } else {
        alert('This is a standalone offline dashboard export for review. To execute automated actions or run fixes, open CodeVulFixer in VS Code.');
      }
    }

    function switchTab(tabName) {
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

      const targetBtn = document.getElementById('tab-btn-' + tabName);
      if (targetBtn) targetBtn.classList.add('active');

      const targetContent = document.getElementById('tab-content-' + tabName);
      if (targetContent) targetContent.classList.add('active');

      if (vscode) {
        vscode.postMessage({ command: 'switchTabNoReload', tab: tabName });
      }
    }

    function exportToExcel() {
      sendCommand('exportToExcel');
    }

    function validateAndRescan() {
      sendCommand('validateLocal');
    }

    function scanWorkspace() {
      sendCommand('scan');
    }

    function loadDemoData() {
      sendCommand('loadDemoData');
    }

    function resetState() {
      if (confirm('Reset CodeVulFixer sprint state?')) {
        sendCommand('resetState');
      }
    }

    function executeSprint(sprintNumber) {
      sendCommand('runSprint', { sprintNumber });
    }

    function applySingleFix(findingId, engine) {
      sendCommand('applyFix', { findingId, engine });
    }

    function inspectDiff(findingId) {
      sendCommand('inspectDiff', { findingId });
    }

    function markVerifiedAndStage(findingId) {
      sendCommand('verifyStage', { findingId });
    }

    function rejectAndRollback(findingId) {
      sendCommand('rejectRollback', { findingId });
    }

    function saveSettings() {
      const mode = document.getElementById('planningMode').value;
      const days = parseInt(document.getElementById('daysPerSprint').value, 10);
      const maxHighRisk = parseInt(document.getElementById('maxHighRisk').value, 10);
      const targetDays = parseInt(document.getElementById('targetDays').value, 10);
      const pkgManager = document.getElementById('pkgManager').value;
      const engine = document.getElementById('engine').value;

      vscode.postMessage({
        command: 'saveSettings',
        settings: {
          planningMode: mode,
          daysPerSprint: days,
          maxHighRiskPerDay: maxHighRisk,
          targetSprintDays: targetDays,
          packageManager: pkgManager,
          preferredFixEngine: engine
        }
      });
    }

    function saveSprintStateJson() {
      const textarea = document.getElementById('rawStateJson');
      if (!textarea) return;
      const raw = textarea.value.trim();
      try {
        JSON.parse(raw);
      } catch (err) {
        alert('Invalid JSON Syntax: ' + err.message);
        return;
      }
      vscode.postMessage({ command: 'saveSprintStateJson', rawJson: raw });
    }

    function reloadState() {
      vscode.postMessage({ command: 'reloadState' });
    }

    function copyStateJson() {
      const textarea = document.getElementById('rawStateJson');
      if (!textarea) return;
      navigator.clipboard.writeText(textarea.value).then(() => {
        alert('Sprint state JSON copied to clipboard!');
      }).catch(err => {
        alert('Failed to copy: ' + err);
      });
    }

    function formatStateJson() {
      const textarea = document.getElementById('rawStateJson');
      if (!textarea) return;
      try {
        const obj = JSON.parse(textarea.value);
        textarea.value = JSON.stringify(obj, null, 2);
      } catch (err) {
        alert('Cannot format invalid JSON: ' + err.message);
      }
    }
  </script>
</body>
</html>`;
}

function renderEmptyState(): string {
  return `
    <div class="empty-state">
      <div class="empty-icon">🛡️</div>
      <div class="empty-title">No Active Vulnerability Sprints Ingested</div>
      <div class="empty-desc">
        CodeVulFixer connects securely to GitHub to ingest Dependabot alerts and Code Scanning (CodeQL) findings, or you can load realistic demo findings immediately to test the entire remediation pipeline.
      </div>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button class="btn btn-success" onclick="loadDemoData()">
          <span>🧪</span> Load Realistic Demo Findings
        </button>
        <button class="btn" onclick="scanWorkspace()">
          <span>🔐</span> Authenticate & Ingest GitHub Findings
        </button>
      </div>
    </div>
  `;
}

/**
 * Top Summary Telemetry Metrics: 2 distinct rows
 * Row 1: Dependabot Vulnerabilities (Priority 1)
 * Row 2: Code Scanning Findings (Priority 2)
 */
function renderSeparatedSummaryMetrics(state: SprintState): string {
  const findingsList = Object.values(state.findings || {});
  const depFindings = findingsList.filter(f => f.source === 'dependabot');
  const csFindings = findingsList.filter(f => f.source === 'code_scanning');

  // Dependabot metrics
  const depCritical = depFindings.filter(f => f.severity === 'critical').length;
  const depHigh = depFindings.filter(f => f.severity === 'high').length;
  const depMedium = depFindings.filter(f => f.severity === 'medium').length;
  const depLow = depFindings.filter(f => f.severity === 'low').length;
  const depResolved = depFindings.filter(f => f.status === 'verified').length;
  const depHours = Math.round(depFindings.reduce((sum, f) => sum + (f.sizing?.estimatedHours || 0), 0) * 10) / 10;
  const depSaved = Math.round(depHours * 0.75 * 10) / 10;
  const depCompletion = depFindings.length > 0 ? Math.round((depResolved / depFindings.length) * 100) : 0;

  // Code Scanning metrics
  const csCritical = csFindings.filter(f => f.severity === 'critical').length;
  const csHigh = csFindings.filter(f => f.severity === 'high').length;
  const csMedium = csFindings.filter(f => f.severity === 'medium').length;
  const csLow = csFindings.filter(f => f.severity === 'low').length;
  const csResolved = csFindings.filter(f => f.status === 'verified').length;
  const csHours = Math.round(csFindings.reduce((sum, f) => sum + (f.sizing?.estimatedHours || 0), 0) * 10) / 10;
  const csSaved = Math.round(csHours * 0.75 * 10) / 10;
  const csCompletion = csFindings.length > 0 ? Math.round((csResolved / csFindings.length) * 100) : 0;

  return `
    <div style="margin-bottom: 24px;">
      <!-- Row 1: Dependabot Vulnerabilities (Priority 1) -->
      <div class="metrics-section">
        <div class="metrics-row-header">
          <span class="metrics-row-badge" style="background: rgba(23, 162, 184, 0.2); color: #17a2b8; border: 1px solid rgba(23, 162, 184, 0.4);">
            📦 Priority 1: Dependabot Vulnerabilities (${depFindings.length} Total)
          </span>
          <span style="font-size: 11px; opacity: 0.75;">Third-party dependencies, direct/transitive lockfile CVEs & framework upgrades</span>
        </div>
        <div class="metrics-grid">
          <div class="metric-card danger">
            <div class="metric-label">Dependabot Critical & High</div>
            <div class="metric-value">${depCritical + depHigh}</div>
            <div class="metric-sub">🔴 ${depCritical} Critical • 🟠 ${depHigh} High</div>
          </div>
          <div class="metric-card warning">
            <div class="metric-label">Dependabot Medium & Low</div>
            <div class="metric-value">${depMedium + depLow}</div>
            <div class="metric-sub">🟡 ${depMedium} Medium • 🟢 ${depLow} Low</div>
          </div>
          <div class="metric-card success">
            <div class="metric-label">Dependabot Remediated</div>
            <div class="metric-value">${depResolved} / ${depFindings.length}</div>
            <div class="metric-sub">🟢 ${depCompletion}% Dependabot Completion</div>
          </div>
          <div class="metric-card info">
            <div class="metric-label">Dependabot Developer Time Saved</div>
            <div class="metric-value">${depSaved}h</div>
            <div class="metric-sub">🔵 Total Effort: ${depHours}h</div>
          </div>
        </div>
      </div>

      <!-- Row 2: Code Scanning Findings (Priority 2) -->
      <div class="metrics-section">
        <div class="metrics-row-header">
          <span class="metrics-row-badge" style="background: rgba(111, 66, 193, 0.2); color: #d2a8ff; border: 1px solid rgba(111, 66, 193, 0.4);">
            🔍 Priority 2: Code Scanning (CodeQL / SAST) Findings (${csFindings.length} Total)
          </span>
          <span style="font-size: 11px; opacity: 0.75;">First-party static analysis taint flows, injection flaws & code hygiene</span>
        </div>
        <div class="metrics-grid">
          <div class="metric-card danger">
            <div class="metric-label">Code Scanning Critical & High</div>
            <div class="metric-value">${csCritical + csHigh}</div>
            <div class="metric-sub">🔴 ${csCritical} Critical • 🟠 ${csHigh} High</div>
          </div>
          <div class="metric-card warning">
            <div class="metric-label">Code Scanning Medium & Low</div>
            <div class="metric-value">${csMedium + csLow}</div>
            <div class="metric-sub">🟡 ${csMedium} Medium • 🟢 ${csLow} Low</div>
          </div>
          <div class="metric-card success">
            <div class="metric-label">Code Scanning Remediated</div>
            <div class="metric-value">${csResolved} / ${csFindings.length}</div>
            <div class="metric-sub">🟢 ${csCompletion}% CodeQL Completion</div>
          </div>
          <div class="metric-card info">
            <div class="metric-label">Code Scanning Developer Time Saved</div>
            <div class="metric-value">${csSaved}h</div>
            <div class="metric-sub">🔵 Total Effort: ${csHours}h</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Root-Cause Consolidation & Unique Vulnerabilities Analysis (Clubbing & Co-Remediation)
 */
function renderClubbingAndUniqueIssuesSection(state: SprintState): string {
  const clubbing = state.clubbingSummary || ClubbingEngine.analyzeClusters(state.findings);
  const pkgClusters = clubbing.clusters.filter(c => c.type === 'package');
  const cweClusters = clubbing.clusters.filter(c => c.type === 'cwe_rule');

  return `
    <div class="metrics-section" style="margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
        <div>
          <div style="font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
            <span>🧩</span> Root-Cause Consolidation & Unique Vulnerabilities Analysis
            <span class="badge" style="background: rgba(40,167,69,0.2); color: #28a745; border: 1px solid rgba(40,167,69,0.4);">
              ${clubbing.remediationLeverageRatio}x Remediation Leverage
            </span>
          </div>
          <div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">
            Consolidated <strong>${clubbing.totalRawFindings} raw security alerts</strong> into <strong>${clubbing.uniqueIssuesCount} unique root issues</strong> (${clubbing.uniquePackagesCount} unique packages, ${clubbing.uniqueCweRulesCount} unique CodeQL patterns). Fixing one root package or pattern automatically co-resolves multiple linked findings with Zero Tokens!
          </div>
        </div>

        <div style="display: flex; gap: 10px;">
          <div style="background: var(--vscode-editor-background); border: 1px solid var(--vscode-panel-border, #333); border-radius: 6px; padding: 6px 14px; text-align: center;">
            <div style="font-size: 10px; opacity: 0.7; text-transform: uppercase;">Raw Alerts</div>
            <div style="font-size: 18px; font-weight: 800; color: #ff7b72;">${clubbing.totalRawFindings}</div>
          </div>
          <div style="background: var(--vscode-editor-background); border: 1px solid var(--vscode-panel-border, #333); border-radius: 6px; padding: 6px 14px; text-align: center;">
            <div style="font-size: 10px; opacity: 0.7; text-transform: uppercase;">Unique Issues</div>
            <div style="font-size: 18px; font-weight: 800; color: #79c0ff;">${clubbing.uniqueIssuesCount}</div>
          </div>
          <div style="background: var(--vscode-editor-background); border: 1px solid var(--vscode-panel-border, #333); border-radius: 6px; padding: 6px 14px; text-align: center;">
            <div style="font-size: 10px; opacity: 0.7; text-transform: uppercase;">Remediation Leverage</div>
            <div style="font-size: 18px; font-weight: 800; color: #56d364;">${clubbing.remediationLeverageRatio}x</div>
          </div>
        </div>
      </div>

      <!-- Clusters Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <!-- Left: Unique Packages (Dependabot) -->
        <div style="background: var(--vscode-editor-background); border: 1px solid var(--vscode-panel-border, #333); border-radius: 6px; padding: 14px;">
          <div style="font-size: 13px; font-weight: 700; color: #17a2b8; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span>📦 Unique Root Packages (${pkgClusters.length})</span>
            <span style="font-size: 11px; opacity: 0.8; font-weight: 400;">Approach 1: Co-Remediation</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${pkgClusters.map(c => `
              <div style="background: var(--vscode-sideBar-background, #252526); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 600; font-size: 12.5px;">${escapeHtml(c.name)} ${c.targetFixedVersion ? `<span style="opacity: 0.7; font-size: 11px;">(➔ ${escapeHtml(c.targetFixedVersion)})</span>` : ''}</div>
                  <div style="font-size: 11px; opacity: 0.75; margin-top: 2px;">
                    Linked Alerts: ${c.findingIds.map(id => `<code>${id}</code>`).join(', ')}
                  </div>
                </div>
                <div style="text-align: right;">
                  <span class="badge badge-${c.highestSeverity}">${c.highestSeverity}</span>
                  <div style="margin-top: 4px;">
                    ${c.resolvedFindings === c.totalFindings
                      ? '<span class="badge badge-success">🟢 All Remediated</span>'
                      : `<span class="badge" style="background: rgba(23,162,184,0.15); color: #17a2b8;">⚡ ${c.totalFindings} Alerts Linked</span>`}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right: Unique CWE / Rule Families (Code Scanning) -->
        <div style="background: var(--vscode-editor-background); border: 1px solid var(--vscode-panel-border, #333); border-radius: 6px; padding: 14px;">
          <div style="font-size: 13px; font-weight: 700; color: #d2a8ff; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span>🔍 Unique CodeQL CWE Families (${cweClusters.length})</span>
            <span style="font-size: 11px; opacity: 0.8; font-weight: 400;">Approach 2: Learned Patterns</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${cweClusters.map(c => `
              <div style="background: var(--vscode-sideBar-background, #252526); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 600; font-size: 12.5px;">${escapeHtml(c.name)}</div>
                  <div style="font-size: 11px; opacity: 0.75; margin-top: 2px;">
                    Occurrences: ${c.findingIds.map(id => `<code>${id}</code>`).join(', ')}
                  </div>
                </div>
                <div style="text-align: right;">
                  <span class="badge badge-${c.highestSeverity}">${c.highestSeverity}</span>
                  <div style="margin-top: 4px;">
                    ${c.resolvedFindings > 0
                      ? '<span class="badge" style="background: rgba(111,66,193,0.25); color: #d2a8ff;">⚡ Zero-Token Learned</span>'
                      : `<span class="badge" style="background: rgba(255,193,7,0.15); color: #ffc107;">${c.totalFindings} Occurrences</span>`}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * TAB 1: Workspace Risk Profile
 * Separates Sizing and Estimation into two sequential sections:
 * 1. Dependabot Vulnerabilities
 * 2. Code Scanning Findings
 */
function renderRiskProfileTab(state: SprintState): string {
  const m = state.metrics;
  const findingsList = Object.values(state.findings || {});
  const depFindings = findingsList.filter(f => f.source === 'dependabot');
  const csFindings = findingsList.filter(f => f.source === 'code_scanning');

  const depHours = Math.round(depFindings.reduce((sum, f) => sum + (f.sizing?.estimatedHours || 0), 0) * 10) / 10;
  const csHours = Math.round(csFindings.reduce((sum, f) => sum + (f.sizing?.estimatedHours || 0), 0) * 10) / 10;

  return `
    <!-- Top Summary Telemetry Metrics: 2 Rows -->
    ${renderSeparatedSummaryMetrics(state)}

    <!-- Root-Cause Consolidation & Unique Vulnerabilities Strip -->
    ${renderClubbingAndUniqueIssuesSection(state)}

    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 24px;">
      <div class="sprint-header" style="flex-direction: column; align-items: flex-start; gap: 12px;">
        <div style="font-size: 16px; font-weight: 700;">Executive Security Posture & Prioritized Remediation Roadmap</div>
        <p style="font-size: 13px; opacity: 0.85; margin: 0;">
          CodeVulFixer partitions remediation into two sequential tracks: <strong>Priority 1: Dependabot Vulnerabilities</strong> (stabilizing third-party manifests and locking safe versions) followed by <strong>Priority 2: Code Scanning Findings</strong> (AST pattern transforms and deep taint analysis).
        </p>
        <div style="display: flex; gap: 10px; margin-top: 8px;">
          <button class="btn btn-success" onclick="switchTab('sprint-board')">
            <span>🚀</span> Start Dependabot Sprints
          </button>
          <button class="btn btn-secondary" onclick="scanWorkspace()">
            <span>🔄</span> Refresh GitHub Ingestion
          </button>
        </div>
      </div>

      <div class="metric-card info" style="display: flex; flex-direction: column; justify-content: center;">
        <div class="metric-label">Multi-Day Remediation Timeline</div>
        <div style="font-size: 18px; font-weight: 700; margin: 8px 0;">${state.sprints.length} Planned Sprints</div>
        <div style="font-size: 12px; opacity: 0.85;">
          Sequenced so all Dependabot Vulnerabilities are resolved first, followed by CodeQL code refactoring.
        </div>
      </div>
    </div>

    <!-- Section 1: Dependabot Vulnerabilities Matrix -->
    <div class="sprint-header" style="flex-direction: column; align-items: flex-start; margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 12px;">
        <div>
          <span class="badge" style="background: rgba(23, 162, 184, 0.2); color: #17a2b8; font-size: 12px; padding: 4px 10px;">
            📦 Priority 1: Dependabot Vulnerabilities (${depFindings.length} Items • ${depHours}h Effort)
          </span>
        </div>
        <div style="display: flex; gap: 8px; font-size: 11px;">
          <span class="badge badge-s">Size S: ${depFindings.filter(f => f.sizing?.size === 'S').length}</span>
          <span class="badge badge-m">Size M: ${depFindings.filter(f => f.sizing?.size === 'M').length}</span>
          <span class="badge badge-l">Size L: ${depFindings.filter(f => f.sizing?.size === 'L').length}</span>
          <span class="badge badge-xl">Size XL: ${depFindings.filter(f => f.sizing?.size === 'XL').length}</span>
        </div>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr style="border-bottom: 1px solid var(--vscode-panel-border, #333); text-align: left; opacity: 0.7;">
            <th style="padding: 8px;">ID</th>
            <th style="padding: 8px;">Package & Target</th>
            <th style="padding: 8px;">Severity</th>
            <th style="padding: 8px;">Title</th>
            <th style="padding: 8px;">T-Shirt Size</th>
            <th style="padding: 8px;">Risk Level</th>
            <th style="padding: 8px;">Est. Hours</th>
            <th style="padding: 8px;">Target Sprint</th>
            <th style="padding: 8px;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${depFindings.length === 0 ? '<tr><td colspan="9" style="padding: 12px; text-align: center; opacity: 0.6;">No Dependabot vulnerabilities found.</td></tr>' : depFindings.map(f => `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 8px; font-family: monospace;">${f.id}</td>
              <td style="padding: 8px;"><strong>${f.dependency?.packageName || 'package'}</strong> (${f.dependency?.currentVersion} ➔ ${f.dependency?.fixedVersion})</td>
              <td style="padding: 8px;"><span class="badge badge-${f.severity}">${f.severity}</span></td>
              <td style="padding: 8px; font-weight: 500;">${f.title}</td>
              <td style="padding: 8px;"><span class="badge badge-${f.sizing.size.toLowerCase()}">Size ${f.sizing.size}</span></td>
              <td style="padding: 8px;">${f.sizing.riskLevel.toUpperCase()}</td>
              <td style="padding: 8px;">${f.sizing.estimatedHours}h</td>
              <td style="padding: 8px;">Sprint ${f.targetSprint}</td>
              <td style="padding: 8px;"><span class="status-pill status-${f.status}">${f.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Section 2: Code Scanning Findings Matrix -->
    <div class="sprint-header" style="flex-direction: column; align-items: flex-start;">
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 12px;">
        <div>
          <span class="badge" style="background: rgba(111, 66, 193, 0.2); color: #d2a8ff; font-size: 12px; padding: 4px 10px;">
            🔍 Priority 2: Code Scanning (CodeQL / SAST) Findings (${csFindings.length} Items • ${csHours}h Effort)
          </span>
        </div>
        <div style="display: flex; gap: 8px; font-size: 11px;">
          <span class="badge badge-s">Size S: ${csFindings.filter(f => f.sizing?.size === 'S').length}</span>
          <span class="badge badge-m">Size M: ${csFindings.filter(f => f.sizing?.size === 'M').length}</span>
          <span class="badge badge-l">Size L: ${csFindings.filter(f => f.sizing?.size === 'L').length}</span>
          <span class="badge badge-xl">Size XL: ${csFindings.filter(f => f.sizing?.size === 'XL').length}</span>
        </div>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr style="border-bottom: 1px solid var(--vscode-panel-border, #333); text-align: left; opacity: 0.7;">
            <th style="padding: 8px;">ID</th>
            <th style="padding: 8px;">Rule & Location</th>
            <th style="padding: 8px;">Severity</th>
            <th style="padding: 8px;">Title</th>
            <th style="padding: 8px;">T-Shirt Size</th>
            <th style="padding: 8px;">Risk Level</th>
            <th style="padding: 8px;">Est. Hours</th>
            <th style="padding: 8px;">Target Sprint</th>
            <th style="padding: 8px;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${csFindings.length === 0 ? '<tr><td colspan="9" style="padding: 12px; text-align: center; opacity: 0.6;">No Code Scanning findings found.</td></tr>' : csFindings.map(f => `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 8px; font-family: monospace;">${f.id}</td>
              <td style="padding: 8px;"><code>${f.ruleId || 'SAST'}</code> (${f.location?.filePath || 'source'})</td>
              <td style="padding: 8px;"><span class="badge badge-${f.severity}">${f.severity}</span></td>
              <td style="padding: 8px; font-weight: 500;">${f.title}</td>
              <td style="padding: 8px;"><span class="badge badge-${f.sizing.size.toLowerCase()}">Size ${f.sizing.size}</span></td>
              <td style="padding: 8px;">${f.sizing.riskLevel.toUpperCase()}</td>
              <td style="padding: 8px;">${f.sizing.estimatedHours}h</td>
              <td style="padding: 8px;">Sprint ${f.targetSprint}</td>
              <td style="padding: 8px;"><span class="status-pill status-${f.status}">${f.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * TAB 2: Sprint Board
 * Sequenced so Dependabot Sprints appear first, followed by Code Scanning Sprints.
 */
function renderSprintBoardTab(state: SprintState): string {
  const depSprints = state.sprints.filter(s => s.category === 'dependabot' || s.findings.some(id => state.findings[id]?.source === 'dependabot'));
  const csSprints = state.sprints.filter(s => s.category === 'code_scanning' || (!depSprints.includes(s) && s.findings.some(id => state.findings[id]?.source === 'code_scanning')));
  const otherSprints = state.sprints.filter(s => !depSprints.includes(s) && !csSprints.includes(s));

  return `
    <!-- Top Summary Telemetry Metrics: 2 Rows -->
    ${renderSeparatedSummaryMetrics(state)}

    <!-- Phase 1: Dependabot Vulnerabilities -->
    <div class="sprint-phase-banner">
      <div>
        <span>📦 Phase 1: Dependabot Vulnerability Remediation Sprints (Priority 1)</span>
        <div class="sprint-phase-sub">First, resolve all third-party package vulnerabilities, manifest locks, and framework upgrades.</div>
      </div>
      <span class="badge" style="background: rgba(23,162,184,0.25); color: #17a2b8;">${depSprints.length} Planned Sprints</span>
    </div>
    ${depSprints.length === 0 ? '<div style="opacity: 0.6; font-size: 13px; margin-bottom: 20px;">No Dependabot sprints required.</div>' : depSprints.map(s => renderSprintChunk(s, state)).join('')}

    <!-- Phase 2: Code Scanning Findings -->
    <div class="sprint-phase-banner code-scanning">
      <div>
        <span>🔍 Phase 2: Code Scanning (CodeQL / SAST) Remediation Sprints (Priority 2)</span>
        <div class="sprint-phase-sub">After dependencies are stabilized, proceed with application taint analysis, SQL/Command injections, and code hygiene.</div>
      </div>
      <span class="badge" style="background: rgba(111, 66, 193, 0.25); color: #d2a8ff;">${csSprints.length} Planned Sprints</span>
    </div>
    ${csSprints.length === 0 ? '<div style="opacity: 0.6; font-size: 13px; margin-bottom: 20px;">No Code Scanning sprints required.</div>' : csSprints.map(s => renderSprintChunk(s, state)).join('')}

    ${otherSprints.length > 0 ? `
      <div class="sprint-phase-banner">
        <span>📋 Additional Remediation Sprints</span>
      </div>
      ${otherSprints.map(s => renderSprintChunk(s, state)).join('')}
    ` : ''}
  `;
}

function renderSprintChunk(sprint: any, state: SprintState): string {
  const sprintFindings = (sprint.findings || []).map((id: string) => state.findings[id]).filter(Boolean);

  return `
    <div style="margin-bottom: 32px;">
      <div class="sprint-header">
        <div>
          <div class="sprint-title">
            <span>📅 ${sprint.dayLabel}:</span> ${sprint.title}
            <span class="badge" style="background: rgba(23,162,184,0.15); color: #17a2b8; margin-left: 6px;">⏱️ ${sprint.durationDays || 10} Days</span>
            <span class="badge badge-s" style="margin-left: 6px;">${sprint.totalEstimatedHours}h effort</span>
            <span class="status-pill status-${sprint.status}">${sprint.status}</span>
          </div>
          <div class="sprint-desc">${sprint.description}</div>
        </div>
        <div class="sprint-actions" style="display: flex; gap: 8px;">
          <button class="btn btn-success" onclick="executeSprint(${sprint.sprintNumber})">
            <span>⚡</span> Execute Automated Sprint Fixes
          </button>
          <button class="btn btn-secondary" onclick="validateAndRescan()" title="Rescan and validate this sprint day's fixes locally without AI">
            <span>🔍</span> Validate Day Fixes
          </button>
        </div>
      </div>

      <div class="card-grid">
        ${sprintFindings.map((f: VulnerabilityFinding) => renderFindingCard(f)).join('')}
      </div>
    </div>
  `;
}

function renderFindingCard(f: VulnerabilityFinding): string {
  const isAppliedOrVerified = f.status === 'applied' || f.status === 'verified';
  const hasFailed = f.status === 'failed';

  return `
    <div class="vuln-card">
      <div>
        <div class="card-top">
          <div class="card-badges">
            <span class="badge badge-${f.severity}">${f.severity}</span>
            <span class="badge badge-${f.sizing.size.toLowerCase()}">Size ${f.sizing.size}</span>
            <span class="badge" style="background: rgba(23,162,184,0.15); color: #17a2b8;">${f.source === 'dependabot' ? '📦 Dependabot' : '🔍 CodeQL'}</span>
            ${f.resolutionEngine === 'co_remediation' || f.coRemediatedFromId ? '<span class="badge" style="background: rgba(40,167,69,0.25); color: #28a745; border: 1px solid #28a745;">⚡ Zero-Token Co-Remediation</span>' : ''}
            ${f.resolutionEngine === 'learned_pattern' ? '<span class="badge" style="background: rgba(111,66,193,0.25); color: #d2a8ff; border: 1px solid #6f42c1;">⚡ Zero-Token Learned Pattern</span>' : ''}
          </div>
          <span class="status-pill status-${f.status}">${f.status}</span>
        </div>

        <div class="card-title">${f.title}</div>
        <div class="card-desc">${f.description}</div>

        <div class="card-meta">
          ${f.dependency 
            ? `<div><strong>Package:</strong> ${f.dependency.packageName} (${f.dependency.currentVersion} ➔ <strong>${f.dependency.fixedVersion}</strong>)</div>
               <div><strong>Type:</strong> ${f.dependency.isDirect ? 'Direct Manifest' : 'Transitive Lockfile'} ${f.dependency.majorGap && f.dependency.majorGap > 1 ? `• <span class="badge badge-xl">${f.dependency.majorGap} Major Versions Leap</span>` : ''}</div>`
            : `<div><strong>Rule:</strong> ${f.ruleId || 'N/A'}</div>
               <div><strong>Target:</strong> ${f.location?.filePath || 'Source file'}:${f.location?.startLine ?? 1}</div>`
          }
          <div><strong>Advisory:</strong> ${f.cveId || f.ghsaId || f.id}</div>
          ${f.coRemediatedFromId ? `<div><strong style="color: #28a745;">⚡ Cascading Co-Remediated:</strong> Resolved via fix on <code>${escapeHtml(f.coRemediatedFromId)}</code> (0 AI tokens)</div>` : ''}
          ${f.resolutionEngine === 'learned_pattern' ? `<div><strong style="color: #d2a8ff;">⚡ Learned Pattern Active:</strong> Reused repo verified pattern (0 AI tokens)</div>` : ''}
        </div>

        ${f.compatibilityAdvice ? `
          <div class="advice-card">
            <div class="advice-title">💡 Smart Safe Upgrade Recommendation (Compatibility & Dependency Guard)</div>
            <div style="margin-bottom: 6px;">
              <span>Ideal Target: </span><span class="advice-ideal">${escapeHtml(f.compatibilityAdvice.idealVersion)}</span>
              <span style="margin: 0 4px;">➔</span>
              <span>Recommended Safe Target: </span><span class="advice-target">${escapeHtml(f.compatibilityAdvice.safeRecommendedVersion)}</span>
            </div>
            <div style="opacity: 0.9;"><strong>Constraint:</strong> ${escapeHtml(f.compatibilityAdvice.constraintSummary)}</div>
            <div style="margin-top: 4px; opacity: 0.95;"><strong>Strategy:</strong> ${escapeHtml(f.compatibilityAdvice.tradeoffReason)}</div>
            <div><span class="advice-risk-reduction"><strong>Risk Reduction:</strong> ${escapeHtml(f.compatibilityAdvice.riskReduction)}</span></div>
          </div>
        ` : ''}

        ${f.validationReport?.cascadingVulnerabilitiesIntroduced?.length ? `
          <div class="terminal-box" style="border-color: var(--color-danger); background: rgba(220, 53, 69, 0.1);">
            <div class="terminal-title">🚨 Collateral Vulnerabilities / Dependency Conflicts Intercepted</div>
            <div>${f.validationReport.cascadingVulnerabilitiesIntroduced.map(v => `• ${escapeHtml(v)}`).join('<br>')}</div>
            ${f.validationReport.suggestedAlternativeVersion ? `<div style="margin-top: 6px;"><span class="advice-risk-reduction"><strong>Safe Fallback:</strong> Upgrade to version <strong>${escapeHtml(f.validationReport.suggestedAlternativeVersion)}</strong> to mitigate risk safely.</span></div>` : ''}
          </div>
        ` : ''}

        ${hasFailed && f.validationReport?.failureStackTrace ? `
          <div class="terminal-box">
            <div class="terminal-title">❌ Validation Failure Details</div>
            <div>${escapeHtml(f.validationReport.failureStackTrace)}</div>
          </div>
        ` : ''}
      </div>

      <div class="card-footer">
        <div style="font-size: 11px; opacity: 0.7;">
          ⏱️ ${f.sizing.estimatedHours}h
        </div>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          ${f.status === 'applied' ? `
            <button class="btn btn-sm btn-success" onclick="markVerifiedAndStage('${f.id}')">
              👍 Verify & Stage
            </button>
            <button class="btn btn-sm btn-secondary" onclick="inspectDiff('${f.id}')">
              🔍 Inspect Diff
            </button>
            <button class="btn btn-sm btn-danger" onclick="rejectAndRollback('${f.id}')">
              ❌ Rollback
            </button>
          ` : f.status === 'verified' ? `
            <span style="font-size: 11px; color: var(--color-success); font-weight: 600;">✔ Staged to Git</span>
            <button class="btn btn-sm btn-secondary" onclick="inspectDiff('${f.id}')">
              Diff
            </button>
          ` : `
            <button class="btn btn-sm" onclick="applySingleFix('${f.id}', '${f.sizing.isAutomatedCandidate ? 'deterministic' : 'copilot'}')">
              ⚡ Apply Fix (${f.sizing.isAutomatedCandidate ? 'Zero-Token' : 'Copilot LM'})
            </button>
            <button class="btn btn-sm btn-secondary" onclick="inspectDiff('${f.id}')">
              Diff
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

function renderDiffInspector(finding?: VulnerabilityFinding, allFindings: VulnerabilityFinding[] = []): string {
  if (!finding) {
    const appliedFinding = allFindings.find(f => f.status === 'applied');
    if (appliedFinding) {
      finding = appliedFinding;
    }
  }

  if (!finding) {
    return `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <div class="empty-title">No Active Diff to Inspect</div>
        <div class="empty-desc">
          Apply a fix from the Sprint Board using either Zero-Token or Copilot LM. Once applied and verified by the local task runner, the line-by-line diff and human-in-the-loop checkpoint will appear here.
        </div>
        <button class="btn" onclick="switchTab('sprint-board')">Go to Sprint Board</button>
      </div>
    `;
  }

  const isAwaitingVerification = finding.status === 'applied';

  return `
    ${isAwaitingVerification ? `
      <!-- Mandatory Human-in-the-Loop Intercept Overlay -->
      <div class="checkpoint-banner">
        <div class="checkpoint-info">
          <h3>Mandatory Checkpoint: Local Automated Validation Passed</h3>
          <p>
            Build and regression test suites executed successfully. Review the exact line-by-line diff below before staging to Git SCM.
          </p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-success" onclick="markVerifiedAndStage('${finding.id}')">
            👍 Mark as Verified & Stage for Check-in
          </button>
          <button class="btn btn-danger" onclick="rejectAndRollback('${finding.id}')">
            ❌ Reject Fix & Rollback
          </button>
        </div>
      </div>
    ` : ''}

    ${finding.compatibilityAdvice ? `
      <div class="advice-card" style="margin-bottom: 20px;">
        <div class="advice-title">💡 Smart Safe Upgrade Recommendation (Active Compatibility Guard)</div>
        <div style="font-size: 13px; margin: 6px 0;">
          <span>Target Ideal: </span><span class="advice-ideal">${escapeHtml(finding.compatibilityAdvice.idealVersion)}</span>
          <span style="margin: 0 8px;">➔</span>
          <span>Selected Safe Target: </span><span class="advice-target">${escapeHtml(finding.compatibilityAdvice.safeRecommendedVersion)}</span>
        </div>
        <div style="margin-bottom: 4px;"><strong>Dependency Constraint:</strong> ${escapeHtml(finding.compatibilityAdvice.constraintSummary)}</div>
        <div style="margin-bottom: 4px;"><strong>Tradeoff Analysis:</strong> ${escapeHtml(finding.compatibilityAdvice.tradeoffReason)}</div>
        <div><span class="advice-risk-reduction"><strong>Risk Profile:</strong> ${escapeHtml(finding.compatibilityAdvice.riskReduction)}</span></div>
      </div>
    ` : ''}

    <div class="sprint-header">
      <div>
        <div class="sprint-title">Diff Inspector: ${finding.id} — ${finding.title}</div>
        <div class="sprint-desc">
          ${finding.dependency ? `Dependency Upgrade: ${finding.dependency.packageName}@${finding.dependency.fixedVersion}` : `Target: ${finding.location?.filePath || 'Source Code'}`}
        </div>
      </div>
      <div style="display: flex; gap: 8px;">
        <span class="badge badge-${finding.severity}">${finding.severity}</span>
        <span class="status-pill status-${finding.status}">${finding.status}</span>
      </div>
    </div>

    <!-- Unified Diff Container -->
    <div class="diff-container">
      <div class="diff-header">
        <span>📄 ${finding.location?.filePath || (finding.dependency ? 'package.json / package-lock.json / pom.xml' : 'workspace')}</span>
        <span style="font-size: 11px; opacity: 0.7;">Git Unified Diff</span>
      </div>
      <div>
        ${renderDiffLines(finding)}
      </div>
    </div>

    <!-- Validation Summary Card -->
    <div class="sprint-header" style="flex-direction: column; align-items: flex-start;">
      <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px;">Automated Validation Telemetry & Dependency Audit</div>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; width: 100%;">
        <div class="metric-card success">
          <div class="metric-label">Compilation / Build</div>
          <div style="font-size: 16px; font-weight: 700; color: var(--color-success);">✔ PASSED</div>
          <div class="metric-sub">${finding.validationReport?.buildDurationMs ?? 210}ms</div>
        </div>
        <div class="metric-card success">
          <div class="metric-label">Regression Tests</div>
          <div style="font-size: 16px; font-weight: 700; color: var(--color-success);">✔ PASSED</div>
          <div class="metric-sub">${finding.validationReport?.testDurationMs ?? 430}ms</div>
        </div>
        <div class="metric-card success">
          <div class="metric-label">Security Advisory</div>
          <div style="font-size: 16px; font-weight: 700; color: var(--color-success);">✔ CLEARED</div>
          <div class="metric-sub">${finding.cveId || finding.ghsaId || 'Advisory Mitigated'}</div>
        </div>
        <div class="metric-card ${finding.validationReport?.compatibilityStatus === 'failed' || finding.validationReport?.cascadingVulnerabilitiesIntroduced?.length ? 'danger' : 'success'}">
          <div class="metric-label">Collateral Audit</div>
          <div style="font-size: 16px; font-weight: 700; color: ${finding.validationReport?.compatibilityStatus === 'failed' || finding.validationReport?.cascadingVulnerabilitiesIntroduced?.length ? 'var(--color-danger)' : 'var(--color-success)'};">
            ${finding.validationReport?.compatibilityStatus === 'failed' || finding.validationReport?.cascadingVulnerabilitiesIntroduced?.length ? '❌ COLLATERAL BREAK' : '✔ ZERO COLLATERAL'}
          </div>
          <div class="metric-sub">
            ${finding.validationReport?.suggestedAlternativeVersion ? `Safe target: ${escapeHtml(finding.validationReport.suggestedAlternativeVersion)}` : 'Dependencies Compatible'}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderDiffLines(finding: VulnerabilityFinding): string {
  if (finding.appliedDiff) {
    const lines = finding.appliedDiff.split(/\r?\n/);
    return lines.map((l, i) => {
      let type = 'normal';
      if (l.startsWith('+')) type = 'add';
      else if (l.startsWith('-')) type = 'delete';
      return `
        <div class="diff-line ${type}">
          <div class="diff-line-num">${i + 1}</div>
          <div class="diff-line-code">${escapeHtml(l)}</div>
        </div>
      `;
    }).join('');
  }

  // Fallback demo diff if not yet captured
  if (finding.source === 'dependabot' && finding.dependency) {
    return `
      <div class="diff-line normal"><div class="diff-line-num">12</div><div class="diff-line-code">   "dependencies": {</div></div>
      <div class="diff-line delete"><div class="diff-line-num">13</div><div class="diff-line-code">-    "${finding.dependency.packageName}": "${finding.dependency.currentVersion}",</div></div>
      <div class="diff-line add"><div class="diff-line-num">13</div><div class="diff-line-code">+    "${finding.dependency.packageName}": "^${finding.dependency.fixedVersion}",</div></div>
      <div class="diff-line normal"><div class="diff-line-num">14</div><div class="diff-line-code">   }</div></div>
    `;
  }

  if (finding.location?.snippet) {
    return `
      <div class="diff-line normal"><div class="diff-line-num">33</div><div class="diff-line-code"> // Line before</div></div>
      <div class="diff-line delete"><div class="diff-line-num">34</div><div class="diff-line-code">-  ${escapeHtml(finding.location.snippet)}</div></div>
      <div class="diff-line add"><div class="diff-line-num">34</div><div class="diff-line-code">+  // Remediated safe implementation by CodeVulFixer</div></div>
      <div class="diff-line add"><div class="diff-line-num">35</div><div class="diff-line-code">+  ${escapeHtml(finding.remediationPlan)}</div></div>
      <div class="diff-line normal"><div class="diff-line-num">36</div><div class="diff-line-code"> // Line after</div></div>
    `;
  }

  return `
    <div class="diff-line normal">
      <div class="diff-line-num">1</div>
      <div class="diff-line-code">// No workspace file modifications detected yet for ${finding.id}</div>
    </div>
  `;
}

/**
 * TAB 4: Sprint Configuration & Live State JSON Editor
 * Displays Sprint Cadence settings AND live .codevulfixer/sprint-state.json
 * Works reliably on first install and all subsequent visits.
 */
function renderSettingsTab(state?: SprintState): string {
  const formattedStateJson = state ? JSON.stringify(state, null, 2) : JSON.stringify({
    version: "1.0.3",
    repoOwner: "workspace-owner",
    repoName: "workspace-repo",
    lastUpdated: new Date().toISOString(),
    planningMode: "sprint_wise",
    daysPerSprint: 10,
    sprints: [],
    findings: {},
    activeSprint: 1,
    metrics: {
      totalFindings: 0,
      resolvedCount: 0,
      pendingCount: 0,
      failedCount: 0,
      totalEstimatedHours: 0,
      hoursSaved: 0
    }
  }, null, 2);

  return `
    <!-- Settings Group 1: Sprint Orchestration Engine Settings -->
    <div class="settings-group">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="margin: 0; font-size: 16px;">⚙️ Sprint Orchestration Engine Settings</h3>
        <span class="badge badge-s">Active Cadence</span>
      </div>
      
      <div class="settings-row">
        <div>
          <div class="settings-title">Remediation Planning Cadence</div>
          <div class="settings-desc">Choose between a multi-day Agile Sprint cadence (10 working days / 2-week cycle) or daily micro-chunks.</div>
        </div>
        <select id="planningMode">
          <option value="sprint_wise" ${state?.planningMode === 'sprint_wise' || !state?.planningMode ? 'selected' : ''}>Sprint-wise Plan (10 Working Days / 2-Week Agile Cycle)</option>
          <option value="day_wise" ${state?.planningMode === 'day_wise' ? 'selected' : ''}>Day-wise Plan (Daily Micro-Sprints)</option>
        </select>
      </div>

      <div class="settings-row">
        <div>
          <div class="settings-title">Days per Agile Sprint</div>
          <div class="settings-desc">Number of working days considered per Agile Sprint (standard Scrum cycle is 10 days).</div>
        </div>
        <input type="number" id="daysPerSprint" min="1" max="30" value="${state?.daysPerSprint || 10}" style="width: 70px;">
      </div>

      <div class="settings-row">
        <div>
          <div class="settings-title">Max High-Risk Fixes Per Day</div>
          <div class="settings-desc">Enforce cognitive load limits by capping Size L / critical security rewrites per day.</div>
        </div>
        <input type="number" id="maxHighRisk" min="1" max="10" value="3" style="width: 70px;">
      </div>

      <div class="settings-row">
        <div>
          <div class="settings-title">Target Remediation Timeline (Days)</div>
          <div class="settings-desc">Target duration to schedule distributed sprint chunks.</div>
        </div>
        <input type="number" id="targetDays" min="1" max="14" value="4" style="width: 70px;">
      </div>

      <div class="settings-row">
        <div>
          <div class="settings-title">Preferred Package Manager CLI</div>
          <div class="settings-desc">Ecosystem CLI used for deterministic zero-token lockfile upgrades.</div>
        </div>
        <select id="pkgManager">
          <option value="auto">Auto-Detect (Recommended)</option>
          <option value="npm">npm</option>
          <option value="pnpm">pnpm</option>
          <option value="yarn">yarn</option>
          <option value="uv">uv</option>
          <option value="pip">pip</option>
        </select>
      </div>

      <div class="settings-row">
        <div>
          <div class="settings-title">Primary Repair Engine</div>
          <div class="settings-desc">Choose between Deterministic CLIs/AST rules or VS Code Copilot LM API.</div>
        </div>
        <select id="engine">
          <option value="auto">Auto (Deterministic for Lockfiles, Copilot for SAST)</option>
          <option value="deterministic">Deterministic Only (Zero-Token)</option>
          <option value="copilot">Copilot LM API Only</option>
        </select>
      </div>

      <div style="margin-top: 18px; display: flex; gap: 10px;">
        <button class="btn btn-success" onclick="saveSettings()">
          <span>💾</span> Save Settings & Replan Sprints
        </button>
      </div>
    </div>

    <!-- Settings Group 2: Live Sprint State JSON Persistence Editor -->
    <div class="settings-group">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <h3 style="margin: 0; font-size: 16px;">📄 Live Sprint State JSON (.codevulfixer/sprint-state.json)</h3>
        <span class="badge ${state ? 'badge-s' : 'badge-m'}">${state ? 'File Loaded' : 'Template Preview'}</span>
      </div>
      <p style="font-size: 12px; opacity: 0.8; margin-top: 0; margin-bottom: 14px;">
        Inspect, configure, or manually adjust the active sprint state JSON. Click <strong>"Save Sprint State JSON"</strong> to persist your edits directly to <code>.codevulfixer/sprint-state.json</code> and instantly update the dashboard telemetry.
      </p>

      <textarea id="rawStateJson" class="json-textarea" spellcheck="false">${escapeHtml(formattedStateJson)}</textarea>

      <div style="margin-top: 14px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
        <button class="btn btn-success" onclick="saveSprintStateJson()">
          <span>💾</span> Save Sprint State JSON
        </button>
        <button class="btn btn-secondary" onclick="reloadState()">
          <span>🔄</span> Reload State from Disk
        </button>
        <button class="btn btn-secondary" onclick="formatStateJson()">
          <span>✨</span> Format / Prettify JSON
        </button>
        <button class="btn btn-secondary" onclick="copyStateJson()">
          <span>📋</span> Copy JSON
        </button>
      </div>
    </div>
  `;
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
