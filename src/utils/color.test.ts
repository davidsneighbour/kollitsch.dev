import { describe, expect, it } from 'vitest';

import {
  assertHex,
  clamp01,
  clamp255,
  HEX_COLOR_RE,
  type Hex,
  hexToRgb,
  hslCss,
  hslToRgb,
  isHexColor,
  linearToSrgb,
  type NormalizedHexColor,
  normalizeHex,
  type RGB,
  rgbCss,
  rgbToHex,
  rgbToHsl,
  rgbToLab,
  xyzToLab,
} from './color.ts';

describe('hex validation', () => {
  it('matches expected patterns', () => {
    expect(isHexColor('#abc')).toBe(true);
    expect(isHexColor('#aabbcc')).toBe(true);
    expect(isHexColor('#ABCDEF')).toBe(true);
    expect(isHexColor('#abcd')).toBe(false);
    expect(isHexColor('abc')).toBe(false);
    expect('#aabbcc').toMatch(HEX_COLOR_RE);
  });

  it('asserts valid hexadecimal strings', () => {
    const value: string = '#09f';
    assertHex(value);
    const narrowed: Hex = value;
    expect(narrowed).toBe('#09f');
    expect(() => assertHex('#xyz')).toThrow(TypeError);
    // @ts-expect-error -- Missing leading # symbol should be rejected at compile-time
    const invalid: Hex = 'fff';
    expect(invalid).toBe('fff');
  });

  it('normalises to lowercase #rrggbb', () => {
    expect(normalizeHex('#abc')).toBe('#aabbcc');
    expect(normalizeHex('#ABCDEF')).toBe('#abcdef');
    expect(() => normalizeHex('nope')).toThrow(TypeError);
  });
});

describe('clamping helpers', () => {
  it('clamps to [0, 1]', () => {
    expect(clamp01(0.5)).toBe(0.5);
    expect(clamp01(-3)).toBe(0);
    expect(clamp01(2)).toBe(1);
    expect(() => clamp01(Number.NaN)).toThrow(TypeError);
  });

  it('clamps to [0, 255] with rounding', () => {
    expect(clamp255(127.6)).toBe(128);
    expect(clamp255(-10)).toBe(0);
    expect(clamp255(500)).toBe(255);
    expect(() => clamp255(Number.POSITIVE_INFINITY)).toThrow(TypeError);
  });
});

describe('hex and rgb conversions', () => {
  it('converts hex to rgb and back', () => {
    const rgb = hexToRgb('#ff9900');
    expect(rgb).toEqual({ b: 0, g: 153, r: 255 });
    const hex: NormalizedHexColor = rgbToHex(rgb);
    expect(hex).toBe('#ff9900');
  });

  it('supports short hexadecimal strings', () => {
    const rgb = hexToRgb('#0af');
    expect(rgb).toEqual({ b: 255, g: 170, r: 0 });
    expect(rgbToHex(rgb)).toBe('#00aaff');
  });

  it('rejects invalid hexadecimal inputs', () => {
    expect(() => hexToRgb('oops')).toThrow(TypeError);
  });
});

describe('rgb ↔ hsl conversions', () => {
  const canonical: Array<{
    hsl: { h: number; l: number; s: number };
    rgb: RGB;
  }> = [
    {
      hsl: { h: 0, l: 0.5, s: 1 },
      rgb: { b: 0, g: 0, r: 255 },
    },
    {
      hsl: { h: 120, l: 0.5, s: 1 },
      rgb: { b: 0, g: 255, r: 0 },
    },
    {
      hsl: { h: 240, l: 0.5, s: 1 },
      rgb: { b: 255, g: 0, r: 0 },
    },
    {
      hsl: { h: 0, l: 1, s: 0 },
      rgb: { b: 255, g: 255, r: 255 },
    },
    {
      hsl: { h: 0, l: 0, s: 0 },
      rgb: { b: 0, g: 0, r: 0 },
    },
  ];

  it('round-trips primary colors', () => {
    for (const { rgb, hsl } of canonical) {
      const converted = rgbToHsl(rgb);
      expect(converted.h).toBeCloseTo(hsl.h, 5);
      expect(converted.s).toBeCloseTo(hsl.s, 5);
      expect(converted.l).toBeCloseTo(hsl.l, 5);
      expect(hslToRgb(hsl)).toEqual(rgb);
    }
  });

  it('handles greyscale values with zero saturation', () => {
    expect(rgbToHsl({ b: 128, g: 128, r: 128 })).toEqual({
      h: 0,
      l: 0.5019607843137255,
      s: 0,
    });
  });

  it('covers each hue sector in hslToRgb', () => {
    const sectors: Array<[number, RGB]> = [
      [0, { b: 0, g: 0, r: 255 }],
      [60, { b: 0, g: 255, r: 255 }],
      [120, { b: 0, g: 255, r: 0 }],
      [180, { b: 255, g: 255, r: 0 }],
      [240, { b: 255, g: 0, r: 0 }],
      [300, { b: 255, g: 0, r: 255 }],
    ];
    for (const [hue, expected] of sectors) {
      const result = hslToRgb({ h: hue, l: 0.5, s: 1 });
      expect(result).toEqual(expected);
    }
  });
});

describe('css helpers', () => {
  it('formats rgb and rgba strings', () => {
    expect(rgbCss({ b: 56, g: 34, r: 12 })).toBe('rgb(12 34 56)');
    expect(rgbCss({ b: 56, g: 34, r: 12 }, 1.2)).toBe('rgba(12, 34, 56, 1)');
  });

  it('formats hsl and hsla strings with canonical ranges', () => {
    expect(hslCss({ h: -150, l: -0.2, s: 1.2 })).toBe('hsl(210 100% 0%)');
    expect(hslCss({ h: 420, l: 0.5, s: 0.25 }, 0.75)).toBe(
      'hsla(60, 25%, 50%, 0.75)',
    );
  });

  it('validates component finiteness', () => {
    expect(() => rgbCss({ b: 0, g: 0, r: Number.NaN })).toThrow(TypeError);
    expect(() => hslCss({ h: 0, l: 0, s: Number.NaN })).toThrow(TypeError);
    expect(() => rgbCss({ b: 0, g: 0, r: 0 }, Number.NaN)).toThrow(TypeError);
  });
});

describe('linear conversions', () => {
  it('converts XYZ to Lab using the D65 white point', () => {
    const lab = xyzToLab({ x: 0.95047, y: 1, z: 1.08883 });
    expect(lab.l).toBeCloseTo(100, 5);
    expect(lab.a).toBeCloseTo(0, 5);
    expect(lab.b).toBeCloseTo(0, 5);
  });

  it('converts rgb to lab via xyz', () => {
    const lab = rgbToLab({ b: 255, g: 255, r: 255 });
    expect(lab.l).toBeGreaterThan(99);
    expect(Math.abs(lab.a)).toBeLessThan(1);
    expect(Math.abs(lab.b)).toBeLessThan(1.5);
  });

  it('converts linear light to srgb channel values', () => {
    expect(linearToSrgb(0)).toBe(0);
    expect(linearToSrgb(1)).toBe(255);
    expect(linearToSrgb(0.5)).toBe(188);
    expect(() => linearToSrgb(Number.NaN)).toThrow(TypeError);
  });
});
