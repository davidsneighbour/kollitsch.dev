// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('Post component (props contract)', () => {
  it('exports a Props interface/type and renders sourcecode links when present', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const componentPath = path.join(testDir, 'Post.astro');

    const src = await fs.readFile(componentPath, 'utf8');

    const regex = /export\s+(?:interface|type)\s+[A-Za-z0-9_]*Props\b/;
    expect(regex.test(src)).toBe(true);
    expect(src).toContain('@components/content/sourcecode/SourceCode.astro');
    expect(src).toContain('post.data.sourcecode');
    expect(src).toContain('<SourceCode');
  });
});
