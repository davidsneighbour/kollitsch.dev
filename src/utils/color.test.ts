import {
  HEX_COLOR_RE,
  hexToRgb,
  hslCss,
  hslToRgb,
  isHexColor,
  normalizeHex,
  rgbCss,
  rgbToHex,
  rgbToHsl,
  rgbToLab,
} from '@utils/color.ts';
import { describe, expect, it } from 'vitest';

describe('color utils', () => {
  it('HEX_COLOR_RE matches #RGB and #RRGGBB', () => {
    const good = ['#000', '#fff', '#09f', '#0099ff', '#FF5500', '#334155'];
    const bad = ['0099ff', '#0', '#00', '#0000', '#zzzzzz', '#12345g'];
    for (const v of good) expect(HEX_COLOR_RE.test(v)).toBe(true);
    for (const v of bad) expect(HEX_COLOR_RE.test(v)).toBe(false);
  });

  it('isHexColor acts as a type guard and normalizeHex expands #RGB', () => {
    const s = '#09f';
    expect(isHexColor(s)).toBe(true);
    expect(normalizeHex(s)).toBe('#0099ff');
  });

  it('hex <-> rgb roundtrip', () => {
    const samples = [
      '#000000',
      '#ffffff',
      '#ff5500',
      '#0ea5e9',
      '#334155',
    ] as const;
    for (const hex of samples) {
      const rgb = hexToRgb(hex);
      const rt = rgbToHex(rgb);
      expect(rt).toBe(hex);
    }
  });

  it('rgb <-> hsl is roughly invertible (tolerant)', () => {
    const rgb = { b: 0, g: 85, r: 255 };
    const hsl = rgbToHsl(rgb);
    const back = hslToRgb(hsl);
    const delta = (a: number, b: number) => Math.abs(a - b);
    expect(delta(back.r, rgb.r)).toBeLessThanOrEqual(2);
    expect(delta(back.g, rgb.g)).toBeLessThanOrEqual(2);
    expect(delta(back.b, rgb.b)).toBeLessThanOrEqual(2);
  });

  it('rgb -> lab yields reasonable values', () => {
    const lab = rgbToLab({ b: 0, g: 85, r: 255 });
    expect(lab.l).toBeGreaterThan(0);
    expect(Number.isFinite(lab.a)).toBe(true);
    expect(Number.isFinite(lab.b)).toBe(true);
  });

  it('css helpers format correctly', () => {
    expect(rgbCss({ b: 3, g: 2, r: 1 })).toBe('rgb(1 2 3)');
    expect(rgbCss({ b: 3, g: 2, r: 1 }, 0.5)).toBe('rgba(1, 2, 3, 0.5)');
    const hsl = { h: 200, l: 0.4, s: 0.5 };
    expect(hslCss(hsl)).toBe('hsl(200 50% 40%)');
    expect(hslCss(hsl, 0.25)).toBe('hsla(200, 50%, 40%, 0.25)');
  });
});
