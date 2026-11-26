import { readFileSync } from 'node:fs';
import path from 'node:path';
import markBounds from '../brand/kollitsch-brand/mark-bounds.json' with {
  type: 'json',
};
import palette from '../brand/kollitsch-brand/palette.json' with {
  type: 'json',
};

/**
 * Inline SVG renderer for the KOLLITSCH.dev brand marks.
 *
 * `src/brand/kollitsch-brand/logo.master.svg` is the only geometry source
 * (see `logo-design-reference.md`, section 8). This module extracts the named
 * `iconmark` and `wordmark` groups from it at build time and never redraws
 * them. The master paints with the semantic `--logo-*` custom properties;
 * the site sets them per theme in `src/styles/theme.css`. Each `var()` gets a
 * fallback, so the mark stays legible where the site CSS is absent (for
 * example in feed readers that show post HTML).
 */

export type BrandMark = 'combination-mark' | 'iconmark' | 'wordmark';

export type BrandPaletteName = keyof typeof palette;

export interface BrandSvgOptions {
  /** CSS classes for the root `<svg>`. */
  class?: string;
  /**
   * Hide the mark from assistive technology. Use it when an adjacent
   * accessible name already says "KOLLITSCH.dev".
   */
  decorative?: boolean;
}

export const BRAND_NAME = 'KOLLITSCH.dev';
export const ICONMARK_DESCRIPTION =
  'A regular expression dot and asterisk framed by four corner brackets.';

const MASTER_PATH = path.join(
  process.cwd(),
  'src/brand/kollitsch-brand/logo.master.svg',
);

const ROLE_FALLBACKS: Record<string, string> = {
  foreground: 'currentColor',
  muted: 'currentColor',
  primary: palette.light.primary,
};

let masterCache: string | undefined;

function readMaster(): string {
  masterCache ??= readFileSync(MASTER_PATH, 'utf8');
  return masterCache;
}

/**
 * Returns the outer markup of the `<g id="...">` element with the given id,
 * balancing nested groups so inner `</g>` tags do not end the match early.
 */
export function extractGroup(svg: string, id: string): string {
  const start = svg.indexOf(`<g id="${id}"`);
  if (start === -1) {
    throw new Error(`[brand-logo] Group "${id}" is missing in the master SVG.`);
  }

  const tags = /<g[\s>]|<\/g>/g;
  tags.lastIndex = start;
  let depth = 0;
  for (let match = tags.exec(svg); match; match = tags.exec(svg)) {
    depth += match[0] === '</g>' ? -1 : 1;
    if (depth === 0) {
      return svg.slice(start, match.index + match[0].length);
    }
  }

  throw new Error(
    `[brand-logo] Group "${id}" is not closed in the master SVG.`,
  );
}

function withFallbacks(markup: string): string {
  return markup.replace(
    /var\(--logo-(foreground|muted|primary)\)/g,
    (_match, role: string) =>
      `var(--logo-${role}, ${ROLE_FALLBACKS[role] ?? 'currentColor'})`,
  );
}

/** The mark's inner geometry, with `--logo-*` colour roles. */
export function getBrandGeometry(mark: BrandMark): string {
  const master = readMaster();
  const parts =
    mark === 'combination-mark'
      ? [extractGroup(master, 'iconmark'), extractGroup(master, 'wordmark')]
      : [extractGroup(master, mark)];
  return withFallbacks(parts.join(''));
}

export function getBrandViewBox(mark: BrandMark): string {
  return markBounds[mark].join(' ');
}

/** The mark's width-to-height ratio, from its stored viewBox. */
export function getBrandAspectRatio(mark: BrandMark): number {
  const [, , width = 1, height = 1] = markBounds[mark];
  return width / height;
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/** A complete inline `<svg>` for one of the three official marks. */
export function renderBrandSvg(
  mark: BrandMark,
  options: BrandSvgOptions = {},
): string {
  const classAttribute = options.class
    ? ` class="${escapeAttribute(options.class)}"`
    : '';
  const a11y = options.decorative
    ? ' aria-hidden="true" focusable="false"'
    : ` role="img" aria-label="${BRAND_NAME}"`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${getBrandViewBox(mark)}"${classAttribute}${a11y}>${getBrandGeometry(mark)}</svg>`;
}

/**
 * A self-contained favicon: the iconmark on an opaque background
 * (section 10.1). Dark is the default; browsers that support
 * `prefers-color-scheme` inside SVG favicons switch to the light palette.
 *
 * Pass a palette name to get literal colours instead of custom properties,
 * for rasterisers that do not resolve CSS `var()` (PNG and ICO export).
 */
export function renderFaviconSvg(
  variant: 'adaptive' | BrandPaletteName = 'adaptive',
  size = 512,
): string {
  const { dark, light } = palette;
  const vars = (p: (typeof palette)[BrandPaletteName]): string =>
    `--logo-background:${p.background};--logo-foreground:${p.foreground};--logo-muted:${p.muted};--logo-primary:${p.primary}`;
  let body = `<rect width="120" height="120" fill="var(--logo-background)"/>${extractGroup(readMaster(), 'iconmark')}`;
  let style = `<style>:root{${vars(dark)}}@media (prefers-color-scheme:light){:root{${vars(light)}}}</style>`;

  if (variant !== 'adaptive') {
    const colours = palette[variant];
    body = body.replace(
      /var\(--logo-(background|foreground|muted|primary)\)/g,
      (_match, role: keyof typeof colours) => colours[role],
    );
    style = '';
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${getBrandViewBox('iconmark')}" role="img" aria-label="${BRAND_NAME}"><title>${BRAND_NAME}</title><desc>${ICONMARK_DESCRIPTION}</desc>${style}${body}</svg>\n`;
}
