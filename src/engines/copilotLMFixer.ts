import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { VulnerabilityFinding } from '../ingestion/types';
import { FixExecutionResult } from './deterministicFixer';
import { logger } from '../utils/logger';

export class CopilotLMFixer {
  /**
   * Applies an AI-assisted fix using the native VS Code Language Model API (vscode.lm).
   * Leverages the user's active GitHub Copilot instance.
   */
  public static async applyFix(
    workspaceRoot: string,
    finding: VulnerabilityFinding
  ): Promise<FixExecutionResult> {
    logger.info(`[CopilotLMFixer] Initiating VS Code LM fix for ${finding.id}: ${finding.title}`);

    // 1. Select Copilot chat model
    let models: vscode.LanguageModelChat[] = [];
    try {
      models = await vscode.lm.selectChatModels({ vendor: 'copilot' });
      if (!models || models.length === 0) {
        // Fallback to any active language model registered in the editor
        models = await vscode.lm.selectChatModels();
      }
    } catch (err) {
      logger.warn(`Error selecting chat models via vscode.lm: ${err}`);
    }

    if (!models || models.length === 0) {
      return {
        success: false,
        engine: 'copilot',
        message: 'No active Copilot Language Model found. Please ensure GitHub Copilot is installed and active in VS Code, or switch to Deterministic fix mode.',
        modifiedFiles: [],
      };
    }

    const model = models[0];
    logger.info(`[CopilotLMFixer] Using model: ${model.name} (${model.id})`);

    // 2. Resolve target file and snippet
    const loc = finding.location;
    let filePath = '';
    let fileContent = '';
    let targetSnippet = loc?.snippet || '';

    if (loc?.filePath) {
      filePath = path.isAbsolute(loc.filePath)
        ? loc.filePath
        : path.join(workspaceRoot, loc.filePath);

      if (fs.existsSync(filePath)) {
        fileContent = fs.readFileSync(filePath, 'utf8');
      } else if (loc.snippet) {
        // Create demo target file so user can test Copilot fix
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(filePath, `// Target: ${loc.filePath}\n${loc.snippet}\n`, 'utf8');
        fileContent = fs.readFileSync(filePath, 'utf8');
      }
    }

    // 3. Construct structured security prompt
    const prompt = this.buildPrompt(finding, fileContent, targetSnippet);

    const messages = [
      vscode.LanguageModelChatMessage.User(
        'You are a Principal Security Architect and CodeQL Remediator. Fix the following vulnerability strictly and cleanly. Return ONLY the complete updated file or replacement code inside a ```ts code block. Do NOT include extraneous markdown explanations.'
      ),
      vscode.LanguageModelChatMessage.User(prompt),
    ];

    try {
      const cts = new vscode.CancellationTokenSource();
      const anyModel = model as any;
      const chatResponse = anyModel.sendRequest
        ? await anyModel.sendRequest(messages, {}, cts.token)
        : await anyModel.sendChatRequest(messages, {}, cts.token);

      let responseText = '';
      for await (const fragment of chatResponse.text) {
        responseText += fragment;
      }

      logger.info(`[CopilotLMFixer] Received response (${responseText.length} chars) from ${model.name}`);

      // 4. Extract code block from AI response
      const extractedCode = this.extractCode(responseText);
      if (!extractedCode) {
        return {
          success: false,
          engine: 'copilot',
          message: 'Could not extract clean code replacement from Copilot LM response.',
          stdout: responseText,
          modifiedFiles: [],
        };
      }

      // 5. Apply code to workspace
      if (filePath) {
        fs.writeFileSync(filePath, extractedCode, 'utf8');
        logger.success(`[CopilotLMFixer] Successfully updated ${loc?.filePath} with Copilot LM remediation`);
        return {
          success: true,
          engine: 'copilot',
          message: `Remediated by Copilot LM (${model.name}): ${finding.title}`,
          stdout: responseText,
          modifiedFiles: [loc?.filePath || 'remediated_code.ts'],
        };
      } else {
        return {
          success: true,
          engine: 'copilot',
          message: 'Generated remediation patch with Copilot LM.',
          stdout: extractedCode,
          modifiedFiles: [],
        };
      }
    } catch (error: any) {
      logger.error('Copilot LM fix execution failed', error);
      return {
        success: false,
        engine: 'copilot',
        message: `Copilot LM request failed: ${error.message || String(error)}`,
        stderr: String(error),
        modifiedFiles: [],
      };
    }
  }

  private static buildPrompt(
    finding: VulnerabilityFinding,
    fileContent: string,
    snippet: string
  ): string {
    return `
VULNERABILITY DETAILS:
- Title: ${finding.title}
- Severity: ${finding.severity.toUpperCase()}
- Rule ID: ${finding.ruleId || 'N/A'}
- CWE IDs: ${(finding.cweIds || []).join(', ') || 'N/A'}
- Advisory: ${finding.cveId || finding.ghsaId || 'N/A'}
- Description: ${finding.description}
- Remediation Guideline: ${finding.remediationPlan}

TARGET LOCATION:
- File: ${finding.location?.filePath || 'Unknown'}
- Lines: ${finding.location?.startLine ?? 1} to ${finding.location?.endLine ?? 1}

VULNERABLE SNIPPET:
\`\`\`
${snippet || fileContent.slice(0, 500)}
\`\`\`

COMPLETE EXISTING FILE CONTENT:
\`\`\`
${fileContent || snippet}
\`\`\`

INSTRUCTIONS:
1. Provide the complete remediated file code that securely eliminates the vulnerability.
2. Maintain existing styles, imports, and functionality.
3. Eliminate injection, taint flow, or insecure APIs completely using industry standard safe APIs.
4. Output ONLY the code inside a single markdown code block:
\`\`\`
// code here
\`\`\`
`;
  }

  private static extractCode(raw: string): string | undefined {
    // Look for markdown code fence
    const match = raw.match(/```(?:[a-zA-Z0-9_-]+)?\s*([\s\S]*?)```/);
    if (match && match[1]) {
      return match[1].trim();
    }

    // If no code fence, check if it starts with valid code
    if (raw.includes('import ') || raw.includes('const ') || raw.includes('function ') || raw.includes('export ')) {
      return raw.trim();
    }

    return undefined;
  }
}
