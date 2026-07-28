// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('TagCloud component (props contract)', () => {
  it('exports a Props interface/type and renders a weighted filterable cloud', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const componentPath = path.join(testDir, 'TagCloud.astro');

    const src = await fs.readFile(componentPath, 'utf8');

    const regex = /export\s+(?:interface|type)\s+[A-Za-z0-9_]*Props\b/;
    expect(regex.test(src)).toBe(true);
    expect(src).toContain('TagListItem[] | Map<string, number>');
    expect(src).toContain('function getFontSize');
    expect(src).toContain('data-tag-filter-list');
    expect(src).toContain('data-label');
  });

  it('is used on the tags index page', async () => {
    const repoRoot = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../../..',
    );
    const src = await fs.readFile(
      path.join(repoRoot, 'src/pages/tags/index.astro'),
      'utf8',
    );

    expect(src).toContain('@components/content/taxonomy/TagCloud.astro');
    expect(src).toContain('visibleTagsWithCounts = allTagsWithCounts.filter(');
    expect(src).toContain('(tag) => !tag.hideInTagCloud');
    expect(src).toContain('tags={visibleTagsWithCounts}');
    expect(src).toContain('<TagCloud');
  });
});
