// src/utils/theme.ts
// Node 22+, ESM, Astro 5.14+. Strict TypeScript, no 'any'.
import { z } from 'astro/zod';

/** Hex in #RRGGBB or #RGB (normalized to #RRGGBB internally). */
const HexColor = z
  .string()
  .regex(
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
    'Expect hex like #09f or #0099ff',
  );
type Hex = z.infer<typeof HexColor>;

const StatusColorsSchema = z.object({
  danger: HexColor,
  info: HexColor,
  note: HexColor,
  warning: HexColor,
});

const ColorsSchema = z.object({
  accent: HexColor,
  base: HexColor,
  border: HexColor,
  brand: HexColor,
  status: StatusColorsSchema,
  surface: HexColor,
});

const RadiiSchema = z.object({
  lg: z.string().default('12px'),
  md: z.string().default('6px'),
  none: z.string().default('0px'),
  pill: z.string().default('9999px'),
  sm: z.string().default('2px'),
  xl: z.string().default('20px'),
});

const OpacitySchema = z.object({
  heavy: z.number().min(0).max(1).default(0.7),
  medium: z.number().min(0).max(1).default(0.28),
  soft: z.number().min(0).max(1).default(0.15),
  strong: z.number().min(0).max(1).default(0.45),
  subtle: z.number().min(0).max(1).default(0.08),
});

const AnimationSchema = z.object({
  durations: z.object({
    base: z.number().positive().default(200),
    fast: z.number().positive().default(120),
    slow: z.number().positive().default(320),
    slower: z.number().positive().default(480),
  }),
  easing: z.object({
    in: z.string().default('cubic-bezier(0.4, 0.0, 1, 1)'),
    inOut: z.string().default('cubic-bezier(0.4, 0.0, 0.2, 1)'),
    out: z.string().default('cubic-bezier(0.0, 0.0, 0.2, 1)'),
  }),
  names: z.object({
    fade: z.string().default('fade'),
    scaleIn: z.string().default('scale-in'),
    slideDown: z.string().default('slide-down'),
    slideUp: z.string().default('slide-up'),
  }),
});

const ThemeInputSchema = z.object({
  animation: AnimationSchema.default({}),
  colors: ColorsSchema,
  opacity: OpacitySchema.default({}),
  radii: RadiiSchema.default({}),
});

export type ThemeInput = z.infer<typeof ThemeInputSchema>;

export interface RGB {
  r: number;
  g: number;
  b: number;
}
export interface HSL {
  h: number;
  s: number;
  l: number;
}
export interface LAB {
  l: number;
  a: number;
  b: number;
}

function normalizeHex(hex: Hex): `#${string}` {
  const v = hex.toLowerCase();
  if (v.length === 4) {
    const r = v[1],
      g = v[2],
      b = v[3];
    return `#${r}${r}${g}${g}${b}${b}` as `#${string}`;
  }
  return v as `#${string}`;
}
function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}
function clamp255(x: number): number {
  return Math.min(255, Math.max(0, Math.round(x)));
}

