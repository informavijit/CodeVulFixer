import * as vscode from 'vscode';
import { VulnerabilityFinding } from '../ingestion/types';
import { DeterministicFixer, FixExecutionResult } from './deterministicFixer';
import { CopilotLMFixer } from './copilotLMFixer';
import { PRECOMPILED_AST_RULES } from './astGrepRules';
import { LearnedPatternEngine } from './learnedPatternEngine';
import { logger } from '../utils/logger';

export class RepairCoordinator {
  /**
   * Executes the appropriate repair engine based on finding characteristics,
   * checking repo-level learned patterns first to avoid unnecessary AI token consumption.
   */
  public static async executeRepair(
    workspaceRoot: string,
    finding: VulnerabilityFinding,
    engineOverride?: 'auto' | 'deterministic' | 'copilot'
  ): Promise<FixExecutionResult> {
    const config = vscode.workspace.getConfiguration('codevulfixer');
    const preferredEngine = engineOverride || config.get<string>('preferredFixEngine', 'auto');

    logger.info(`[RepairCoordinator] Deciding engine for ${finding.id} (preference: ${preferredEngine})...`);

    // 1. Check if a repository-level learned fix pattern already exists for this finding!
    // If learned, execute deterministically with 0 AI Tokens!
    if (preferredEngine !== 'copilot') {
      const learnedPattern = await LearnedPatternEngine.findMatchingPattern(workspaceRoot, finding);
      if (learnedPattern) {
        logger.info(
          `[RepairCoordinator] Found learned pattern "${learnedPattern.name}" for ${finding.id}. Applying Zero-Token Deterministic Fix instead of calling AI!`
        );
        const result = await LearnedPatternEngine.applyLearnedPattern(workspaceRoot, finding, learnedPattern);
        if (result.success) {
          return {
            ...result,
            message: `⚡ Zero-Token Learned Fix: ${result.message} (0 AI Tokens Consumed)`,
          };
        }
      }
    }

    if (preferredEngine === 'deterministic') {
      return DeterministicFixer.applyFix(workspaceRoot, finding);
    }

    if (preferredEngine === 'copilot') {
      const copilotResult = await CopilotLMFixer.applyFix(workspaceRoot, finding);
      if (copilotResult.success) {
        // Learn from successful AI fix so subsequent similar findings don't need AI
        await LearnedPatternEngine.learnFromFix(workspaceRoot, finding, copilotResult.stdout, 'copilot');
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

    // For Code Scanning: Check precompiled AST rules
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
      // Approach 2: Extract & learn pattern for repository knowledge base
      await LearnedPatternEngine.learnFromFix(workspaceRoot, finding, aiResult.stdout, 'copilot');
      return aiResult;
    }

    // Fallback to deterministic
    logger.info(`Copilot LM fallback to deterministic engine for ${finding.id}`);
    return DeterministicFixer.applyFix(workspaceRoot, finding);
  }
}
