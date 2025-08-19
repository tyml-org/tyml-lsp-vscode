import * as path from 'path';
import {
  LanguageClient, LanguageClientOptions, ServerOptions, TransportKind
} from 'vscode-languageclient/node';
import * as vscode from 'vscode';

let client: LanguageClient;
export async function activate(context: vscode.ExtensionContext) {
  var serverExe;
  if (process.platform === "win32") {
    serverExe = context.asAbsolutePath(path.join('server', "tyml-lsp-server-windows-x86_64.exe"));
  } else if (process.platform === "darwin") {
    serverExe = context.asAbsolutePath(path.join('server', "tyml-lsp-server-macos-aarch64"));
  } else {
    serverExe = context.asAbsolutePath(path.join('server', "tyml-lsp-server-linux-x86_64"));
  }

  const serverOptions: ServerOptions = {
    run: { command: serverExe, transport: TransportKind.stdio },
    debug: { command: serverExe, transport: TransportKind.stdio }
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'tyml' }],
    initializationOptions: {}
  };

  var mockExe: string;
  if (process.platform === "win32") {
    mockExe = context.asAbsolutePath(path.join('mock', "tyml-mock-windows-x86_64.exe"));
  } else if (process.platform === "darwin") {
    mockExe = context.asAbsolutePath(path.join('mock', "tyml-mock-macos-aarch64"));
  } else {
    mockExe = context.asAbsolutePath(path.join('mock', "tyml-mock-linux-x86_64"));
  }

  let terminal: vscode.Terminal | null = null;
  context.subscriptions.push(
    vscode.commands.registerCommand("tyml.mock.serve", async (filePath: string, interfaceName: string) => {
      if (terminal) {
        terminal.dispose();
      }

      terminal = vscode.window.createTerminal("TYML Mock Server");
      terminal.show();
      terminal.sendText(`${mockExe} serve ${filePath} ${interfaceName}`);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("tyml.mock.send", async (filePath: string, interfaceName: string, functionName: string) => {
      const terminal = vscode.window.createTerminal("TYML Mock Client");
      terminal.show();
      terminal.sendText(`${mockExe} send ${filePath} ${interfaceName} ${functionName}`);
    })
  );

  client = new LanguageClient('tyml_lsp', 'TYML LSP Server', serverOptions, clientOptions);
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  return client ? client.stop() : undefined;
}