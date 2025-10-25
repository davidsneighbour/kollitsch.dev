/** RGB channels in 0..255 */
export interface RGB {
  r: number;
  g: number;
  b: number;
}

/** HSL with h in 0..360, s,l in 0..1 */
export interface HSL {
  h: number;
  s: number;
  l: number;
}

/** CIE Lab (D65) */
export interface LAB {
  l: number;
  a: number;
  b: number;
}

/** Regex for #RGB or #RRGGBB */
export const HEX_COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/** Type guard for hex strings. */
export type Hex = `#${string}`;

export function isHexColor(input: string): input is Hex {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(input);
}

export function assertHex(input: string): asserts input is Hex {
  if (!isHexColor(input)) throw new Error('Invalid hex color');
}

/** Normalize #RGB to #RRGGBB, lowercase. */
export function normalizeHex(hex: `#${string}`): `#${string}` {
  const v = hex.toLowerCase();
  if (v.length === 4) {
    const r = v[1],
      g = v[2],
      b = v[3];
    return `#${r}${r}${g}${g}${b}${b}` as `#${string}`;
  }
  return v as `#${string}`;
}

export function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

export function clamp255(x: number): number {
  return Math.min(255, Math.max(0, Math.round(x)));
}

/** Convert #RGB/#RRGGBB to RGB. */
export function hexToRgb(hex: `#${string}`): RGB {
  const h = normalizeHex(hex).slice(1);
  return {
    b: parseInt(h.slice(4, 6), 16),
    g: parseInt(h.slice(2, 4), 16),
    r: parseInt(h.slice(0, 2), 16),
  };
}

/** Convert RGB to #RRGGBB. */
export function rgbToHex({ r, g, b }: RGB): `#${string}` {
  const p = (n: number) => clamp255(n).toString(16).padStart(2, '0');
  return `#${p(r)}${p(g)}${p(b)}` as `#${string}`;
}

/** Convert RGB to HSL. */
export function rgbToHsl({ r, g, b }: RGB): HSL {
  const R = r / 255,
    G = g / 255,
    B = b / 255;
  const max = Math.max(R, G, B),
    min = Math.min(R, G, B);
  const d = max - min;
  const l = (max + min) / 2;
  let h = 0,
    s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case R:
        h = 60 * (((G - B) / d) % 6);
        break;
      case G:
        h = 60 * ((B - R) / d + 2);
        break;
      default:
        h = 60 * ((R - G) / d + 4);
        break;
    }
  }
  h = (h + 360) % 360;
  return { h, l, s };
}

/** Convert HSL to RGB */
export function hslToRgb({ h, s, l }: HSL): RGB {
  const C = (1 - Math.abs(2 * l - 1)) * s;
  const X = C * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - C / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [C, X, 0];
  else if (h < 120) [r, g, b] = [X, C, 0];
  else if (h < 180) [r, g, b] = [0, C, X];
  else if (h < 240) [r, g, b] = [0, X, C];
  else if (h < 300) [r, g, b] = [X, 0, C];
  else [r, g, b] = [C, 0, X];
  return {
    b: clamp255((b + m) * 255),
    g: clamp255((g + m) * 255),
    r: clamp255((r + m) * 255),
  };
}

// sRGB helpers
function srgbToLinear(v255: number): number {
  const v = v255 / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function rgbToXyz({ r, g, b }: RGB): { x: number; y: number; z: number } {
  const R = srgbToLinear(r),
    G = srgbToLinear(g),
    B = srgbToLinear(b);
  return {
    x: R * 0.4124564 + G * 0.3575761 + B * 0.1804375,
    y: R * 0.2126729 + G * 0.7151522 + B * 0.072175,
    z: R * 0.0193339 + G * 0.119192 + B * 0.9503041,
  };
}

/** XYZ D65 to Lab D65. */
export function xyzToLab({
  x,
  y,
  z,
}: {
  x: number;
  y: number;
  z: number;
}): LAB {
  const Xn = 0.95047,
    Yn = 1.0,
    Zn = 1.08883;
  const f = (t: number) => {
    const e = 216 / 24389,
      k = 24389 / 27;
    return t > e ? Math.cbrt(t) : (t * k + 16) / 116;
  };
  const fx = f(x / Xn),
    fy = f(y / Yn),
    fz = f(z / Zn);
  return { a: 500 * (fx - fy), b: 200 * (fy - fz), l: 116 * fy - 16 };
}

/** RGB to Lab (D65). */
export function rgbToLab(rgb: RGB): LAB {
  return xyzToLab(rgbToXyz(rgb));
}

/** CSS helpers */
export function rgbCss(rgb: RGB, alpha?: number): string {
  return alpha === undefined
    ? `rgb(${rgb.r} ${rgb.g} ${rgb.b})`
    : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clamp01(alpha)})`;
}

export function hslCss(hsl: HSL, alpha?: number): string {
  const h = Math.round(hsl.h),
    s = Math.round(hsl.s * 100),
    l = Math.round(hsl.l * 100);
  return alpha === undefined
    ? `hsl(${h} ${s}% ${l}%)`
    : `hsla(${h}, ${s}%, ${l}%, ${clamp01(alpha)})`;
}

export function linearToSrgb(v: number): number {
  const x = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return clamp255(x * 255);
}
