// @vitest-environment node
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import palette from '../brand/kollitsch-brand/palette.json' with {
  type: 'json',
};
import {
  extractGroup,
  getBrandAspectRatio,
  getBrandGeometry,
  renderBrandSvg,
  renderFaviconSvg,
} from './brand-logo.ts';

function luminance(hex: string): number {
  const channels = [1, 3, 5].map(
    (i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255,
  );
  const [r, g, b] = channels.map((c) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
}

function contrast(a: string, b: string): number {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((high ?? 0) + 0.05) / ((low ?? 0) + 0.05);
}

describe('extractGroup', () => {
  it('balances nested groups', () => {
    const svg =
      '<svg><g id="a"><g id="b"><path/></g><circle/></g><g id="c"/></svg>';
    expect(extractGroup(svg, 'a')).toBe(
      '<g id="a"><g id="b"><path/></g><circle/></g>',
    );
  });

  it('throws for a missing group', () => {
    expect(() => extractGroup('<svg></svg>', 'iconmark')).toThrow(/missing/);
  });
});

describe('renderBrandSvg', () => {
  it('renders the combination mark with both named groups and an accessible name', () => {
    const svg = renderBrandSvg('combination-mark', { class: 'x' });
    expect(svg).toMatch(/^<svg [^>]*viewBox="0 0 581\.\d+ 120"/);
    expect(svg).toContain('class="x"');
    expect(svg).toContain('role="img"');
    expect(svg).toContain('aria-label="KOLLITSCH.dev"');
    expect(svg).toContain('id="iconmark"');
    expect(svg).toContain('id="wordmark"');
  });

  it('renders the iconmark alone on a square viewBox', () => {
    const svg = renderBrandSvg('iconmark');
    expect(svg).toContain('viewBox="0 0 120 120"');
    expect(svg).not.toContain('id="wordmark"');
    expect(getBrandAspectRatio('iconmark')).toBe(1);
  });

  it('hides decorative instances from assistive technology', () => {
    const svg = renderBrandSvg('combination-mark', { decorative: true });
    expect(svg).toContain('aria-hidden="true"');
    expect(svg).not.toContain('role="img"');
  });

  it('paints only with --logo-* roles, with fallbacks', () => {
    const geometry = getBrandGeometry('combination-mark');
    expect(geometry).toContain('var(--logo-foreground, currentColor)');
    expect(geometry).toContain('var(--logo-muted, currentColor)');
    expect(geometry).toContain(`var(--logo-primary, ${palette.light.primary})`);
    expect(geometry).not.toMatch(/#[0-9a-f]{6}(?!\))/i);
    expect(geometry).not.toMatch(/<text|font-family|href=/);
  });
});

describe('renderFaviconSvg', () => {
  it('has an opaque background and switches palettes by colour scheme', () => {
    const svg = renderFaviconSvg('adaptive');
    expect(svg).toContain(
      '<rect width="120" height="120" fill="var(--logo-background)"/>',
    );
    expect(svg).toContain(`--logo-background:${palette.dark.background}`);
    expect(svg).toContain('@media (prefers-color-scheme:light)');
  });

  it('uses literal colours for raster export', () => {
    const svg = renderFaviconSvg('dark');
    expect(svg).not.toContain('var(');
    expect(svg).toContain(`fill="${palette.dark.background}"`);
    expect(svg).toContain(palette.dark.primary);
  });

  it('matches the tracked favicon.svg', () => {
    const tracked = readFileSync(
      path.join(process.cwd(), 'src/assets/favicon/favicon.svg'),
      'utf8',
    );
    expect(tracked).toBe(renderFaviconSvg('adaptive'));
  });
});

describe('brand palette contrast (logo-design-reference.md, section 7)', () => {
  for (const [name, colours] of Object.entries(palette)) {
    it(`meets the minimum thresholds in the ${name} palette`, () => {
      expect(
        contrast(colours.foreground, colours.background),
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrast(colours.muted, colours.background),
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrast(colours.primary, colours.background),
      ).toBeGreaterThanOrEqual(3);
    });
  }
});

describe('theme.css logo tokens', () => {
  it('match palette.json in both themes', () => {
    const css = readFileSync(
      path.join(process.cwd(), 'src/styles/theme.css'),
      'utf8',
    );
    for (const [name, colours] of Object.entries(palette)) {
      for (const role of ['foreground', 'muted', 'primary'] as const) {
        expect(css.toLowerCase(), `${name} ${role}`).toContain(
          `--logo-${role}: ${colours[role].toLowerCase()};`,
        );
      }
    }
  });
});
