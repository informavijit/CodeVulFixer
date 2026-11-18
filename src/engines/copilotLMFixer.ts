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
    finding: VulnerabilityFinding,
    failureFeedback?: string
  ): Promise<FixExecutionResult> {
    logger.info(`[CopilotLMFixer] Initiating VS Code LM fix for ${finding.id}: ${finding.title}${failureFeedback ? ' (Self-Healing Loop with Failure Feedback)' : ''}`);

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
    let targetLang = 'code';

    if (finding.source === 'dependabot' && finding.dependency) {
      const dep = finding.dependency;
      const manifestName =
        dep.manifestFile ||
        (dep.ecosystem === 'maven' ? 'pom.xml' : dep.ecosystem === 'pip' ? 'requirements.txt' : 'package.json');

      filePath = path.isAbsolute(manifestName)
        ? manifestName
        : path.join(workspaceRoot, manifestName);

      if (fs.existsSync(filePath)) {
        fileContent = fs.readFileSync(filePath, 'utf8');
      } else {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        if (manifestName.endsWith('pom.xml')) {
          const parts = dep.packageName.split(':');
          fileContent = `<project>\n  <modelVersion>4.0.0</modelVersion>\n  <groupId>com.example</groupId>\n  <artifactId>app</artifactId>\n  <version>1.0.0</version>\n  <dependencies>\n    <dependency>\n      <groupId>${parts[0] || 'org.example'}</groupId>\n      <artifactId>${parts[1] || dep.packageName}</artifactId>\n      <version>${dep.currentVersion}</version>\n    </dependency>\n  </dependencies>\n</project>\n`;
        } else if (manifestName.endsWith('requirements.txt')) {
          fileContent = `${dep.packageName}==${dep.currentVersion}\n`;
        } else {
          fileContent = JSON.stringify({ dependencies: { [dep.packageName]: dep.currentVersion } }, null, 2);
        }
        fs.writeFileSync(filePath, fileContent, 'utf8');
      }

      targetSnippet = `${dep.packageName}: ${dep.currentVersion} ➔ ${dep.fixedVersion}`;
      targetLang = filePath.endsWith('.xml') ? 'xml' : filePath.endsWith('.json') ? 'json' : filePath.endsWith('.txt') ? 'plaintext' : 'code';
    } else if (loc?.filePath) {
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

      const ext = path.extname(loc?.filePath || '').toLowerCase();
      const langMap: Record<string, string> = {
        '.cpp': 'cpp',
        '.c': 'c',
        '.h': 'cpp',
        '.hpp': 'cpp',
        '.cs': 'csharp',
        '.java': 'java',
        '.pas': 'pascal',
        '.dpr': 'pascal',
        '.ps1': 'powershell',
        '.psm1': 'powershell',
        '.py': 'python',
        '.go': 'go',
        '.rs': 'rust',
        '.ts': 'typescript',
        '.js': 'javascript',
      };
      targetLang = langMap[ext] || 'code';
    }

    // 3. Construct structured security prompt
    const prompt = this.buildPrompt(finding, fileContent, targetSnippet, targetLang, filePath, failureFeedback);

    const messages = [
      vscode.LanguageModelChatMessage.User(
        `You are a Principal Security Architect and CodeQL Remediator specializing in ${targetLang.toUpperCase()} and enterprise software architecture. Fix the following vulnerability strictly and cleanly. Return ONLY the complete updated file or replacement code inside a \`\`\`${targetLang} code block. Do NOT include extraneous markdown explanations.`
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
        const targetDesc = loc?.filePath || path.basename(filePath);
        logger.success(`[CopilotLMFixer] Successfully updated ${targetDesc} with Copilot LM remediation`);
        return {
          success: true,
          engine: 'copilot',
          message: `Remediated by Copilot LM (${model.name}): ${finding.title}`,
          stdout: responseText,
          modifiedFiles: [loc?.filePath || path.basename(filePath) || 'remediated_code.ts'],
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
    snippet: string,
    targetLang: string = 'code',
    filePath: string = '',
    failureFeedback?: string
  ): string {
    const feedbackBlock = failureFeedback ? `
⚠️ PREVIOUS ATTEMPT FAILURE / DIAGNOSTIC FEEDBACK:
The prior fix attempt failed automated build/test verification with the following diagnostics:
\`\`\`
${failureFeedback}
\`\`\`
CRITICAL SELF-HEALING INSTRUCTIONS:
Analyze the error above carefully. Fix whatever caused this failure (e.g. syntax error, missing import, compiler incompatibility, broken test assertion, or invalid version). Ensure the revised code resolves the vulnerability AND compiles/passes tests cleanly.
` : '';

    if (finding.source === 'dependabot' && finding.dependency) {
      const dep = finding.dependency;
      const targetVer = finding.compatibilityAdvice?.safeRecommendedVersion || dep.fixedVersion;
      return `
VULNERABILITY DETAILS (DEPENDENCY UPGRADE):
- Advisory: ${finding.title}
- Severity: ${finding.severity.toUpperCase()}
- Vulnerability ID: ${finding.cveId || finding.ghsaId || finding.id}
- Package Name: ${dep.packageName}
- Ecosystem: ${dep.ecosystem.toUpperCase()}
- Current Version: ${dep.currentVersion}
- Target Safe Version: ${targetVer}
- Target Manifest File: ${path.basename(filePath)}
${finding.compatibilityAdvice ? `- Compatibility Constraint: ${finding.compatibilityAdvice.constraintSummary}\n- Remediation Strategy: ${finding.compatibilityAdvice.tradeoffReason}` : ''}
${feedbackBlock}

EXISTING MANIFEST CONTENT (${path.basename(filePath)}):
\`\`\`${targetLang}
${fileContent || snippet}
\`\`\`

INSTRUCTIONS:
1. Upgrade package "${dep.packageName}" to safe version "${targetVer}".
2. Ensure valid syntax for ${targetLang.toUpperCase()} and keep all other dependencies intact.
3. Output ONLY the complete updated file content inside a single markdown code block:
\`\`\`${targetLang}
// full updated manifest code
\`\`\`
`;
    }

    return `
VULNERABILITY DETAILS:
- Title: ${finding.title}
- Severity: ${finding.severity.toUpperCase()}
- Rule ID: ${finding.ruleId || 'N/A'}
- CWE IDs: ${(finding.cweIds || []).join(', ') || 'N/A'}
- Advisory: ${finding.cveId || finding.ghsaId || 'N/A'}
- Description: ${finding.description}
- Remediation Guideline: ${finding.remediationPlan}
- Target Technology / Language: ${targetLang.toUpperCase()}

TARGET LOCATION:
- File: ${finding.location?.filePath || filePath || 'Unknown'}
- Lines: ${finding.location?.startLine ?? 1} to ${finding.location?.endLine ?? 1}
${feedbackBlock}

VULNERABLE SNIPPET:
\`\`\`
${snippet || fileContent.slice(0, 500)}
\`\`\`

COMPLETE EXISTING FILE CONTENT:
\`\`\`
${fileContent || snippet}
\`\`\`

INSTRUCTIONS FOR ${targetLang.toUpperCase()}:
1. Provide the complete remediated file code that securely eliminates the vulnerability.
2. Maintain existing styles, imports, namespaces, and functionality.
3. Eliminate memory corruption, injection, taint flow, or insecure APIs completely using standard safe modern ${targetLang.toUpperCase()} constructs.
4. Output ONLY the code inside a single markdown code block:
\`\`\`${targetLang}
// remediated code here
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
