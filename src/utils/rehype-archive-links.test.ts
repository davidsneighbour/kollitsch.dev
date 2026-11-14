// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  decorateArchiveLinksInHtml,
  getInternetArchiveIconPath,
} from './rehype-archive-links.ts';

const SNAPSHOT =
  'https://web.archive.org/web/20231218190708/https://www.pantone.com/articles/color-of-the-year/what-is-peach-fuzz';

describe('getInternetArchiveIconPath', () => {
  it('reads the path data from simple-icons-astro', () => {
    expect(getInternetArchiveIconPath()).toMatch(/^M[\d.\s-]/);
  });
});

describe('decorateArchiveLinksInHtml', () => {
  it('marks archive links in an HTML fragment', () => {
    const html = decorateArchiveLinksInHtml(
      `Photo by <a href="${SNAPSHOT}">Pantone</a>`,
    );
    expect(html).toContain('data-archive-link-marker');
    expect(html).toContain('18 December 2023');
    expect(html).toContain(getInternetArchiveIconPath());
  });

  it('returns HTML without archive links unchanged', () => {
    const html = 'Photo by <a href="https://example.com/">Example</a>';
    expect(decorateArchiveLinksInHtml(html)).toBe(html);
  });
});
