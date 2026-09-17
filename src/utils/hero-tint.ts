/**
 * Computes a contrast-safe text-fill tint for the header wordmark image, per
 * theme, from the header image's own darkest/lightest regions.
 *
 * The wordmark (see TextImageFill.astro) clips the site title text to the
 * header photo, with a solid tint colour layered over it at some opacity.
 * How dark or light that photo is varies release to release (the header
 * image is swapped periodically), so a single fixed tint/opacity pair can
 * pass contrast against one theme's page background and fail the other's
 * (a dark photo reads fine on a light page but disappears on a dark one).
 *
 * A photo's *average* colour isn't a safe basis for that: a photo can be
 * mostly near-black with only small lighter patches (this site's own header
 * photo is exactly that), so a tint solved against the mean still leaves
 * plenty of the glyph area sitting on much-darker-than-average patches,
 * under contrast. Instead this samples the image's low/high luminance
 * percentiles - a robust stand-in for "the darkest/lightest patch the text
 * is likely to land on" - and solves the tint against those.
 *
 * This runs entirely server-side via `sharp` (already bundled with Astro's
 * image pipeline) at build and dev-server start-up - never in the browser -
 * and picks the minimum tint opacity, per theme, that reaches a target WCAG
 * contrast ratio against that theme's page background.
 */

import { fileURLToPath } from 'node:url';
import { hexToRgb, type RGB, srgbToLinear } from '@utils/color.ts';
import sharp from 'sharp';

/** Tint applied to the image-clipped title text in one theme. */
export interface ThemeHeroTint {
  /** Hex colour layered over the header image inside the clipped text. */
  tintColor: string;
  /** Opacity of that tint layer, in [0, 1]. */
  tintOpacity: number;
}

export interface HeroTint {
  light: ThemeHeroTint;
  dark: ThemeHeroTint;
}

/**
 * Representative colours sampled from an image's luminance distribution,
 * used as the "worst case" the tint must still contrast against.
 */
export interface ImageColorSample {
  /** Colour near the low end of the image's luminance range (a dark patch). */
  darkRegion: RGB;
  /** Colour near the high end of the image's luminance range (a light patch). */
  lightRegion: RGB;
}

// Mirrors theme.css's --color-olive-50 / --color-olive-950 page backgrounds
// and the --color-primary-200 / --color-primary-800 (green-200/green-800)
// tint colours - keep these in sync if those tokens ever change shade.
const LIGHT_BACKGROUND_HEX = '#fbfbf9'; // --color-olive-50
const DARK_BACKGROUND_HEX = '#0c0c09'; // --color-olive-950
const LIGHT_THEME_TINT_HEX = '#016630'; // --color-primary-800 (dark tint, for the light page)
const DARK_THEME_TINT_HEX = '#b9f8cf'; // --color-primary-200 (light tint, for the dark page)

// WCAG AA for normal text (4.5) plus headroom: the wordmark is re-encoded to
// webp at a handful of responsive widths and rendered through
// background-clip: text, both of which soften/resample pixels slightly
// relative to the source JPEG this module analyses - measured in a real
// browser, that shaved ~10% off the predicted contrast. Targeting 5.5 here
// keeps the *worst* sampled patch clearing 4.5 after that loss, rather than
// only the average patch clearing it exactly.
const TARGET_CONTRAST_RATIO = 5.5;

// Percentile of the image's luminance distribution used as the "worst case"
// patch per theme: low tail for the dark-theme (light-tint) solve, high tail
// for the light-theme (dark-tint) solve. Not the true min/max - those are
// one-pixel outliers (a stray specular highlight, a JPEG artefact) that
// would force the tint opacity far higher than the text actually needs.
const DARK_REGION_PERCENTILE = 0.05;
const LIGHT_REGION_PERCENTILE = 0.95;

// Image is downsampled to this width before sampling - enough to capture
// the image's real luminance spread without reading every full-res pixel.
const SAMPLE_WIDTH = 400;

// Never drop the tint below this - some of the image should stay recognisably
// a photo. Never push it above this either - at some point it's just a solid
// colour, which defeats the point of a photographic wordmark fill.
const MIN_TINT_OPACITY = 0.1;
const MAX_TINT_OPACITY = 0.95;

const BINARY_SEARCH_STEPS = 20;

/**
 * WCAG relative luminance of a gamma-encoded sRGB colour.
 *
 * @param rgb - Colour channels in [0, 255].
 */
export function relativeLuminance(rgb: RGB): number {
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * WCAG contrast ratio between two relative luminances, in [1, 21].
 *
 * @param luminanceA - First colour's relative luminance.
 * @param luminanceB - Second colour's relative luminance.
 */
export function contrastRatio(luminanceA: number, luminanceB: number): number {
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);
  return (lighter + 0.05) / (darker + 0.05);
}

// The rendered glyph colour is the tint layered over the image at
// `opacity`, composited the way CSS composites background-image layers: a
// plain per-channel blend of the gamma-encoded (0-255) values, not a
// linear-light blend.
function compositeOverImage(image: RGB, tint: RGB, opacity: number): RGB {
  return {
    b: tint.b * opacity + image.b * (1 - opacity),
    g: tint.g * opacity + image.g * (1 - opacity),
    r: tint.r * opacity + image.r * (1 - opacity),
  };
}

