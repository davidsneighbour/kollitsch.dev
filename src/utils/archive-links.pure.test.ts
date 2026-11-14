// @vitest-environment node
import type { Element, Root } from 'hast';
import { fromHtml } from 'hast-util-from-html';
import { toHtml } from 'hast-util-to-html';
import { describe, expect, it } from 'vitest';
import {
  decorateArchiveLinks,
  formatArchiveDate,
  getArchiveLinkTooltip,
  parseArchiveUrl,
} from './archive-links.pure.ts';

const ICON_PATH = 'M0 0h24v24H0z';
const SNAPSHOT =
  'https://web.archive.org/web/20230926190851/https://www.example.com/post/';

function decorate(html: string): { html: string; tree: Root } {
  const tree = fromHtml(html, { fragment: true });
  decorateArchiveLinks(tree, ICON_PATH);
  return { html: toHtml(tree), tree };
}

function firstAnchor(tree: Root): Element {
  const anchor = tree.children.find(
    (node): node is Element => node.type === 'element',
  );
  if (!anchor) throw new Error('No anchor in fixture');
  return anchor;
}

describe('parseArchiveUrl', () => {
  it('parses a snapshot URL with a full timestamp', () => {
    expect(parseArchiveUrl(SNAPSHOT)).toEqual({
      date: '2023-09-26',
      originalUrl: 'https://www.example.com/post/',
      snapshotUrl: SNAPSHOT,
      timestamp: '20230926190851',
    });
  });

  it('accepts http snapshots and Wayback mode suffixes', () => {
    const snapshot = parseArchiveUrl(
      'http://web.archive.org/web/20231218id_/https://example.com/',
    );
    expect(snapshot?.date).toBe('2023-12-18');
    expect(snapshot?.originalUrl).toBe('https://example.com/');
  });

  it('leaves the date out when the timestamp has no day', () => {
    const snapshot = parseArchiveUrl(
      'https://web.archive.org/web/2023/https://example.com/',
    );
    expect(snapshot).not.toBeNull();
    expect(snapshot?.date).toBeUndefined();
  });

  it('leaves the date out for an impossible day', () => {
    expect(
      parseArchiveUrl('https://web.archive.org/web/20230231/https://a.b/')
        ?.date,
    ).toBeUndefined();
  });

  it('rejects other URLs and Wayback listing pages', () => {
    expect(parseArchiveUrl('https://example.com/')).toBeNull();
    expect(
      parseArchiveUrl('https://web.archive.org/web/*/https://example.com/'),
    ).toBeNull();
    expect(parseArchiveUrl('https://archive.org/details/foo')).toBeNull();
    expect(parseArchiveUrl(undefined)).toBeNull();
  });
});

describe('formatArchiveDate', () => {
  it('formats dates in British long form', () => {
    expect(formatArchiveDate('2023-09-26')).toBe('26 September 2023');
    expect(formatArchiveDate('2025-07-01')).toBe('1 July 2025');
  });
});

describe('getArchiveLinkTooltip', () => {
  it('names the capture date', () => {
    const snapshot = parseArchiveUrl(SNAPSHOT);
    if (!snapshot) throw new Error('fixture must parse');
    expect(getArchiveLinkTooltip(snapshot)).toBe(
      'Archived copy from 26 September 2023 via the Internet Archive. The original page is no longer available.',
    );
  });
});

describe('decorateArchiveLinks', () => {
  it('adds the marker, data attributes, and screen-reader text', () => {
    const { html, tree } = decorate(
      `<a href="${SNAPSHOT}">just replace it</a>`,
    );
    const anchor = firstAnchor(tree);

    expect(anchor.properties['dataArchiveLink']).toBe('');
    expect(anchor.properties['dataArchiveOriginal']).toBe(
      'https://www.example.com/post/',
    );
    expect(anchor.properties['dataArchiveDate']).toBe('2023-09-26');
    expect(anchor.properties['className']).toContain('group/archive');
    expect(html).toContain(`<path d="${ICON_PATH}">`);
    expect(html).toContain('(archived copy from 26 September 2023)');
    expect(html).toContain('Archived copy from 26 September 2023');
  });

  it('keeps the marker on the same line as the last word', () => {
    const { html } = decorate(`<a href="${SNAPSHOT}">just replace it</a>`);
    expect(html).toMatch(
      /just replace <span class="whitespace-nowrap">it<span [^>]*data-archive-link-marker/,
    );
  });

  it('wraps a trailing element together with the marker', () => {
    const { html } = decorate(`<a href="${SNAPSHOT}">use <code>npm</code></a>`);
    expect(html).toMatch(
      /use <span class="whitespace-nowrap"><code>npm<\/code><span [^>]*data-archive-link-marker/,
    );
  });

  it('keeps existing classes on the link', () => {
    const { tree } = decorate(`<a class="foo bar" href="${SNAPSHOT}">x</a>`);
    expect(firstAnchor(tree).properties['className']).toEqual([
      'foo',
      'bar',
      'group/archive',
    ]);
  });

  it('decorates nested links', () => {
    const { html } = decorate(
      `<p>See <strong><a href="${SNAPSHOT}">this</a></strong>.</p>`,
    );
    expect(html).toContain('data-archive-link-marker');
  });

  it('leaves other links unchanged', () => {
    const source = '<a href="https://example.com/">example</a>';
    expect(decorate(source).html).toBe(source);
  });

  it('does not decorate a link twice', () => {
    const tree = fromHtml(`<a href="${SNAPSHOT}">x</a>`, { fragment: true });
    decorateArchiveLinks(tree, ICON_PATH);
    const once = toHtml(tree);
    decorateArchiveLinks(tree, ICON_PATH);
    expect(toHtml(tree)).toBe(once);
  });
});
