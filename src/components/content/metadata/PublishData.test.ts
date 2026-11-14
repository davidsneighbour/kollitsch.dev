// @vitest-environment node

import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { load } from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';
import PublishData from './PublishData.astro';

describe('PublishData component (props contract)', () => {
  it('exports a Props interface/type', async () => {
    // resolve the .astro component path relative to this test file
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const componentPath = path.join(testDir, 'PublishData.astro');

    const src = await fs.readFile(componentPath, 'utf8');

    // heuristic: match `export interface XProps` or `export type XProps =`
    const regex = /export\s+(?:interface|type)\s+[A-Za-z0-9_]*Props\b/;
    expect(regex.test(src)).toBe(true);
  });
});

it('gives the development edit link an accessible name and the source URL', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(PublishData, {
    props: {
      post: {
        data: { date: new Date('2026-11-14T00:00:00Z') },
        id: '2026/example',
      },
    },
  });
  const link = load(html)('a[href^="vscode://file/"]');
  expect(link).toHaveLength(1);
  expect(link.attr('aria-label')).toBe('Edit post in VS Code');
  expect(link.attr('href')).toMatch(
    /src\/content\/blog\/2026\/example\/index\.md$/,
  );
});
