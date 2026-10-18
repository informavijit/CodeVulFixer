import * as vscode from 'vscode';

export class Logger {
  private static instance: Logger;
  private channel: vscode.OutputChannel;

  private constructor() {
    this.channel = vscode.window.createOutputChannel('CodeVulFixer');
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public log(message: string, prefix = 'INFO'): void {
    const timestamp = new Date().toISOString();
    this.channel.appendLine(`[${timestamp}] [${prefix}] ${message}`);
  }

  public info(message: string): void {
    this.log(message, 'INFO');
  }

  public warn(message: string): void {
    this.log(message, 'WARN');
  }

  public error(message: string, error?: unknown): void {
    const errDetails = error instanceof Error ? ` - ${error.message}\n${error.stack ?? ''}` : (error ? ` - ${JSON.stringify(error)}` : '');
    this.log(`${message}${errDetails}`, 'ERROR');
  }

  public success(message: string): void {
    this.log(`✔ ${message}`, 'SUCCESS');
  }

  public show(): void {
    this.channel.show(true);
  }

  public appendRaw(text: string): void {
    this.channel.append(text);
  }
}

export const logger = Logger.getInstance();
