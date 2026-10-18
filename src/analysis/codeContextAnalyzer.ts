import * as fs from 'fs';
import * as path from 'path';
import { CodeLocation } from '../ingestion/types';
import { logger } from '../utils/logger';

export interface CodeContextReport {
  fileExists: boolean;
  fileLinesCount: number;
  snippet?: string;
  isSelfContained: boolean;
  taintComplexity: 'simple' | 'moderate' | 'complex';
  surroundingContext?: string;
}

export class CodeContextAnalyzer {
  private static readonly COMPLEX_CWES = new Set([
    'CWE-89', // SQL Injection
    'CWE-78', // OS Command Injection
    'CWE-94', // Code Injection
    'CWE-502', // Insecure Deserialization
    'CWE-287', // Improper Authentication
    'CWE-327', // Use of Broken Cryptographic Algorithm
    'CWE-918', // SSRF
  ]);

  private static readonly SIMPLE_CWES = new Set([
    'CWE-79', // DOM-based XSS (simple element assignment)
    'CWE-330', // Insecure PRNG (Math.random)
    'CWE-1333', // ReDoS
    'CWE-400', // Uncontrolled Resource Consumption (local header or timeout)
  ]);

  public static async analyze(
    workspaceRoot: string,
    location?: CodeLocation,
    cweIds: string[] = [],
    ruleId?: string
  ): Promise<CodeContextReport> {
    if (!location || !location.filePath) {
      return {
        fileExists: false,
        fileLinesCount: 0,
        isSelfContained: true,
        taintComplexity: 'moderate',
      };
    }

    const fullPath = path.isAbsolute(location.filePath)
      ? location.filePath
      : path.join(workspaceRoot, location.filePath);

    if (!fs.existsSync(fullPath)) {
      return {
        fileExists: false,
        fileLinesCount: 0,
        snippet: location.snippet,
        isSelfContained: false,
        taintComplexity: this.determineComplexity(cweIds, ruleId),
      };
    }

    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split(/\r?\n/);
      const start = Math.max(0, location.startLine - 1);
      const end = Math.min(lines.length, location.endLine);

      // Extract relevant snippet
      const targetSnippet = lines.slice(start, end).join('\n');

      // Extract surrounding context (5 lines before and after)
      const contextStart = Math.max(0, start - 5);
      const contextEnd = Math.min(lines.length, end + 5);
      const surroundingContext = lines.slice(contextStart, contextEnd).join('\n');

      // Check if self-contained (heuristic: snippet length < 10 lines and file < 500 lines)
      const isSelfContained = (end - start) <= 8 && lines.length < 500;
      const taintComplexity = this.determineComplexity(cweIds, ruleId);

      return {
        fileExists: true,
        fileLinesCount: lines.length,
        snippet: targetSnippet || location.snippet,
        surroundingContext,
        isSelfContained,
        taintComplexity,
      };
    } catch (error) {
      logger.warn(`Could not read code context for ${fullPath}: ${error}`);
      return {
        fileExists: false,
        fileLinesCount: 0,
        snippet: location.snippet,
        isSelfContained: true,
        taintComplexity: this.determineComplexity(cweIds, ruleId),
      };
    }
  }

  private static determineComplexity(
    cweIds: string[],
    ruleId?: string
  ): 'simple' | 'moderate' | 'complex' {
    for (const cwe of cweIds) {
      if (this.COMPLEX_CWES.has(cwe)) return 'complex';
      if (this.SIMPLE_CWES.has(cwe)) return 'simple';
    }

    if (ruleId) {
      const r = ruleId.toLowerCase();
      if (r.includes('sql') || r.includes('command') || r.includes('rce') || r.includes('crypto')) {
        return 'complex';
      }
      if (r.includes('random') || r.includes('xss') || r.includes('redos')) {
        return 'simple';
      }
    }

    return 'moderate';
  }
}
