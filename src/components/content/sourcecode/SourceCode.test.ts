// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('SourceCode component', () => {
  it('exports typed props and delegates each source entry to SourceCodeLink', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const src = await fs.readFile(
      path.join(testDir, 'SourceCode.astro'),
      'utf8',
    );

    expect(src).toContain('export type Props');
    expect(src).toContain(
      'sourcecode: Record<string, string | SourceCodeEntry>',
    );
    expect(src).toContain('import SourceCodeLink');
    expect(src).toContain('<SourceCodeLink');
  });
});
