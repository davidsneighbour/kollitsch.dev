import * as vscode from 'vscode';
import * as path from 'path';

let debug = false;
/** Only logs when gohtmlLinker.debug = true */
const debugLog = (...args: any[]) => {
  if (debug) {
    console.log('[dnb-hugo-helper]', ...args);
  }
};

/**
 * Activate the extension: load settings and register the DocumentLinkProvider
 * for each configured language.
 */
export function activate(context: vscode.ExtensionContext) {

  const config = vscode.workspace.getConfiguration('gohtmlLinker');
  debug = config.get<boolean>('debug', false);

  debugLog('🔗 GoHugo Partial Linker activating…');

  const rawPatterns = config.get<any[]>('patterns', []);
  const languages = config.get<string[]>('languages', []);

  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage(
      'GoHugo Partial Linker: no workspace folder open.'
    );
    return;
  }
  const workspaceRoot = workspaceFolders[0].uri.fsPath;

  // Build regex list, skip invalid entries
  const patterns: { regex: RegExp; folder: string }[] = [];
  for (const p of rawPatterns) {
    try {
      const re = new RegExp(p.regex, 'g');
      patterns.push({ regex: re, folder: p.folder });
      debugLog(`  ✔️ Loaded pattern /${p.regex}/ => ${p.folder}`);
    } catch (e) {
      console.error(`  ❌ Invalid regex in gohtmlLinker.patterns: ${p.regex}`, e);
    }
  }

  const provider = new PartialLinkProvider(patterns, workspaceRoot);
  for (const lang of languages) {
    debugLog(`  • Registering DocumentLinkProvider for language "${lang}"`);
    const selector: vscode.DocumentSelector = { scheme: 'file', language: lang };
    context.subscriptions.push(
      vscode.languages.registerDocumentLinkProvider(selector, provider)
    );
  }

  debugLog('🔗 GoHugo Partial Linker activated.');
}

export function deactivate() {
  debugLog('🔗 GoHugo Partial Linker deactivated.');
}

/**
 * Scans documents for each configured regex and turns the first capture
 * group into a DocumentLink pointing at workspaceRoot/folder/captured.
 */
export class PartialLinkProvider implements vscode.DocumentLinkProvider {
  constructor(
    private readonly patterns: { regex: RegExp; folder: string }[],
    private readonly workspaceRoot: string
  ) {}

  provideDocumentLinks(
    document: vscode.TextDocument,
    _token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.DocumentLink[]> {
    const text = document.getText();
    const links: vscode.DocumentLink[] = [];

    for (const { regex, folder } of this.patterns) {
      let m: RegExpExecArray | null;
      while ((m = regex.exec(text))) {
        const cap = m[1];
        if (!cap) continue;

        const start = document.positionAt(m.index + m[0].indexOf(cap));
        const end = start.translate(0, cap.length);
        const targetFsPath = path.join(this.workspaceRoot, folder, cap);
        const targetUri = vscode.Uri.file(targetFsPath);

        links.push(new vscode.DocumentLink(new vscode.Range(start, end), targetUri));
      }
    }

    return links;
  }
}
