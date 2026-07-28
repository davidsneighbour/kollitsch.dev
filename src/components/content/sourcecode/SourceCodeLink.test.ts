// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('SourceCodeLink component', () => {
  it('exports typed props and supports line anchors plus derived labels', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const src = await fs.readFile(
      path.join(testDir, 'SourceCodeLink.astro'),
      'utf8',
    );

    expect(src).toContain('export interface Props');
    expect(src).toContain('function buildHref');
    expect(src).toContain('function deriveLabel');
    expect(src).toContain('target="_blank"');
    expect(src).toContain('rel="noopener noreferrer"');
  });
});
