import * as path from 'path';
import {
  LanguageClient, LanguageClientOptions, ServerOptions, TransportKind
} from 'vscode-languageclient/node';
import * as vscode from 'vscode';

const THEME_ID = 'tyml-file-icons';
const FLAG_KEY = 'tyml.promptedOnce';

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

  // only proceed if we have never prompted on this machine
  const alreadyPrompted = context.globalState.get<boolean>(FLAG_KEY);
  if (alreadyPrompted) { return; }                             // ✔ already handled

  // check current theme
  const workbenchCfg = vscode.workspace.getConfiguration('workbench');
  const currentTheme = workbenchCfg.get<string>('iconTheme');

  if (currentTheme !== THEME_ID) {
    const choice = await vscode.window.showInformationMessage(
      'Use “TYML File Icons” as your default file-icon theme?',
      { modal: true },         // blocks until answered; clearer UX
      'Use Icon Theme', 'No');
    if (choice === 'Use Icon Theme') {
      await workbenchCfg.update(
        'iconTheme',
        THEME_ID,
        vscode.ConfigurationTarget.Global   // write to user settings.json
      );                                                         /* :contentReference[oaicite:3]{index=3} */
      vscode.window.showInformationMessage('Icon theme activated.');
    }
  }

  // remember we already asked – never prompt again
  await context.globalState.update(FLAG_KEY, true); 
}

export function deactivate(): Thenable<void> | undefined {
  return client ? client.stop() : undefined;
}