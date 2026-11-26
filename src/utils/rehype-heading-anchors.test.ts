// @vitest-environment node
import { fromHtml } from 'hast-util-from-html';
import { toHtml } from 'hast-util-to-html';
import { describe, expect, it } from 'vitest';
import { addHeadingAnchors } from './rehype-heading-anchors.ts';

function run(html: string): string {
  const tree = fromHtml(html, { fragment: true });
  addHeadingAnchors(tree);
  return toHtml(tree);
}

describe('addHeadingAnchors', () => {
  it('appends an empty labelled anchor to h2 to h4 with an id', () => {
    const html = run('<h2 id="setup">Setup</h2>');
    expect(html).toMatch(/^<h2 id="setup">Setup<a [^>]+><\/a><\/h2>$/);
    expect(html).toContain('class="heading-anchor"');
    expect(html).toContain('href="#setup"');
    expect(html).toContain('aria-label="Link to this section"');
    expect(run('<h4 id="x">X</h4>')).toContain('href="#x"');
  });

  it('skips h1, h5, and headings without an id', () => {
    expect(run('<h1 id="a">A</h1><h5 id="b">B</h5><h2>C</h2>')).toBe(
      '<h1 id="a">A</h1><h5 id="b">B</h5><h2>C</h2>',
    );
  });

  it('finds nested headings and does not add a second anchor', () => {
    const tree = fromHtml('<section><h3 id="n">N</h3></section>', {
      fragment: true,
    });
    addHeadingAnchors(tree);
    addHeadingAnchors(tree);
    expect(toHtml(tree).match(/heading-anchor/g)).toHaveLength(1);
  });
});
