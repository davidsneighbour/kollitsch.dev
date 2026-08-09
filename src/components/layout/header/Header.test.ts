// @vitest-environment node

import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('SiteHeader.astro', () => {
  it('exists at the expected path', () => {
    const p = path.resolve(__dirname, './title/SiteTitle.astro');
    expect(existsSync(p)).toBe(true);
  });

  it('overlays the reading progress bar without intercepting pointer events', async () => {
    const p = path.resolve(__dirname, './Header.astro');
    const source = await import('node:fs/promises').then((fs) =>
      fs.readFile(p, 'utf8'),
    );

    expect(source).toContain('progress--viewport-top');
    expect(source).toContain('pointer-events-none');
    expect(source).toContain('absolute inset-x-0 bottom-0');
  });
});
