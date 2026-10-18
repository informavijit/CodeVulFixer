import * as vscode from 'vscode';
import { DashboardPanel } from './webview/dashboardPanel';
import { CodeVulFixerSidebarProvider } from './webview/sidebarProvider';
import { GitResolver } from './ingestion/gitResolver';
import { StateStore } from './sprint/stateStore';
import { logger } from './utils/logger';

export function activate(context: vscode.ExtensionContext) {
  logger.info('Activating CodeVulFixer Extension...');

  // 1. Register Sidebar Webview Provider
  const sidebarProvider = new CodeVulFixerSidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      CodeVulFixerSidebarProvider.viewType,
      sidebarProvider
    )
  );

  // 2. Register command: Open Dashboard
  context.subscriptions.push(
    vscode.commands.registerCommand('codevulfixer.openDashboard', () => {
      logger.info('Command: codevulfixer.openDashboard executed.');
      DashboardPanel.createOrShow(context.extensionUri);
    })
  );

  // 3. Register command: Scan & Ingest
  context.subscriptions.push(
    vscode.commands.registerCommand('codevulfixer.scan', async () => {
      logger.info('Command: codevulfixer.scan executed.');
      const workspaceRoot = GitResolver.getPrimaryWorkspacePath();
      if (!workspaceRoot) {
        vscode.window.showErrorMessage('CodeVulFixer: Please open a workspace folder before scanning.');
        return;
      }

      const panel = DashboardPanel.createOrShow(context.extensionUri);
      await panel.performScan(workspaceRoot);
      sidebarProvider.refresh();
    })
  );

  // 4. Register command: Load Demo Data
  context.subscriptions.push(
    vscode.commands.registerCommand('codevulfixer.loadDemoData', async () => {
      logger.info('Command: codevulfixer.loadDemoData executed.');
      const workspaceRoot = GitResolver.getPrimaryWorkspacePath();
      if (!workspaceRoot) {
        vscode.window.showErrorMessage('CodeVulFixer: Please open a workspace folder first.');
        return;
      }

      const panel = DashboardPanel.createOrShow(context.extensionUri);
      await panel.loadDemoFindings(workspaceRoot);
      sidebarProvider.refresh();
    })
  );

  // 5. Register command: Run Current Sprint
  context.subscriptions.push(
    vscode.commands.registerCommand('codevulfixer.runSprint', async () => {
      logger.info('Command: codevulfixer.runSprint executed.');
      const workspaceRoot = GitResolver.getPrimaryWorkspacePath();
      if (!workspaceRoot) return;

      const state = await StateStore.loadState(workspaceRoot);
      if (!state) {
        const choice = await vscode.window.showWarningMessage(
          'No active sprint plan found. Ingest vulnerabilities first?',
          'Scan Workspace',
          'Load Demo Findings'
        );
        if (choice === 'Scan Workspace') {
          await vscode.commands.executeCommand('codevulfixer.scan');
        } else if (choice === 'Load Demo Findings') {
          await vscode.commands.executeCommand('codevulfixer.loadDemoData');
        }
        return;
      }

      const panel = DashboardPanel.createOrShow(context.extensionUri);
      // Execute active sprint
      vscode.commands.executeCommand('codevulfixer.openDashboard');
      sidebarProvider.refresh();
    })
  );

  // 6. Register command: Reset State
  context.subscriptions.push(
    vscode.commands.registerCommand('codevulfixer.resetState', async () => {
      logger.info('Command: codevulfixer.resetState executed.');
      const workspaceRoot = GitResolver.getPrimaryWorkspacePath();
      if (workspaceRoot) {
        await StateStore.resetState(workspaceRoot);
        if (DashboardPanel.currentPanel) {
          await DashboardPanel.currentPanel.update();
        }
        sidebarProvider.refresh();
        vscode.window.showInformationMessage('CodeVulFixer: Sprint state has been reset.');
      }
    })
  );

  logger.success('CodeVulFixer successfully activated and initialized.');
}

export function deactivate() {
  logger.info('Deactivating CodeVulFixer Extension.');
}
