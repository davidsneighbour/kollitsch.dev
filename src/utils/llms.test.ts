// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { formatBlogPostPath, llmsTxt, stripMdx } from './llms';

describe('llms responses', () => {
  it('serves llms.txt content as Markdown', async () => {
    const response = llmsTxt({
      description: 'Site description',
      items: [],
      name: 'Site Name',
      site: 'https://example.com/',
    });

    expect(response.headers.get('Content-Type')).toBe(
      'text/markdown; charset=utf-8',
    );
    await expect(response.text()).resolves.toContain('# Site Name');
  });

  it('formats canonical blog post paths', () => {
    expect(formatBlogPostPath('2026/example-post')).toBe(
      '/blog/2026/example-post/',
    );
    expect(formatBlogPostPath('/2026/example-post/')).toBe(
      '/blog/2026/example-post/',
    );
  });
});

describe.skip('stripMdx', () => {
  it('removes import lines and component tags (paired and self-closing)', () => {
    const input = `
import X from 'x';

<MyComp prop={1} />
Visible text
<MyOther>inner content</MyOther>
`;

    // Paired tags and self-closing tags should be removed; only the visible text remains.
    expect(stripMdx(input)).toBe('Visible text');
  });

  it('returns empty string for input that only contains MDX artifacts', () => {
    const input = `\nimport a from 'b';\n<MyComp/>\n`;
    expect(stripMdx(input)).toBe('');
  });
});
