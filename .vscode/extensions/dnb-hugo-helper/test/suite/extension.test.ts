

import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';
// @ts-ignore: load the compiled extension code at runtime
const { PartialLinkProvider } = require('../../../out/src/extension') as typeof import('../../../src/extension');


suite('PartialLinkProvider', () => {
  test('should return a single link for one partial.Include', async () => {
    // 1) simulate a workspace root
    const workspaceRoot = path.resolve(__dirname, '../../../../');
    // 2) create a fake document
    const content = `{{- partials.Include "foo/bar.html" $post -}}`;
    const doc = await vscode.workspace.openTextDocument({ content, language: 'gohtml' });

    // 3) instantiate provider with a simple pattern
    const provider = new PartialLinkProvider(
      [{ regex: /partials\.Include\s+"([^"]+)"/g, folder: 'layouts/partials/' }],
      workspaceRoot
    );

    // 4) run it
    const links = (await provider.provideDocumentLinks(
      doc,
      new vscode.CancellationTokenSource().token
    )) as vscode.DocumentLink[];

    // 5) assertions
    assert.strictEqual(links.length, 1);
    const link = links[0];
    assert.strictEqual(
      link.target?.fsPath,
      path.join(workspaceRoot, 'layouts/partials/foo/bar.html')
    );
    const startOffset = content.indexOf('foo/bar.html');
    const expectedPos = doc.positionAt(startOffset);
    assert.deepStrictEqual(link.range.start, expectedPos);
  });
});
