// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('ContactOption component (props contract)', () => {
  it('exports a Props interface/type and emits ContactPoint JSON-LD', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const componentPath = path.join(testDir, 'ContactOption.astro');

    const src = await fs.readFile(componentPath, 'utf8');

    const regex = /export\s+(?:interface|type)\s+[A-Za-z0-9_]*Props\b/;
    expect(regex.test(src)).toBe(true);
    expect(src).toContain("'@type': 'ContactPoint'");
    expect(src).toContain('type="application/ld+json"');
  });

  it('is rendered by the contact page layout', async () => {
    const repoRoot = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../../..',
    );
    const src = await fs.readFile(
      path.join(repoRoot, 'src/layouts/ContentPageConnect.astro'),
      'utf8',
    );

    expect(src).toContain('@components/seo/schema/ContactOption.astro');
    expect(src).toContain('<ContactOptionSchema');
  });
});
