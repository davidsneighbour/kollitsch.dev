// @vitest-environment node

import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { load } from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';
import ShareSeparator from './ShareSeparator.astro';

describe('ShareSeparator component (props contract)', () => {
  it('exports a Props interface/type', async () => {
    // resolve the .astro component path relative to this test file
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const componentPath = path.join(testDir, 'ShareSeparator.astro');

    const src = await fs.readFile(componentPath, 'utf8');

    // heuristic: match `export interface XProps` or `export type XProps =`
    const regex = /export\s+(?:interface|type)\s+[A-Za-z0-9_]*Props\b/;
    expect(regex.test(src)).toBe(true);
  });
});

it('renders the configured Mastodon fallback and lazy instance settings', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(ShareSeparator, {
    props: { description: 'A description', title: 'A & B' },
    request: new Request('https://kollitsch.dev/example/'),
  });
  const $ = load(html);
  const mastodon = $('a[data-share-intent]');
  expect(mastodon).toHaveLength(1);
  expect(mastodon.find('.sr-only').text()).toBe('Mastodon');
  expect(mastodon.attr('aria-label')).toBe('Mastodon');
  expect(new URL(mastodon.attr('href') ?? '').searchParams.get('text')).toBe(
    'A & B https://kollitsch.dev/example/',
  );
  expect(
    JSON.parse(mastodon.attr('data-share-instance') ?? '{}').storageKey,
  ).toBe('mastodon_instance_url');
  expect($('a[href*="bsky.app"]').attr('data-share-intent')).toBeUndefined();
});
