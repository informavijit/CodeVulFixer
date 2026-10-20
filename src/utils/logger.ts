import * as vscode from 'vscode';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  details?: string;
  suggestedFix?: string;
  commandExecuted?: string;
}

export class Logger {
  private static instance: Logger;
  private channel: vscode.OutputChannel;
  private entries: LogEntry[] = [];
  private readonly MAX_ENTRIES = 500;

  private constructor() {
    this.channel = vscode.window.createOutputChannel('CodeVulFixer');
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public getEntries(): LogEntry[] {
    return [...this.entries];
  }

  public clear(): void {
    this.entries = [];
    if (typeof this.channel.clear === 'function') {
      this.channel.clear();
    }
  }

  private addEntry(
    level: LogLevel,
    message: string,
    details?: string,
    suggestedFix?: string,
    commandExecuted?: string
  ): LogEntry {
    const entry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      level,
      message,
      details,
      suggestedFix,
      commandExecuted,
    };
    this.entries.push(entry);
    if (this.entries.length > this.MAX_ENTRIES) {
      this.entries.shift();
    }
    return entry;
  }

  public log(message: string, prefix: LogLevel = 'INFO'): void {
    const entry = this.addEntry(prefix, message);
    this.channel.appendLine(`[${entry.timestamp}] [${prefix}] ${message}`);
  }

  public info(message: string): void {
    this.log(message, 'INFO');
  }

  public warn(message: string, suggestedFix?: string): void {
    const entry = this.addEntry('WARN', message, undefined, suggestedFix);
    this.channel.appendLine(
      `[${entry.timestamp}] [WARN] ${message}${suggestedFix ? ` (Suggested Remedy: ${suggestedFix})` : ''}`
    );
  }

  public error(
    message: string,
    error?: unknown,
    suggestedFix?: string,
    commandExecuted?: string
  ): void {
    const errDetails =
      error instanceof Error
        ? `${error.message}\n${error.stack ?? ''}`
        : error
        ? String(error)
        : undefined;
    const entry = this.addEntry('ERROR', message, errDetails, suggestedFix, commandExecuted);
    this.channel.appendLine(
      `[${entry.timestamp}] [ERROR] ${message}${errDetails ? ` - ${errDetails}` : ''}${
        suggestedFix ? `\n[SUGGESTED FIX] ${suggestedFix}` : ''
      }`
    );
  }

  public success(message: string): void {
    const entry = this.addEntry('SUCCESS', message);
    this.channel.appendLine(`[${entry.timestamp}] [SUCCESS] ✔ ${message}`);
  }

  public diagnostic(
    level: LogLevel,
    message: string,
    details?: string,
    suggestedFix?: string,
    commandExecuted?: string
  ): void {
    const entry = this.addEntry(level, message, details, suggestedFix, commandExecuted);
    this.channel.appendLine(`[${entry.timestamp}] [${level}] ${message}`);
    if (details) this.channel.appendLine(`  Details: ${details}`);
    if (suggestedFix) this.channel.appendLine(`  Suggested Fix: ${suggestedFix}`);
  }

  public show(): void {
    this.channel.show(true);
  }

  public appendRaw(text: string): void {
    this.channel.append(text);
  }
}

export const logger = Logger.getInstance();

