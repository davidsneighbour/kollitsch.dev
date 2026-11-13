// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { renderIntroductionHtml } from './introduction.pure.ts';

describe('renderIntroductionHtml', () => {
  it('keeps blank-line separated paragraphs as separate paragraphs', () => {
    const html = renderIntroductionHtml(
      'First paragraph.\n\nSecond paragraph.',
    );
    expect(html).toBe('<p>First paragraph.</p>\n<p>Second paragraph.</p>');
  });

  it('replaces the greeting placeholder with an empty greeting slot', () => {
    const html = renderIntroductionHtml("{$greeting} I'm Patrick.");
    expect(html).toBe("<p><span data-greeting-slot></span> I'm Patrick.</p>");
  });

  it('renders inline Markdown links', () => {
    const html = renderIntroductionHtml('I use [Astro](https://astro.build/).');
    expect(html).toContain('<a href="https://astro.build/">Astro</a>');
  });
});
