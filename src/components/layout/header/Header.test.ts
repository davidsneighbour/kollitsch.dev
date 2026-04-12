// @vitest-environment node

import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('SiteHeader.astro', () => {
  it('exists at the expected path', () => {
    const p = path.resolve(__dirname, 'SiteHeader.astro');
    expect(existsSync(p)).toBe(true);
  });
});
