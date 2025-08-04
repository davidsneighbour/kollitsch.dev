/**
 * A couple of helpers for working with Tailwind CSS 4.1+ (TW)
 * breakpoints and container widths.
 *
 * This module provides consistent access to Tailwind breakpoints, max widths,
 * and utility functions for converting rem/px and generating responsive image sizes.
 *
 * @work-in-progress
 * @author Patrick Kollitsch <davidsneighbourdev+gh@gmail.com>
 *
 * @see https://tailwindcss.com/docs/responsive-design TW documentation
 * @see https://tailwindcss.com/docs/max-width TW documentation
 */
//
// The TW breakpoints are these:
//
// | Breakpoint | Minimum width	| CSS |
// | ---------- | ------------- | --- |
// | sm	        | 40rem(640px)	| @media(width >= 40rem) { ... } |
// | md	        | 48rem(768px)	| @media(width >= 48rem) { ... } |
// | lg	        | 64rem(1024px)	| @media(width >= 64rem) { ... } |
// | xl	        | 80rem(1280px)	| @media(width >= 80rem) { ... } |
// | 2xl	      | 96rem(1536px)	| @media(width >= 96rem) { ... } |
//
// The TW max-widths are these:
//
// | Max Width | Size in rem | Size in px |
// | --------- | ----------- | ---------- |
// | 3xs       | 16rem       | 256px      |
// | 2xs       | 18rem       | 288px      |
// | xs        | 20rem       | 320px      |
// | sm        | 24rem       | 384px      |
// | md        | 28rem       | 448px      |
// | lg        | 32rem       | 512px      |
// | xl        | 36rem       | 576px      |
// | 2xl       | 42rem       | 672px      |
// | 3xl       | 48rem       | 768px      |
// | 4xl       | 56rem       | 896px      |
// | 5xl       | 64rem       | 1024px     |
// | 6xl       | 72rem       | 1152px     |
// | 7xl       | 80rem       | 1280px     |

/**
 * A Tailwind breakpoint identifier, such as `sm`, `md`, `lg`, `xl`, or `2xl`.
 */
export type TailwindBreakpoint = keyof typeof twBreakpoints;

/**
 * A Tailwind max-width class name (e.g., `7xl`, `4xl`, `md`).
 */
export type TailwindMaxWidthKey = keyof typeof twMaxWidths;

/**
 * An alias of TailwindBreakpoint used for `ColumnConfig` and image helpers.
 */
export type Breakpoint = keyof typeof twBreakpointsPx;

/**
 * Describes the number of columns used at different Tailwind breakpoints,
 * along with an optional maximum container width to calculate fixed image sizes.
 *
 * Used to generate a responsive `sizes` attribute for images that accurately reflects
 * how much horizontal space they will occupy in the layout.
 *
 * @example
 * getTailwindSizes({
 *   base: 3,               // 3 columns on desktop
 *   sm: 1,                 // 1 column on mobile (≤640px)
 *   md: 2,                 // 2 columns on tablets (≤768px)
 *   maxContentWidth: 1280  // matches Tailwind's `max-w-7xl` on kollitsch.dev
 * });
 *
 * // Resulting sizes string:
 * // (max-width: 640px) 100vw, (max-width: 768px) 50vw, (min-width: 769px) 426px
 */
export interface ColumnConfig extends Partial<Record<Breakpoint, number>> {
  /**
   * Default number of columns on large viewports.
   * Used as a fallback when no breakpoints match.
   */
  base: number;

  /**
   * Total maximum content container width in pixels.
   * Used to calculate exact column width on large viewports
   * (e.g., `max-w-7xl` → 1280px → 426px for 3 columns).
   *
   * If omitted, sizes fall back to a % of the viewport (e.g., 33vw).
   */
  maxContentWidth?: number;
}

/**
 * Tailwind breakpoint values in both rem and px formats.
 *
 * @example
 * twBreakpoints.md → { rem: 48, px: 768 }
 */
export const twBreakpoints = {
  '2xl': { px: 1536, rem: 96 },
  lg: { px: 1024, rem: 64 },
  md: { px: 768, rem: 48 },
  sm: { px: 640, rem: 40 },
  xl: { px: 1280, rem: 80 },
} as const;

/**
 * Tailwind breakpoint values in rem.
 */
export const twBreakpointsRem = {
  '2xl': 96,
  lg: 64,
  md: 48,
  sm: 40,
  xl: 80,
};

/**
 * Tailwind breakpoint values in px.
 */
export const twBreakpointsPx = {
  '2xl': 1536,
  lg: 1024,
  md: 768,
  sm: 640,
  xl: 1280,
};

/**
 * Tailwind max-width values in rem.
 */
export const twMaxWidthsRem = {
  '2xl': 42,
  '2xs': 18,
  '3xl': 48,
  '3xs': 16,
  '4xl': 56,
  '5xl': 64,
  '6xl': 72,
  '7xl': 80,
  lg: 32,
  md: 28,
  sm: 24,
  xl: 36,
  xs: 20,
};

