// @vitest-environment node

import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';
import Tags from './Tags.astro';

describe('Tags component (props contract)', () => {
  it('exports a Props interface/type', async () => {
    // resolve the .astro component path relative to this test file
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const componentPath = path.join(testDir, 'Tags.astro');

    const src = await fs.readFile(componentPath, 'utf8');

    // heuristic: match `export interface XProps` or `export type XProps =`
    const regex = /export\s+(?:interface|type)\s+[A-Za-z0-9_]*Props\b/;
    expect(regex.test(src)).toBe(true);
  });
});

describe('Tags component rendering', () => {
  it('renders nothing for an empty tags array', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Tags, {
      props: { post: { data: { tags: [] } } },
    });
    expect(html).not.toContain('Tags:');
  });

  it('renders nothing when tags is undefined', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Tags, {
      props: { post: { data: {} } },
    });
    expect(html).not.toContain('Tags:');
  });

  it('renders tag links when tags are present', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Tags, {
      props: { post: { data: { tags: ['astro', 'testing'] } } },
    });
    expect(html).toContain('Tags:');
    expect(html).toContain('#astro');
    expect(html).toContain('#testing');
  });

  it('resolves tag metadata before rendering tag badges', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const componentPath = path.join(testDir, 'Tags.astro');
    const src = await fs.readFile(componentPath, 'utf8');

    expect(src).toContain('normaliseTags');
    expect(src).toContain('<Tag');
    expect(src).toContain('tag.badge');
  });
});