function hexToRgb(hex: Hex): RGB {
  const h = normalizeHex(hex).slice(1);
  return {
    b: parseInt(h.slice(4, 6), 16),
    g: parseInt(h.slice(2, 4), 16),
    r: parseInt(h.slice(0, 2), 16),
  };
}
function rgbToHex({ r, g, b }: RGB): `#${string}` {
  const p = (n: number) => clamp255(n).toString(16).padStart(2, '0');
  return `#${p(r)}${p(g)}${p(b)}` as `#${string}`;
}
function rgbToHsl({ r, g, b }: RGB): HSL {
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
function srgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
function linearToSrgb(v: number): number {
  const x = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return clamp255(x * 255);
}
function rgbToXyz({ r, g, b }: RGB): { x: number; y: number; z: number } {
  const R = srgbToLinear(r),
    G = srgbToLinear(g),
    B = srgbToLinear(b);
  const x = R * 0.4124564 + G * 0.3575761 + B * 0.1804375;
  const y = R * 0.2126729 + G * 0.7151522 + B * 0.072175;
  const z = R * 0.0193339 + G * 0.119192 + B * 0.9503041;
  return { x, y, z };
}
function xyzToLab({ x, y, z }: { x: number; y: number; z: number }): LAB {
  const Xn = 0.95047,
    Yn = 1.0,
    Zn = 1.08883;
  const f = (t: number) => {
    const e = 216 / 24389;
    const k = 24389 / 27;
    return t > e ? Math.cbrt(t) : (t * k + 16) / 116;
  };
  const fx = f(x / Xn),
    fy = f(y / Yn),
    fz = f(z / Zn);
  return { a: 500 * (fx - fy), b: 200 * (fy - fz), l: 116 * fy - 16 };
}
function rgbToLab(rgb: RGB): LAB {
  return xyzToLab(rgbToXyz(rgb));
}

export interface ThemeColor {
  readonly hex: `#${string}`;
  readonly rgb: RGB;
  readonly hsl: HSL;
  readonly lab: LAB;
  toRgbCss(alpha?: number): string;
  toHslCss(alpha?: number): string;
  withAlpha(alpha: number): { hex: `#${string}`; rgb: string; hsl: string };
}
function makeColor(hex: Hex): ThemeColor {
  const _hex = normalizeHex(hex);
  let _rgb: RGB | null = null;
  let _hsl: HSL | null = null;
  let _lab: LAB | null = null;

  function ensureRgb(): RGB {
    if (_rgb === null) {
      _rgb = hexToRgb(_hex);
    }
    return _rgb;
  }

  function ensureHsl(): HSL {
    if (_hsl === null) {
      _hsl = rgbToHsl(ensureRgb());
    }
    return _hsl;
  }

  function ensureLab(): LAB {
    if (_lab === null) {
      _lab = rgbToLab(ensureRgb());
    }
    return _lab;
  }

  return {
    get hex() {
      return _hex;
    },
    get hsl() {
      return ensureHsl();
    },
    get lab() {
      return ensureLab();
    },
    get rgb() {
      return ensureRgb();
    },
    toHslCss(alpha?: number): string {
      const { h, s, l } = ensureHsl();
      const ss = Math.round(s * 100);
      const ll = Math.round(l * 100);
      if (alpha === undefined) return `hsl(${Math.round(h)} ${ss}% ${ll}%)`;
      return `hsla(${Math.round(h)}, ${ss}%, ${ll}%, ${clamp01(alpha)})`;
    },
    toRgbCss(alpha?: number): string {
      const { r, g, b } = ensureRgb();
      if (alpha === undefined) return `rgb(${r} ${g} ${b})`;
      return `rgba(${r}, ${g}, ${b}, ${clamp01(alpha)})`;
    },
    withAlpha(alpha: number) {
      const a = clamp01(alpha);
      const { r, g, b } = ensureRgb();
      const { h, s, l } = ensureHsl();
      return {
        hex: _hex,
        hsl: `hsla(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, ${a})`,
        rgb: `rgba(${r}, ${g}, ${b}, ${a})`,
      };
    },
  };
}

export interface Theme {
  readonly colors: {
    readonly brand: ThemeColor;
    readonly accent: ThemeColor;
    readonly surface: ThemeColor;
    readonly base: ThemeColor;
    readonly border: ThemeColor;
    readonly status: {
      readonly warning: ThemeColor;
      readonly info: ThemeColor;
      readonly danger: ThemeColor;
      readonly note: ThemeColor;
    };
  };
  readonly radii: z.infer<typeof RadiiSchema>;
  readonly opacity: z.infer<typeof OpacitySchema>;
  readonly animation: z.infer<typeof AnimationSchema>;
}

export function createTheme(input: ThemeInput): Theme {
  const parsed = ThemeInputSchema.parse(input);
  const c = parsed.colors;
  return {
    animation: parsed.animation,
    colors: {
      accent: makeColor(c.accent),
      base: makeColor(c.base),
      border: makeColor(c.border),
      brand: makeColor(c.brand),
      status: {
        danger: makeColor(c.status.danger),
        info: makeColor(c.status.info),
        note: makeColor(c.status.note),
        warning: makeColor(c.status.warning),
      },
      surface: makeColor(c.surface),
    },
    opacity: parsed.opacity,
    radii: parsed.radii,
  };
}

/** Default theme (semantic names). */
export const theme: Theme = createTheme({
  animation: {
    durations: { base: 200, fast: 120, slow: 320, slower: 480 },
    easing: {
      in: 'cubic-bezier(0.4, 0.0, 1, 1)',
      inOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      out: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    },
    names: {
      fade: 'fade',
      scaleIn: 'scale-in',
      slideDown: 'slide-down',
      slideUp: 'slide-up',
    },
  },
  colors: {
    accent: '#0ea5e9',
    base: '#0b1020',
    border: '#334155',
    brand: '#ff5500',
    status: {
      danger: '#ef4444',
      info: '#3b82f6',
      note: '#22c55e',
      warning: '#f59e0b',
    },
    surface: '#f8fafc',
  },
  opacity: { heavy: 0.7, medium: 0.28, soft: 0.15, strong: 0.45, subtle: 0.08 },
  radii: {
    lg: '12px',
    md: '6px',
    none: '0px',
    pill: '9999px',
    sm: '2px',
    xl: '20px',
  },
});

/* ---------- Tailwind v4 token generator ---------- */
function hslCss(h: number, s: number, l: number): string {
  return `hsl(${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`;
}

export function generateTailwindThemeCss(t: Theme): string {
  const c = t.colors;
  const asHsl = (tc: ThemeColor) => hslCss(tc.hsl.h, tc.hsl.s, tc.hsl.l);
  const d = t.animation.durations;
  const duration = {
    base: `${d.base}ms`,
    fast: `${d.fast}ms`,
    slow: `${d.slow}ms`,
    slower: `${d.slower}ms`,
  };
  const easing = t.animation.easing;

  return `
/* Generated from @utils/theme — do not edit by hand */
@theme {
  /* Colors */
  --color-brand: ${asHsl(c.brand)};
  --color-accent: ${asHsl(c.accent)};
  --color-surface: ${asHsl(c.surface)};
  --color-base: ${asHsl(c.base)};
  --color-border: ${asHsl(c.border)};
  --color-warning: ${asHsl(c.status.warning)};
  --color-info: ${asHsl(c.status.info)};
  --color-danger: ${asHsl(c.status.danger)};
  --color-note: ${asHsl(c.status.note)};

  /* Radii */
  --radius-none: ${t.radii.none};
  --radius-sm: ${t.radii.sm};
  --radius-md: ${t.radii.md};
  --radius-lg: ${t.radii.lg};
  --radius-xl: ${t.radii.xl};
  --radius-pill: ${t.radii.pill};

  /* Opacity */
  --opacity-subtle: ${t.opacity.subtle};
  --opacity-soft: ${t.opacity.soft};
  --opacity-medium: ${t.opacity.medium};
  --opacity-strong: ${t.opacity.strong};
  --opacity-heavy: ${t.opacity.heavy};

  /* Easing */
  --ease-in: ${easing.in};
  --ease-out: ${easing.out};
  --ease-in-out: ${easing.inOut};

  /* Durations */
  --duration-fast: ${duration.fast};
  --duration-base: ${duration.base};
  --duration-slow: ${duration.slow};
  --duration-slower: ${duration.slower};

  /* Animation shorthands */
  --animate-fade: fade var(--duration-base) var(--ease-out) both;
  --animate-slide-up: slide-up var(--duration-base) var(--ease-out) both;
  --animate-slide-down: slide-down var(--duration-base) var(--ease-out) both;
  --animate-scale-in: scale-in var(--duration-base) var(--ease-out) both;
}

/* Keyframes */
@keyframes fade {
  from { opacity: 0 }
  to { opacity: 1 }
}
@keyframes slide-up {
  from { transform: translateY(8px); opacity: 0 }
  to { transform: translateY(0); opacity: 1 }
}
@keyframes slide-down {
  from { transform: translateY(-8px); opacity: 0 }
  to { transform: translateY(0); opacity: 1 }
}
@keyframes scale-in {
  from { transform: scale(0.96); opacity: 0 }
  to { transform: scale(1); opacity: 1 }
}
`.trimStart();
}
