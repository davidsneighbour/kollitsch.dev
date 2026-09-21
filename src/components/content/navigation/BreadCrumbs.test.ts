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

describe('BreadCrumbs component (year/post switcher wiring)', () => {
  const load = async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const componentPath = path.join(testDir, 'BreadCrumbs.astro');
    return fs.readFile(componentPath, 'utf8');
  };

  it('renders BreadcrumbSwitcher only for the year segment and the last (post) segment', async () => {
    const src = await load();

    expect(src).toContain('import BreadcrumbSwitcher');
    expect(src).toContain('isYearCrumb ?');
    expect(src).toContain('isPostCrumb ?');
    // Home/Blog fall through to the unchanged plain <a> branch, since
    // isYearCrumb/isPostCrumb are the only switcher gates.
    expect(src).toContain(
      'isYearCrumb = index === yearCrumbIndex && yearItems.length > 0',
    );
    expect(src).toContain(
      'isPostCrumb =\n      isLast && postItems.length > 0 && currentPostId !== undefined',
    );
  });

  it('derives year/post switcher data from the breadcrumb trail, not by re-parsing path', async () => {
    const src = await load();

    expect(src).toContain('getBlogYears');
    expect(src).toContain('getBlogPostsForYear');
    expect(src).toContain('/^\\d{4}$/.test(crumb.label)');
  });

  it('marks the post switcher as the current page', async () => {
    const src = await load();

    expect(src).toContain('ariaLabel="Switch blog year"');
    expect(src).toContain('ariaLabel="Switch post"');
    expect(src).toContain('isCurrentPage');
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
