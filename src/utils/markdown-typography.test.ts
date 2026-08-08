// @vitest-environment node
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toMarkdown } from 'mdast-util-to-markdown';
import { describe, expect, it } from 'vitest';
import { remarkDnbTypography } from './markdown-typography.ts';

function transform(markdown: string): string {
  const tree = fromMarkdown(markdown);
  remarkDnbTypography()(tree);
  return toMarkdown(tree);
}

describe('remarkDnbTypography', () => {
  it('replaces triple hyphens with an em dash', () => {
    expect(transform('one --- two')).toContain('one — two');
  });

  it('replaces double hyphens with an en dash', () => {
    expect(transform('one -- two')).toContain('one – two');
  });

  it('leaves a single hyphen unchanged', () => {
    expect(transform('a well-known fact')).toContain('a well-known fact');
  });

  it('prefers the longer pattern when dashes overlap', () => {
    expect(transform('one ---- two')).toContain('one —- two');
  });

  it('does not alter fenced code blocks', () => {
    const result = transform('```\nfoo -- bar\n```');
    expect(result).toContain('foo -- bar');
  });

  it('does not alter inline code spans', () => {
    const result = transform('use `a -- b` here');
    expect(result).toContain('`a -- b`');
  });
});
