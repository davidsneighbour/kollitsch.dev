// Central theme definition and Tailwind token generator.
import {
  assertHex,
  clamp01,
  type Hex,
  type HSL,
  hexToRgb,
  hslCss,
  isHexColor,
  type LAB,
  normalizeHex,
  type RGB,
  rgbCss,
  rgbToHsl,
  rgbToLab,
} from '@utils/color.ts';
import { z } from 'astro/zod';
import { readFile } from 'node:fs/promises';
import { resolve as resolvePath } from 'node:path';

/* -------------------------------------------------------------------------- */
/*                                  SCHEMAS                                   */
/* -------------------------------------------------------------------------- */

const HexColor = z
  .string()
  .refine(isHexColor, { message: 'Expect hex like #09f or #0099ff' });

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

/* -------------------------------------------------------------------------- */
/*                                COLOR OBJECTS                               */
/* -------------------------------------------------------------------------- */

export interface ThemeColor {
  readonly hex: `#${string}`;
  readonly rgb: RGB;
  readonly hsl: HSL;
  readonly lab: LAB;
  toRgbCss(alpha?: number): string;
  toHslCss(alpha?: number): string;
  withAlpha(alpha: number): { hex: `#${string}`; rgb: string; hsl: string };
}

/** Construct a color with lazy conversions and typed helpers. */
function makeColor(hex: Hex): ThemeColor {
  const _hex = normalizeHex(hex);
  let _rgb: RGB | null = null;
  let _hsl: HSL | null = null;
  let _lab: LAB | null = null;

  function ensureRgb(): RGB {
    if (_rgb === null) _rgb = hexToRgb(_hex);
    return _rgb;
  }
  function ensureHsl(): HSL {
    if (_hsl === null) _hsl = rgbToHsl(ensureRgb());
    return _hsl;
  }
  function ensureLab(): LAB {
    if (_lab === null) _lab = rgbToLab(ensureRgb());
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
    toHslCss(alpha?: number) {
      return hslCss(ensureHsl(), alpha);
    },
    toRgbCss(alpha?: number) {
      return rgbCss(ensureRgb(), alpha);
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

/* -------------------------------------------------------------------------- */
/*                                   THEME                                    */
/* -------------------------------------------------------------------------- */

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

  assertHex(c.brand);
  assertHex(c.accent);
  assertHex(c.surface);
  assertHex(c.base);
  assertHex(c.border);
  assertHex(c.status.warning);
  assertHex(c.status.info);
  assertHex(c.status.danger);
  assertHex(c.status.note);

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

/* -------------------------------------------------------------------------- */
/*                           DEFAULT THEME INPUT                              */
/* -------------------------------------------------------------------------- */

export const DEFAULT_THEME_INPUT: ThemeInput = {
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
};

/* Keep existing default export behaviour */
export const theme: Theme = createTheme(DEFAULT_THEME_INPUT);

/* -------------------------------------------------------------------------- */
/*                       JSON CONFIG LOADING HELPERS (NEW)                    */
/* -------------------------------------------------------------------------- */

/** A recursive DeepPartial helper without using any. */
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
  ? T[K] extends Array<unknown>
  ? T[K]
  : DeepPartial<T[K]>
  : T[K];
};

/** Merge a partial ThemeInput into a base ThemeInput (field-wise deep merge). */
function mergeThemeInput(
  base: ThemeInput,
  override: DeepPartial<ThemeInput>,
): ThemeInput {
  const merged: ThemeInput = {
    animation: {
      durations: {
        base: override.animation?.durations?.base ?? base.animation.durations.base,
        fast: override.animation?.durations?.fast ?? base.animation.durations.fast,
        slow: override.animation?.durations?.slow ?? base.animation.durations.slow,
        slower:
          override.animation?.durations?.slower ?? base.animation.durations.slower,
      },
      easing: {
        in: override.animation?.easing?.in ?? base.animation.easing.in,
        inOut: override.animation?.easing?.inOut ?? base.animation.easing.inOut,
        out: override.animation?.easing?.out ?? base.animation.easing.out,
      },
      names: {
        fade: override.animation?.names?.fade ?? base.animation.names.fade,
        scaleIn:
          override.animation?.names?.scaleIn ?? base.animation.names.scaleIn,
        slideDown:
          override.animation?.names?.slideDown ?? base.animation.names.slideDown,
        slideUp:
          override.animation?.names?.slideUp ?? base.animation.names.slideUp,
      },
    },
    colors: {
      accent: override.colors?.accent ?? base.colors.accent,
      base: override.colors?.base ?? base.colors.base,
      border: override.colors?.border ?? base.colors.border,
      brand: override.colors?.brand ?? base.colors.brand,
      surface: override.colors?.surface ?? base.colors.surface,
      status: {
        warning: override.colors?.status?.warning ?? base.colors.status.warning,
        info: override.colors?.status?.info ?? base.colors.status.info,
        danger: override.colors?.status?.danger ?? base.colors.status.danger,
        note: override.colors?.status?.note ?? base.colors.status.note,
      },
    },
    opacity: {
      heavy: override.opacity?.heavy ?? base.opacity.heavy,
      medium: override.opacity?.medium ?? base.opacity.medium,
      soft: override.opacity?.soft ?? base.opacity.soft,
      strong: override.opacity?.strong ?? base.opacity.strong,
      subtle: override.opacity?.subtle ?? base.opacity.subtle,
    },
    radii: {
      lg: override.radii?.lg ?? base.radii.lg,
      md: override.radii?.md ?? base.radii.md,
      none: override.radii?.none ?? base.radii.none,
      pill: override.radii?.pill ?? base.radii.pill,
      sm: override.radii?.sm ?? base.radii.sm,
      xl: override.radii?.xl ?? base.radii.xl,
    },
  };

  // Validate merged object with Zod to ensure completeness and correctness.
  return ThemeInputSchema.parse(merged);
}

/**
 * Read and parse a JSON file as UTF-8.
 * @throws if the file cannot be read or parsed.
 */
async function readJsonFile<T>(filePath: string): Promise<T> {
  const raw = await readFile(filePath, 'utf8');
  return JSON.parse(raw) as T;
}

/**
 * Create a Theme from a JSON config, merged over the default input.
 * Use when you want a hard failure if the file is missing or invalid.
 */
export async function createThemeFromJson(filePath: string): Promise<Theme> {
  const absolute = resolvePath(filePath);
  const partial = await readJsonFile<DeepPartial<ThemeInput>>(absolute);
  const merged = mergeThemeInput(DEFAULT_THEME_INPUT, partial);
  return createTheme(merged);
}

/**
 * Try to create a Theme from a JSON config.
 * If the file does not exist or is invalid, return the default theme.
 */
export async function tryCreateThemeFromJson(
  filePath?: string,
): Promise<Theme> {
  if (!filePath) return theme;
  try {
    return await createThemeFromJson(filePath);
  } catch {
    return theme;
  }
}

/* -------------------------------------------------------------------------- */
/*                         TAILWIND v4 TOKEN GENERATOR                         */
/* -------------------------------------------------------------------------- */

export function generateTailwindThemeCss(t: Theme): string {
  const c = t.colors;
  const asHsl = (tc: ThemeColor) => hslCss(tc.hsl);
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