/**
 * Find the smallest tint opacity in [MIN_TINT_OPACITY, MAX_TINT_OPACITY]
 * that reaches the target contrast ratio against the theme background.
 * Assumes contrast is monotonically non-decreasing in opacity, which holds
 * as long as the tint colour's luminance sits further from the background's
 * luminance than the image's does - true for the dark-tint/light-background
 * and light-tint/dark-background pairings this module uses.
 */
function solveTintOpacity(
  imageColor: RGB,
  tintColor: RGB,
  backgroundLuminance: number,
): number {
  const contrastAt = (opacity: number) =>
    contrastRatio(
      relativeLuminance(compositeOverImage(imageColor, tintColor, opacity)),
      backgroundLuminance,
    );

  if (contrastAt(MIN_TINT_OPACITY) >= TARGET_CONTRAST_RATIO) {
    return MIN_TINT_OPACITY;
  }
  if (contrastAt(MAX_TINT_OPACITY) < TARGET_CONTRAST_RATIO) {
    return MAX_TINT_OPACITY;
  }

  let low = MIN_TINT_OPACITY;
  let high = MAX_TINT_OPACITY;
  for (let step = 0; step < BINARY_SEARCH_STEPS; step += 1) {
    const mid = (low + high) / 2;
    if (contrastAt(mid) >= TARGET_CONTRAST_RATIO) {
      high = mid;
    } else {
      low = mid;
    }
  }
  return high;
}

function percentileByLuminance(pixels: RGB[], percentile: number): RGB {
  const sorted = [...pixels].sort(
    (a, b) => relativeLuminance(a) - relativeLuminance(b),
  );
  const index = Math.min(
    sorted.length - 1,
    Math.floor(sorted.length * percentile),
  );
  const pixel = sorted[index];
  if (!pixel) {
    throw new Error('Cannot sample percentile of an empty pixel set');
  }
  return pixel;
}

/**
 * Sample an image's dark- and light-region representative colours from its
 * low/high luminance percentiles.
 *
 * @param imagePath - Filesystem path (or `file:` URL) to the source image.
 * @throws {Error} When the image cannot be read or analysed by sharp.
 */
export async function sampleImageColors(
  imagePath: string | URL,
): Promise<ImageColorSample> {
  const path = imagePath instanceof URL ? fileURLToPath(imagePath) : imagePath;
  const { data, info } = await sharp(path)
    .resize(SAMPLE_WIDTH, undefined, { fit: 'inside' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels: RGB[] = [];
  for (let offset = 0; offset < data.length; offset += info.channels) {
    pixels.push({
      b: data[offset + 2] ?? 0,
      g: data[offset + 1] ?? 0,
      r: data[offset] ?? 0,
    });
  }

  return {
    darkRegion: percentileByLuminance(pixels, DARK_REGION_PERCENTILE),
    lightRegion: percentileByLuminance(pixels, LIGHT_REGION_PERCENTILE),
  };
}

/**
 * Compute the light- and dark-theme tint for a header image so its
 * image-clipped title text clears WCAG AA contrast (with headroom) against
 * both themes' page background, even on the image's darkest/lightest
 * patches.
 *
 * @param imagePath - Filesystem path (or `file:` URL) to the source image.
 * @throws {Error} When the image cannot be read or analysed by sharp.
 * @example
 * ```ts
 * import { computeHeroTint } from '@utils/hero-tint.ts';
 *
 * const tint = await computeHeroTint(
 *   new URL('../assets/images/headline/20260913.jpg', import.meta.url),
 * );
 * ```
 */
export async function computeHeroTint(
  imagePath: string | URL,
): Promise<HeroTint> {
  const sample = await sampleImageColors(imagePath);
  return heroTintForImageColors(sample);
}

/**
 * Pure counterpart to {@link computeHeroTint}: derives the light/dark tint
 * from already-sampled image colours, without touching the filesystem.
 * Exported separately so the contrast-solving logic can be tested without
 * exercising sharp.
 *
 * @param sample - Dark/light representative colours, in [0, 255] per channel.
 */
export function heroTintForImageColors(sample: ImageColorSample): HeroTint {
  const lightTint = hexToRgb(LIGHT_THEME_TINT_HEX);
  const darkTint = hexToRgb(DARK_THEME_TINT_HEX);
  const lightBackgroundLuminance = relativeLuminance(
    hexToRgb(LIGHT_BACKGROUND_HEX),
  );
  const darkBackgroundLuminance = relativeLuminance(
    hexToRgb(DARK_BACKGROUND_HEX),
  );

  return {
    dark: {
      tintColor: DARK_THEME_TINT_HEX,
      // Dark theme's light tint has to lift the image's darkest patches,
      // not just its average - solve against darkRegion.
      tintOpacity: solveTintOpacity(
        sample.darkRegion,
        darkTint,
        darkBackgroundLuminance,
      ),
    },
    light: {
      tintColor: LIGHT_THEME_TINT_HEX,
      // Light theme's dark tint has to darken the image's lightest patches.
      tintOpacity: solveTintOpacity(
        sample.lightRegion,
        lightTint,
        lightBackgroundLuminance,
      ),
    },
  };
}
