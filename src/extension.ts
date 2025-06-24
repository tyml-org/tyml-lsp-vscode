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
    run:   { command: serverExe, transport: TransportKind.stdio },
    debug: { command: serverExe, transport: TransportKind.stdio }
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'tyml' }],
    initializationOptions: {}
  };

  client = new LanguageClient('tyml_lsp', 'TYML LSP Server', serverOptions, clientOptions);
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  return client ? client.stop() : undefined;
}