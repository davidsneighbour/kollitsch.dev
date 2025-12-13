// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { stripMdx } from './llms';

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
