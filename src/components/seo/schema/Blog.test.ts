// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('Blog component (props contract)', () => {
  it('exports a Props interface/type and emits Blog JSON-LD', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const componentPath = path.join(testDir, 'Blog.astro');

    const src = await fs.readFile(componentPath, 'utf8');

    const regex = /export\s+(?:interface|type)\s+[A-Za-z0-9_]*Props\b/;
    expect(regex.test(src)).toBe(true);
    expect(src).toContain("'@type': 'Blog'");
    expect(src).toContain('type="application/ld+json"');
  });

  it('is rendered by blog listing routes', async () => {
    const repoRoot = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../../..',
    );
    const routePaths = [
      'src/pages/blog/index.astro',
      'src/pages/blog/[page].astro',
      'src/pages/blog/[year]/index.astro',
      'src/pages/blog/[year]/[page].astro',
    ];

    await Promise.all(
      routePaths.map(async (routePath) => {
        const src = await fs.readFile(path.join(repoRoot, routePath), 'utf8');
        expect(src).toContain('@components/seo/schema/Blog.astro');
        expect(src).toContain('<BlogSchema');
      }),
    );
  });
});
