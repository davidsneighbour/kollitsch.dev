// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { getTocHeadings } from './table-of-contents.ts';

const h = (depth: number, slug: string) => ({ depth, slug, text: slug });

describe('getTocHeadings', () => {
  it('returns nothing below the minimum number of h2 sections', () => {
    expect(
      getTocHeadings([h(2, 'a'), h(2, 'b'), h(2, 'c'), h(3, 'd')]),
    ).toEqual([]);
  });

  it('returns h2 and h3 entries in order once the minimum is reached', () => {
    const headings = [
      h(1, 't'),
      h(2, 'a'),
      h(3, 'a1'),
      h(4, 'a2'),
      h(2, 'b'),
      h(2, 'c'),
      h(2, 'd'),
    ];
    expect(getTocHeadings(headings).map((x) => x.slug)).toEqual([
      'a',
      'a1',
      'b',
      'c',
      'd',
    ]);
  });

  it('accepts a custom minimum', () => {
    expect(getTocHeadings([h(2, 'a')], 1)).toHaveLength(1);
  });
});
