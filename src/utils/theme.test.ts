// @vitest-environment node
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  createTheme,
  createThemeFromJson,
  DEFAULT_THEME_INPUT,
  generateTailwindThemeCss,
  type ThemeInput,
  theme,
  tryCreateThemeFromJson,
} from './theme.ts';

describe('createTheme', () => {
  it('builds ThemeColor objects with hex/rgb/hsl/lab conversions', () => {
    const t = createTheme(DEFAULT_THEME_INPUT);
    expect(t.colors.brand.hex).toBe('#ff5500');
    expect(t.colors.brand.rgb).toEqual({ b: 0, g: 85, r: 255 });
    expect(t.colors.brand.toRgbCss()).toBe('rgb(255 85 0)');
    expect(t.colors.brand.toHslCss()).toMatch(/^hsl\(/);
  });

  it('carries through radii, opacity and animation settings unchanged', () => {
    const t = createTheme(DEFAULT_THEME_INPUT);
    expect(t.radii).toEqual(DEFAULT_THEME_INPUT.radii);
    expect(t.opacity).toEqual(DEFAULT_THEME_INPUT.opacity);
    expect(t.animation).toEqual(DEFAULT_THEME_INPUT.animation);
  });

  it('applies per-field schema defaults when radii/opacity/animation are given as empty objects', () => {
    const t = createTheme({
      animation: { durations: {}, easing: {}, names: {} },
      colors: DEFAULT_THEME_INPUT.colors,
      opacity: {},
      radii: {},
    } as never);
    expect(t.radii.md).toBe('6px');
    expect(t.opacity.subtle).toBe(0.08);
    expect(t.animation.durations.base).toBe(200);
  });

  // NOTE: unlike radii/opacity, AnimationSchema's own `.default()` factory
  // calls `AnimationSchema.parse({})`, but `durations`/`easing`/`names` are
  // required *objects* on that schema (only their own fields have defaults),
  // so omitting `animation` entirely throws instead of falling back.
  it('throws when animation/opacity/radii are omitted entirely, rather than defaulting', () => {
    expect(() =>
      createTheme({ colors: DEFAULT_THEME_INPUT.colors } as never),
    ).toThrow();
  });

  it('rejects an invalid hex color via zod validation', () => {
    expect(() =>
      createTheme({
        ...DEFAULT_THEME_INPUT,
        colors: {
          ...DEFAULT_THEME_INPUT.colors,
          brand: 'not-a-color' as ThemeInput['colors']['brand'],
        },
      }),
    ).toThrow();
  });

  it('withAlpha() returns hex/rgb/hsl strings carrying the given alpha', () => {
    const t = createTheme(DEFAULT_THEME_INPUT);
    const withAlpha = t.colors.brand.withAlpha(0.5);
    expect(withAlpha.hex).toBe('#ff5500');
    expect(withAlpha.rgb).toBe('rgba(255, 85, 0, 0.5)');
    expect(withAlpha.hsl).toMatch(/^hsla\(/);
  });
});

describe('theme (default export)', () => {
  it('is built from DEFAULT_THEME_INPUT', () => {
    expect(theme.colors.brand.hex).toBe(
      DEFAULT_THEME_INPUT.colors.brand.toLowerCase(),
    );
  });
});

describe('generateTailwindThemeCss', () => {
  it('emits an @theme block containing every color, radius, opacity and duration token', () => {
    const css = generateTailwindThemeCss(theme);
    expect(css).toContain('@theme {');
    expect(css).toContain('--color-brand:');
    expect(css).toContain('--radius-md: 6px;');
    expect(css).toContain('--opacity-subtle: 0.08;');
    expect(css).toContain('--duration-base: 200ms;');
    expect(css).toContain('--ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);');
  });

  it('includes fade/slide/scale keyframes', () => {
    const css = generateTailwindThemeCss(theme);
    expect(css).toContain('@keyframes fade');
    expect(css).toContain('@keyframes slide-up');
    expect(css).toContain('@keyframes slide-down');
    expect(css).toContain('@keyframes scale-in');
  });
});

describe('createThemeFromJson / tryCreateThemeFromJson', () => {
  let dir: string;

  afterEach(async () => {
    if (dir) await rm(dir, { force: true, recursive: true });
  });

  it('merges a partial JSON config over the default theme', async () => {
    dir = await mkdtemp(join(tmpdir(), 'theme-test-'));
    const file = join(dir, 'theme.json');
    await writeFile(
      file,
      JSON.stringify({ colors: { brand: '#123456' } }),
      'utf8',
    );

    const t = await createThemeFromJson(file);
    expect(t.colors.brand.hex).toBe('#123456');
    // Unspecified colors fall back to the defaults.
    expect(t.colors.accent.hex).toBe(
      DEFAULT_THEME_INPUT.colors.accent.toLowerCase(),
    );
  });

  it('createThemeFromJson throws for a missing file', async () => {
    await expect(
      createThemeFromJson('/nonexistent/theme.json'),
    ).rejects.toThrow();
  });

  it('tryCreateThemeFromJson falls back to the default theme on a missing file', async () => {
    const t = await tryCreateThemeFromJson('/nonexistent/theme.json');
    expect(t).toBe(theme);
  });

  it('tryCreateThemeFromJson returns the default theme when no path is given', async () => {
    const t = await tryCreateThemeFromJson();
    expect(t).toBe(theme);
  });

  it('tryCreateThemeFromJson falls back to the default theme for invalid JSON content', async () => {
    dir = await mkdtemp(join(tmpdir(), 'theme-test-'));
    const file = join(dir, 'bad.json');
    await writeFile(file, 'not json', 'utf8');

    const t = await tryCreateThemeFromJson(file);
    expect(t).toBe(theme);
  });
});
