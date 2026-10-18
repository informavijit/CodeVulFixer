import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as Diff from 'diff';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);

export interface DiffLine {
  type: 'add' | 'delete' | 'normal';
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export interface FileDiff {
  filePath: string;
  hasChanges: boolean;
  rawDiff: string;
  lines: DiffLine[];
}

export class DiffEngine {
  /**
   * Generates a line-by-line diff for specified files in the workspace.
   */
  public static async getFileDiff(
    workspaceRoot: string,
    relativeFilePath: string
  ): Promise<FileDiff> {
    try {
      // 1. Try Git diff first
      const { stdout } = await execAsync(`git diff --no-color -U3 -- "${relativeFilePath}"`, {
        cwd: workspaceRoot,
      });

      if (stdout.trim().length > 0) {
        return {
          filePath: relativeFilePath,
          hasChanges: true,
          rawDiff: stdout,
          lines: this.parseUnifiedDiff(stdout),
        };
      }
    } catch {
      // Ignore git diff error, fallback to JS diff
    }

    // Fallback: If not committed to git yet or untracked
    const fullPath = path.isAbsolute(relativeFilePath)
      ? relativeFilePath
      : path.join(workspaceRoot, relativeFilePath);

    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines: DiffLine[] = content.split(/\r?\n/).map((l, i) => ({
        type: 'add',
        content: l,
        newLineNumber: i + 1,
      }));

      return {
        filePath: relativeFilePath,
        hasChanges: true,
        rawDiff: content,
        lines,
      };
    }

    return {
      filePath: relativeFilePath,
      hasChanges: false,
      rawDiff: '',
      lines: [],
    };
  }

  /**
   * Generates a combined diff report for multiple files.
   */
  public static async getMultiFileDiff(
    workspaceRoot: string,
    filePaths: string[]
  ): Promise<FileDiff[]> {
    const results: FileDiff[] = [];
    for (const f of filePaths) {
      results.push(await this.getFileDiff(workspaceRoot, f));
    }
    return results;
  }

  private static parseUnifiedDiff(diffText: string): DiffLine[] {
    const lines = diffText.split(/\r?\n/);
    const parsed: DiffLine[] = [];
    let oldNum = 0;
    let newNum = 0;

    for (const line of lines) {
      if (line.startsWith('@@')) {
        const match = line.match(/@@\s*-(\d+)(?:,\d+)?\s*\+(\d+)(?:,\d+)?\s*@@/);
        if (match) {
          oldNum = parseInt(match[1], 10);
          newNum = parseInt(match[2], 10);
        }
        parsed.push({ type: 'normal', content: line });
      } else if (line.startsWith('+') && !line.startsWith('+++')) {
        parsed.push({
          type: 'add',
          content: line.substring(1),
          newLineNumber: newNum++,
        });
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        parsed.push({
          type: 'delete',
          content: line.substring(1),
          oldLineNumber: oldNum++,
        });
      } else if (line.startsWith(' ')) {
        parsed.push({
          type: 'normal',
          content: line.substring(1),
          oldLineNumber: oldNum++,
          newLineNumber: newNum++,
        });
      }
    }

    return parsed;
  }
}
