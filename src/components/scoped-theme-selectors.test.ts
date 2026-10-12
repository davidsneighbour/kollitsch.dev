// @vitest-environment node
import { readFile } from 'node:fs/promises';
import fg from 'fast-glob';
import { describe, expect, it } from 'vitest';

// Astro scopes every compound selector in a scoped <style> block, including
// a theme ancestor: `:where([data-theme="dark"]) x` becomes
// `[data-astro-cid-…]:where([data-theme="dark"]) x[…]`. <html> never carries
// the scope id, so such a dark-mode rule silently never applies. Theme
// ancestors in scoped blocks must be wrapped in :global(). See DESIGN.md.
describe('scoped component styles', () => {
  it('wrap theme ancestor selectors in :global()', async () => {
    const files = await fg('src/**/*.astro', {
      ignore: ['src/pages/prototypes/**'],
    });
    const offenders: string[] = [];

    for (const file of files) {
      const source = await readFile(file, 'utf8');
      for (const match of source.matchAll(
        /<style(?![^>]*is:global)[^>]*>([\s\S]*?)<\/style>/g,
      )) {
        for (const line of (match[1] ?? '').split('\n')) {
          if (/^\s*(?::where\()?\[data-theme=/.test(line)) {
            offenders.push(`${file}: ${line.trim()}`);
          }
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
