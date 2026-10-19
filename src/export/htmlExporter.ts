import { SprintState } from '../ingestion/types';
import { getDashboardHtml } from '../webview/htmlTemplate';

/**
 * Standalone HTML Exporter for CodeVulFixer Dashboard
 * Produces a self-contained, offline-compatible HTML report matching the exact
 * dark-mode aesthetics, metrics, badges, sprint board, and tabs of the extension webview.
 * Opens seamlessly in any modern browser for sharing with stakeholders, auditors, and leadership.
 */
export class HtmlExporter {
  public static generateHtmlReport(state: SprintState): string {
    const rawHtml = getDashboardHtml(state, 'risk-profile');

    // Add standalone offline indicator banner right after <body>
    const offlineNotice = `
  <div style="background: linear-gradient(90deg, #1f2428, #161b22); border-bottom: 1px solid #30363d; padding: 8px 24px; font-size: 12px; color: #8b949e; display: flex; justify-content: space-between; align-items: center;">
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #2ea043;"></span>
      <strong style="color: #c9d1d9;">Standalone Executive Report</strong>
      <span>• Repository: <code style="color: #58a6ff;">${escapeHtml(state.repoOwner)}/${escapeHtml(state.repoName)}</code></span>
      <span>• Cadence: <code style="color: #79c0ff;">${escapeHtml(state.planningMode)} (${state.daysPerSprint || 10} Days/Sprint)</code></span>
    </div>
    <div style="font-size: 11px;">
      Exported via CodeVulFixer v1.0.5 • ${new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
    </div>
  </div>
`;

    return rawHtml.replace('<body>', '<body>\n' + offlineNotice);
  }
}

function escapeHtml(text?: string): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
