// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('ContactPage component (props contract)', () => {
  it('exports a Props interface/type and emits ContactPage JSON-LD', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const componentPath = path.join(testDir, 'ContactPage.astro');

    const src = await fs.readFile(componentPath, 'utf8');

    const regex = /export\s+(?:interface|type)\s+[A-Za-z0-9_]*Props\b/;
    expect(regex.test(src)).toBe(true);
    expect(src).toContain("'@type': 'ContactPage'");
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

    expect(src).toContain('@components/seo/schema/ContactPage.astro');
    expect(src).toContain('<ContactPageSchema');
  });
});
