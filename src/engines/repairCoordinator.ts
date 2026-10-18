import * as vscode from 'vscode';
import { VulnerabilityFinding } from '../ingestion/types';
import { DeterministicFixer, FixExecutionResult } from './deterministicFixer';
import { CopilotLMFixer } from './copilotLMFixer';
import { PRECOMPILED_AST_RULES } from './astGrepRules';
import { logger } from '../utils/logger';

export class RepairCoordinator {
  /**
   * Executes the appropriate repair engine based on finding characteristics and preferences.
   */
  public static async executeRepair(
    workspaceRoot: string,
    finding: VulnerabilityFinding,
    engineOverride?: 'auto' | 'deterministic' | 'copilot'
  ): Promise<FixExecutionResult> {
    const config = vscode.workspace.getConfiguration('codevulfixer');
    const preferredEngine = engineOverride || config.get<string>('preferredFixEngine', 'auto');

    logger.info(`[RepairCoordinator] Deciding engine for ${finding.id} (preference: ${preferredEngine})...`);

    if (preferredEngine === 'deterministic') {
      return DeterministicFixer.applyFix(workspaceRoot, finding);
    }

    if (preferredEngine === 'copilot') {
      const copilotResult = await CopilotLMFixer.applyFix(workspaceRoot, finding);
      if (copilotResult.success) {
        return copilotResult;
      }
      logger.warn(`Copilot LM repair failed or unavailable: ${copilotResult.message}. Falling back to deterministic engine.`);
      return DeterministicFixer.applyFix(workspaceRoot, finding);
    }

    // 'auto' mode:
    if (finding.source === 'dependabot') {
      // Deterministic is fastest, zero-token, exact for lockfiles
      return DeterministicFixer.applyFix(workspaceRoot, finding);
    }

    // For Code Scanning:
    const hasAstRule = PRECOMPILED_AST_RULES.some(
      (r) =>
        r.ruleId === finding.ruleId ||
        (finding.cweIds && finding.cweIds.includes(r.cwe))
    );

    if (hasAstRule && finding.sizing.size === 'S') {
      logger.info(`[RepairCoordinator] Choosing Deterministic AST engine for self-contained rule: ${finding.ruleId}`);
      const astResult = await DeterministicFixer.applyFix(workspaceRoot, finding);
      if (astResult.success) return astResult;
    }

    // Try Copilot LM for non-trivial or complex findings
    logger.info(`[RepairCoordinator] Choosing Copilot LM engine for ${finding.id}`);
    const aiResult = await CopilotLMFixer.applyFix(workspaceRoot, finding);
    if (aiResult.success) {
      return aiResult;
    }

    // Fallback to deterministic
    logger.info(`Copilot LM fallback to deterministic engine for ${finding.id}`);
    return DeterministicFixer.applyFix(workspaceRoot, finding);
  }
}
