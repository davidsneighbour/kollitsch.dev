// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('Colophon component (props contract + patterns)', () => {
  const testDir = path.dirname(fileURLToPath(import.meta.url));
  const componentPath = path.join(testDir, 'Colophon.astro');

  it('exports a Props interface/type', async () => {
    const src = await fs.readFile(componentPath, 'utf8');
    const regex = /export\s+(?:interface|type)\s+\w*Props\b/;
    expect(regex.test(src)).toBe(true);
  });

  it('keeps the watermark decorative and the hover spectrum progressive', async () => {
    const src = await fs.readFile(componentPath, 'utf8');
    // Decorative exception stays (DESIGN.md "Footer Colophon Watermark").
    expect(src).toContain('aria-hidden="true"');
    expect(src).toContain(
      'data-dnb-design-exception="decorative-low-contrast"',
    );
    // Faint olive rest state and fallback without text clipping.
    expect(src).toContain('text-olive-100');
    expect(src).toContain('dark:text-olive-900');
    // The spectrum copy only exists where clipping and masking work.
    expect(src).toContain('data-text={setup.title}');
    expect(src).toMatch(
      /@supports \(\(background-clip: text\) or \(-webkit-background-clip: text\)\) and\s+\(mask-image:/,
    );
    expect(src).toContain('content: attr(data-text)');
  });

  it('gates the sway behind motion preferences and cleans up listeners', async () => {
    const src = await fs.readFile(componentPath, 'utf8');
    expect(src).toMatch(
      /@media \(prefers-reduced-motion: no-preference\) \{\s*\.colophon-word:hover::after \{\s*animation:/,
    );
    expect(src).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?transition: none;/,
    );
    expect(src).toContain('colophonDirection(');
    expect(src).toContain("addEventListener('astro:before-swap'");
    expect(src).toContain('{\n      signal,\n    }');
  });

  // @todo add a test that checks that a font-size prop is defined with a number value in vw
  // it('does not contain inline style attributes', async () => {
  //   const src = await fs.readFile(componentPath, 'utf8');
  //   // Heuristic: look for style= followed by any of { ` ' " (covers Astro template style interpolation)
  //   const hasInlineStyle = /style\s*=\s*[{`'\"]/.test(src);
  //   expect(hasInlineStyle).toBe(false);
  // });
});
