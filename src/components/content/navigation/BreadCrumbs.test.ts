// @vitest-environment node

import { stripHtmlTags } from '@utils/content.pure';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('BreadCrumbs component (props contract)', () => {
  it('exports a Props interface/type', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const componentPath = path.join(testDir, 'BreadCrumbs.astro');

    const src = await fs.readFile(componentPath, 'utf8');

    const regex = /export\s+(?:interface|type)\s+[A-Za-z0-9_]*Props\b/;
    expect(regex.test(src)).toBe(true);
  });

  it('renders breadcrumb labels as HTML and strips HTML in aria-label text', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const componentPath = path.join(testDir, 'BreadCrumbs.astro');

    const src = await fs.readFile(componentPath, 'utf8');

    expect(src).toContain('set:html={breadcrumb.label}');
    expect(src).toContain('stripHtmlTags(breadcrumb.label)');
  });
});

describe('stripHtmlTags', () => {
  it('removes inline HTML tags while preserving readable spacing', () => {
    const text =
      'Keeping <code>engines.node</code> aligned with the Node release schedule';

    expect(stripHtmlTags(text)).toBe(
      'Keeping engines.node aligned with the Node release schedule',
    );
  });
});
