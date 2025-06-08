import * as path from 'path';
import * as cp from 'child_process';
import {
  LanguageClient, LanguageClientOptions, ServerOptions, TransportKind
} from 'vscode-languageclient/node';
import * as vscode from 'vscode';

let client: LanguageClient;
export function activate(context: vscode.ExtensionContext) {
  const serverExe = context.asAbsolutePath(
    path.join('server', process.platform === 'win32' ? 'tyml-lsp-server.exe' : 'tyml-lsp-server')
  );

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