/**
 * Tailwind max-width values in px.
 */
export const twMaxWidthsPx = {
  '2xl': 672,
  '2xs': 288,
  '3xl': 768,
  '3xs': 256,
  '4xl': 896,
  '5xl': 1024,
  '6xl': 1152,
  '7xl': 1280,
  lg: 512,
  md: 448,
  sm: 384,
  xl: 576,
  xs: 320,
};

/**
 * Ordered Tailwind breakpoints used for consistent iteration.
 */
export const orderedBreakpoints: TailwindBreakpoint[] = [
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
];

/**
 * Ordered Tailwind max-width keys for predictable rendering.
 */
export const orderedMaxWidths: TailwindMaxWidthKey[] = [
  '3xs',
  '2xs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
];

/**
 * Get the pixel value for a Tailwind max-width key.
 */
export const getMaxWidthPx = (key: TailwindMaxWidthKey): number => {
  return twMaxWidthsPx[key];
};

/**
 * Get the pixel value for a Tailwind breakpoint key.
 */
export const getBreakpointPx = (bp: TailwindBreakpoint): number => {
  return twBreakpointsPx[bp];
};

/**
 * Get both rem and px for a Tailwind breakpoint.
 */
export const getBreakpoint = (key: TailwindBreakpoint): TailwindSize =>
  twBreakpoints[key];

/**
 * Get both rem and px for a Tailwind max-width.
 */
export const getMaxWidth = (key: TailwindMaxWidthKey): TailwindSize =>
  twMaxWidths[key];

/**
 * Bundled access to commonly used Tailwind constants.
 */
export const tailwind = {
  breakpoints: twBreakpointsPx,
  maxWidths: twMaxWidthsPx,
  orderedBreakpoints,
  orderedMaxWidths,
};

/**
 * Converts rem to px using the provided base font size (default 16).
 *
 * @param rem - rem unit to convert
 * @param base - base font size in pixels (default is 16)
 * @returns rem multiplied by base
 *
 * @example
 * remToPx(4)        // 64px
 * remToPx(4, 24)    // 96px
 */
export const remToPx = (rem: number, base: number = 16): number => rem * base;

/**
 * Combined Tailwind max-widths in rem and px.
 */
export const twMaxWidths = {
  '2xl': { px: 672, rem: 42 },
  '2xs': { px: 288, rem: 18 },
  '3xl': { px: 768, rem: 48 },
  '3xs': { px: 256, rem: 16 },
  '4xl': { px: 896, rem: 56 },
  '5xl': { px: 1024, rem: 64 },
  '6xl': { px: 1152, rem: 72 },
  '7xl': { px: 1280, rem: 80 },
  lg: { px: 512, rem: 32 },
  md: { px: 448, rem: 28 },
  sm: { px: 384, rem: 24 },
  xl: { px: 576, rem: 36 },
  xs: { px: 320, rem: 20 },
} as const;

/**
 * Structure for a Tailwind max width, including rem and px.
 */
export type TailwindMaxWidth = {
  rem: number;
  px: number;
};

/**
 * Generic type for sizes containing both rem and px units.
 */
export type TailwindSize = {
  rem: number;
  px: number;
};

/**
 * Generate a responsive `sizes` attribute string based on Tailwind breakpoints and columns.
 *
 * @param config - ColumnConfig object defining how many columns are shown per breakpoint
 * @returns A sizes attribute string suitable for use in a <picture> or <img> element
 *
 * @example
 * getTailwindSizes({ base: 3, sm: 1, md: 2, maxContentWidth: 1280 })
 * // → "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (min-width: 769px) 426px"
 */
export function getTailwindSizes(config: ColumnConfig): string {
  const { base, maxContentWidth } = config;

  const entries = Object.entries(twBreakpointsPx)
    .filter(([bp]) => bp in config)
    .sort(([, a], [, b]) => a - b) as [Breakpoint, number][];

  const parts = entries.map(([bp, width]) => {
    const cols = config[bp];
    if (!cols || cols < 1) return '';
    const percent = (100 / cols).toFixed(2);
    return `(max-width: ${width}px) ${percent}vw`;
  });

  if (maxContentWidth && base > 0) {
    const maxBpWidth = Math.max(...entries.map(([, w]) => w), 0);
    const fixed = Math.floor(maxContentWidth / base);
    parts.push(`(min-width: ${maxBpWidth + 1}px) ${fixed}px`);
  } else {
    parts.push(`${(100 / base).toFixed(2)}vw`);
  }

  return parts.filter(Boolean).join(', ');
}

// @todo work in container query support
// @see https://tailwindcss.com/docs/responsive-design#container-queries
// container
// width: 100 %;
// @media(width >= 40rem) { max-width: 40rem; }
// @media(width >= 48rem) { max-width: 48rem; }
// @media(width >= 64rem) { max-width: 64rem; }
// @media(width >= 80rem) { max-width: 80rem; }
// @media(width >= 96rem) { max-width: 96rem; }
