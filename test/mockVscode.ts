export const workspace = {
  workspaceFolders: undefined,
  getConfiguration: (_section?: string) => ({
    get: (_key: string, defaultValue: any) => defaultValue,
    update: async () => {},
  }),
};

export const window = {
  createOutputChannel: (_name: string) => ({
    appendLine: (msg: string) => console.log(`[OutputChannel] ${msg}`),
    append: (msg: string) => process.stdout.write(msg),
    show: () => {},
  }),
  showInformationMessage: async () => {},
  showWarningMessage: async () => {},
  showErrorMessage: async () => {},
  withProgress: async (_opts: any, task: any) => {
    return task({ report: () => {} });
  },
};

export const commands = {
  registerCommand: () => ({ dispose: () => {} }),
  executeCommand: async () => {},
};

export const authentication = {
  getSession: async () => undefined,
};

export class CancellationTokenSource {
  public token = {};
  public cancel() {}
  public dispose() {}
}

export const LanguageModelChatMessage = {
  User: (content: string) => ({ role: 'user', content }),
  Assistant: (content: string) => ({ role: 'assistant', content }),
};

export const lm = {
  selectChatModels: async () => [],
};
