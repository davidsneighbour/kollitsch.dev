/**
 * Color conversion and formatting utilities.
 *
 * All exported helpers are pure and side-effect free; they validate their
 * inputs to catch programming mistakes early and always return normalized data
 * (for example, hexadecimal colors are lowercase #rrggbb strings).
 */

/** Hexadecimal digit characters supported by CSS color literals. */
type HexDigit =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F';

type HexDigitLower = Lowercase<HexDigit>;

type ShortHexColor = `#${HexDigit}${HexDigit}${HexDigit}`;

type LongHexColor =
  `#${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}`;

type LongHexColorLower =
  `#${HexDigitLower}${HexDigitLower}${HexDigitLower}${HexDigitLower}${HexDigitLower}${HexDigitLower}`;

/** Hexadecimal string that may be three or six digits long. */
export type HexColor = ShortHexColor | LongHexColor;

/** Backwards-compatible alias retained for existing imports. */
export type Hex = HexColor;

/** Lowercase hexadecimal color that is always six digits long. */
export type NormalizedHexColor = LongHexColorLower;

/**
 * RGB channels in the [0, 255] range.
 */
export interface RGB {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

/**
 * HSL color values where hue is [0, 360) and saturation/lightness are [0, 1].
 */
export interface HSL {
  readonly h: number;
  readonly s: number;
  readonly l: number;
}

/**
 * CIE Lab (D65) coordinates.
 */
export interface LAB {
  readonly l: number;
  readonly a: number;
  readonly b: number;
}

/** Regex that matches either #rgb or #rrggbb color strings (case-insensitive). */
export const HEX_COLOR_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/u;

/**
 * Assert that a value is a finite number.
 *
 * @param value - The numeric value to check.
 * @param label - Human-readable label used in the error message.
 * @throws {TypeError} When the value is not a finite number.
 */
function assertFiniteNumber(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${label} must be a finite number`);
  }
}

function assertRgbChannels(rgb: RGB, context: string): void {
  assertFiniteNumber(rgb.r, `${context} red channel`);
  assertFiniteNumber(rgb.g, `${context} green channel`);
  assertFiniteNumber(rgb.b, `${context} blue channel`);
}

function assertHslComponents(hsl: HSL, context: string): void {
  assertFiniteNumber(hsl.h, `${context} hue`);
  assertFiniteNumber(hsl.s, `${context} saturation`);
  assertFiniteNumber(hsl.l, `${context} lightness`);
}

/**
 * Check whether a string is a valid CSS hexadecimal color literal.
 *
 * @param input - Candidate string.
 * @returns True when the input matches `#rgb` or `#rrggbb`.
 * @example
 * ```ts
 * import { isHexColor } from '@utils/color.ts';
 *
 * if (isHexColor('#0af')) {
 *   console.log('Valid hex color');
 * }
 * ```
 */
export function isHexColor(input: string): input is HexColor {
  return HEX_COLOR_RE.test(input);
}

/**
 * Ensure a string is a valid hexadecimal color literal.
 *
 * @param input - String to validate.
 * @throws {TypeError} When the string does not represent a color literal.
 * @example
 * ```ts
 * import { assertHex } from '@utils/color.ts';
 *
 * const value = '#336699';
 * assertHex(value);
 * // value is now narrowed to a valid hexadecimal color string
 * ```
 */
export function assertHex(input: string): asserts input is HexColor {
  if (!isHexColor(input)) {
    throw new TypeError('Invalid hex color');
  }
}

/**
 * Normalise hexadecimal colors to lowercase `#rrggbb` strings.
 *
 * @param hex - Candidate hex string.
 * @returns Lowercase, six-digit hexadecimal color.
 * @throws {TypeError} When the input is not a valid color.
 * @example
 * ```ts
 * import { normalizeHex } from '@utils/color.ts';
 *
 * const normalised = normalizeHex('#0Af');
 * console.log(normalised); // "#00aaff"
 * ```
 */
export function normalizeHex(hex: string): NormalizedHexColor {
  assertHex(hex);
  const value = hex.toLowerCase();
  if (value.length === 4) {
    const r = value[1];
    const g = value[2];
    const b = value[3];
    return `#${r}${r}${g}${g}${b}${b}` as NormalizedHexColor;
  }
  return value as NormalizedHexColor;
}

/**
 * Clamp a number to the inclusive [0, 1] range.
 *
 * @param x - Value to clamp.
 * @returns Number within [0, 1].
 * @throws {TypeError} When the input is not finite.
 * @example
 * ```ts
 * import { clamp01 } from '@utils/color.ts';
 *
 * clamp01(1.2); // 1
 * clamp01(-0.4); // 0
 * ```
 */
export function clamp01(x: number): number {
  assertFiniteNumber(x, 'Clamp input');
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  return x;
}

/**
 * Clamp a number to the inclusive [0, 255] range while rounding to the nearest integer.
 *
 * @param x - Value to clamp and round.
 * @returns Integer within [0, 255].
 * @throws {TypeError} When the input is not finite.
 * @example
 * ```ts
 * import { clamp255 } from '@utils/color.ts';
 *
 * clamp255(278.2); // 255
 * clamp255(12.6); // 13
 * ```
 */
export function clamp255(x: number): number {
  assertFiniteNumber(x, 'Clamp input');
  if (x <= 0) return 0;
  if (x >= 255) return 255;
  return Math.round(x);
}

/**
 * Convert a hexadecimal color string to its RGB representation.
 *
 * @param hex - Hexadecimal color (short or long form).
 * @returns RGB channels in [0, 255].
 * @throws {TypeError} When the input is not a valid color string.
 * @example
 * ```ts
 * import { hexToRgb } from '@utils/color.ts';
 *
 * const rgb = hexToRgb('#ff9900');
 * console.log(rgb); // { r: 255, g: 153, b: 0 }
 * ```
 */
export function hexToRgb(hex: string): RGB {
  const normalised = normalizeHex(hex);
  return {
    b: parseInt(normalised.slice(5, 7), 16),
    g: parseInt(normalised.slice(3, 5), 16),
    r: parseInt(normalised.slice(1, 3), 16),
  };
}

/**
 * Convert RGB channels to a lowercase hexadecimal `#rrggbb` string.
 *
 * @param rgb - RGB channels to convert.
 * @returns Lowercase hexadecimal color string.
 * @throws {TypeError} When any channel is not finite.
 * @example
 * ```ts
 * import { rgbToHex } from '@utils/color.ts';
 *
 * const hex = rgbToHex({ r: 12, g: 34, b: 56 });
 * console.log(hex); // "#0c2238"
 * ```
 */
export function rgbToHex(rgb: RGB): NormalizedHexColor {
  assertRgbChannels(rgb, 'rgbToHex');
  const part = (value: number) => clamp255(value).toString(16).padStart(2, '0');
  return `#${part(rgb.r)}${part(rgb.g)}${part(rgb.b)}` as NormalizedHexColor;
}

/**
 * Convert an RGB color to its HSL representation.
 *
 * @param rgb - RGB channels to convert.
 * @returns HSL color space representation.
 * @throws {TypeError} When any channel is not finite.
 * @example
 * ```ts
 * import { rgbToHsl } from '@utils/color.ts';
 *
 * const hsl = rgbToHsl({ r: 255, g: 0, b: 0 });
 * console.log(hsl); // { h: 0, s: 1, l: 0.5 }
 * ```
 */
export function rgbToHsl(rgb: RGB): HSL {
  assertRgbChannels(rgb, 'rgbToHsl');
  const r = clamp255(rgb.r) / 255;
  const g = clamp255(rgb.g) / 255;
  const b = clamp255(rgb.b) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min;
  const lightness = (max + min) / 2;
  let hue = 0;
  let saturation = 0;
  if (chroma !== 0) {
    saturation = chroma / (1 - Math.abs(2 * lightness - 1));
    switch (max) {
      case r:
        hue = 60 * (((g - b) / chroma) % 6);
        break;
      case g:
        hue = 60 * ((b - r) / chroma + 2);
        break;
      default:
        hue = 60 * ((r - g) / chroma + 4);
        break;
    }
  }
  const normalisedHue = (hue + 360) % 360;
  return { h: normalisedHue, l: clamp01(lightness), s: clamp01(saturation) };
}

/**
 * Convert an HSL color to its RGB representation.
 *
 * @param hsl - HSL color values.
 * @returns RGB color channels.
 * @throws {TypeError} When any component is not finite.
 * @example
 * ```ts
 * import { hslToRgb } from '@utils/color.ts';
 *
 * const rgb = hslToRgb({ h: 120, s: 1, l: 0.25 });
 * console.log(rgb); // { r: 0, g: 128, b: 0 }
 * ```
 */
export function hslToRgb(hsl: HSL): RGB {
  assertHslComponents(hsl, 'hslToRgb');
  const hue = ((hsl.h % 360) + 360) % 360;
  const saturation = clamp01(hsl.s);
  const lightness = clamp01(hsl.l);
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const hueSegment = hue / 60;
  const secondComponent = chroma * (1 - Math.abs((hueSegment % 2) - 1));
  const match = lightness - chroma / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (hueSegment >= 0 && hueSegment < 1) {
    r = chroma;
    g = secondComponent;
  } else if (hueSegment < 2) {
    r = secondComponent;
    g = chroma;
  } else if (hueSegment < 3) {
    g = chroma;
    b = secondComponent;
  } else if (hueSegment < 4) {
    g = secondComponent;
    b = chroma;
  } else if (hueSegment < 5) {
    r = secondComponent;
    b = chroma;
  } else {
    r = chroma;
    b = secondComponent;
  }
  return {
    b: clamp255((b + match) * 255),
    g: clamp255((g + match) * 255),
    r: clamp255((r + match) * 255),
  };
}

function srgbToLinear(channel: number): number {
  assertFiniteNumber(channel, 'sRGB channel');
  const value = channel / 255;
  if (value <= 0.04045) {
    return value / 12.92;
  }
  return Math.pow((value + 0.055) / 1.055, 2.4);
}

function rgbToXyz(rgb: RGB): { x: number; y: number; z: number } {
  assertRgbChannels(rgb, 'rgbToXyz');
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);
  return {
    x: r * 0.4124564 + g * 0.3575761 + b * 0.1804375,
    y: r * 0.2126729 + g * 0.7151522 + b * 0.072175,
    z: r * 0.0193339 + g * 0.119192 + b * 0.9503041,
  };
}

/**
 * Convert XYZ D65 values into CIE Lab (D65).
 *
 * @param xyz - Tristimulus values relative to a D65 white point.
 * @returns Lab representation.
 * @throws {TypeError} When any component is not finite.
 * @example
 * ```ts
 * import { xyzToLab } from '@utils/color.ts';
 *
 * const lab = xyzToLab({ x: 0.95, y: 1, z: 1.09 });
 * console.log(lab); // { l: ~100, a: ~0, b: ~0 }
 * ```
 */
export function xyzToLab({
  x,
  y,
  z,
}: {
  x: number;
  y: number;
  z: number;
}): LAB {
  assertFiniteNumber(x, 'xyzToLab X');
  assertFiniteNumber(y, 'xyzToLab Y');
  assertFiniteNumber(z, 'xyzToLab Z');
  const xn = 0.95047;
  const yn = 1.0;
  const zn = 1.08883;
  const epsilon = 216 / 24389;
  const kappa = 24389 / 27;
  const transform = (value: number) =>
    value > epsilon ? Math.cbrt(value) : (value * kappa + 16) / 116;
  const fx = transform(x / xn);
  const fy = transform(y / yn);
  const fz = transform(z / zn);
  return {
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
    l: 116 * fy - 16,
  };
}

/**
 * Convert RGB channels to Lab (D65) coordinates.
 *
 * @param rgb - RGB channels to convert.
 * @returns Lab color values.
 * @throws {TypeError} When any channel is not finite.
 * @example
 * ```ts
 * import { rgbToLab } from '@utils/color.ts';
 *
 * const lab = rgbToLab({ r: 255, g: 255, b: 255 });
 * console.log(lab); // { l: ~100, a: ~0, b: ~0 }
 * ```
 */
export function rgbToLab(rgb: RGB): LAB {
  return xyzToLab(rgbToXyz(rgb));
}

/**
 * Format an RGB color as a CSS string.
 *
 * @param rgb - Color channels to format.
 * @param alpha - Optional opacity value in [0, 1].
 * @returns CSS `rgb()` or `rgba()` string.
 * @throws {TypeError} When any component or alpha is not finite.
 * @example
 * ```ts
 * import { rgbCss } from '@utils/color.ts';
 *
 * rgbCss({ r: 255, g: 255, b: 255 }); // "rgb(255 255 255)"
 * rgbCss({ r: 255, g: 0, b: 0 }, 0.5); // "rgba(255, 0, 0, 0.5)"
 * ```
 */
export function rgbCss(rgb: RGB, alpha?: number): string {
  assertRgbChannels(rgb, 'rgbCss');
  if (alpha === undefined) {
    return `rgb(${rgb.r} ${rgb.g} ${rgb.b})`;
  }
  const clamped = clamp01(alpha);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clamped})`;
}

/**
 * Format an HSL color as a CSS string.
 *
 * @param hsl - Color values to format.
 * @param alpha - Optional opacity value in [0, 1].
 * @returns CSS `hsl()` or `hsla()` string.
 * @throws {TypeError} When any component or alpha is not finite.
 * @example
 * ```ts
 * import { hslCss } from '@utils/color.ts';
 *
 * hslCss({ h: 210, s: 0.5, l: 0.4 }); // "hsl(210 50% 40%)"
 * hslCss({ h: 210, s: 0.5, l: 0.4 }, 0.3); // "hsla(210, 50%, 40%, 0.3)"
 * ```
 */
export function hslCss(hsl: HSL, alpha?: number): string {
  assertHslComponents(hsl, 'hslCss');
  const hue = Math.round(((hsl.h % 360) + 360) % 360);
  const saturationPercent = Math.round(clamp01(hsl.s) * 100);
  const lightnessPercent = Math.round(clamp01(hsl.l) * 100);
  if (alpha === undefined) {
    return `hsl(${hue} ${saturationPercent}% ${lightnessPercent}%)`;
  }
  const clamped = clamp01(alpha);
  return `hsla(${hue}, ${saturationPercent}%, ${lightnessPercent}%, ${clamped})`;
}

/**
 * Convert a linear-light intensity into an sRGB channel value (0-255).
 *
 * @param value - Linear intensity in [0, 1].
 * @returns Integer sRGB channel.
 * @throws {TypeError} When the input is not finite.
 * @example
 * ```ts
 * import { linearToSrgb } from '@utils/color.ts';
 *
 * linearToSrgb(0.5); // 188
 * ```
 */
export function linearToSrgb(value: number): number {
  assertFiniteNumber(value, 'linearToSrgb input');
  if (value <= 0) {
    return 0;
  }
  if (value >= 1) {
    return 255;
  }
  const result =
    value <= 0.0031308
      ? 12.92 * value
      : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
  return clamp255(result * 255);
}
