// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { hexToRgb } from './color.ts';
import {
  contrastRatio,
  heroTintForImageColors,
  relativeLuminance,
} from './hero-tint.ts';

const LIGHT_BACKGROUND_LUMINANCE = relativeLuminance(hexToRgb('#fbfbf9'));
const DARK_BACKGROUND_LUMINANCE = relativeLuminance(hexToRgb('#0c0c09'));
const TARGET_CONTRAST_RATIO = 5.5;

function compositeOverImage(
  image: { r: number; g: number; b: number },
  tint: { r: number; g: number; b: number },
  opacity: number,
) {
  return {
    b: tint.b * opacity + image.b * (1 - opacity),
    g: tint.g * opacity + image.g * (1 - opacity),
    r: tint.r * opacity + image.r * (1 - opacity),
  };
}

describe('relativeLuminance', () => {
  it('rates white higher than black', () => {
    expect(relativeLuminance({ b: 255, g: 255, r: 255 })).toBeCloseTo(1, 5);
    expect(relativeLuminance({ b: 0, g: 0, r: 0 })).toBeCloseTo(0, 5);
  });
});

describe('contrastRatio', () => {
  it('is order-independent and maxes out for black on white', () => {
    expect(contrastRatio(1, 0)).toBeCloseTo(21, 1);
    expect(contrastRatio(0, 1)).toBeCloseTo(21, 1);
    expect(contrastRatio(0.5, 0.5)).toBeCloseTo(1, 5);
  });
});

describe('heroTintForImageColors', () => {
  it('reaches target contrast against both theme backgrounds for a uniformly dark photo', () => {
    const darkRegion = { b: 20, g: 25, r: 18 };
    const lightRegion = { b: 30, g: 35, r: 28 };
    const tint = heroTintForImageColors({ darkRegion, lightRegion });

    const lightGlyph = compositeOverImage(
      lightRegion,
      hexToRgb(tint.light.tintColor),
      tint.light.tintOpacity,
    );
    const darkGlyph = compositeOverImage(
      darkRegion,
      hexToRgb(tint.dark.tintColor),
      tint.dark.tintOpacity,
    );

    expect(
      contrastRatio(relativeLuminance(lightGlyph), LIGHT_BACKGROUND_LUMINANCE),
    ).toBeGreaterThanOrEqual(TARGET_CONTRAST_RATIO - 0.05);
    expect(
      contrastRatio(relativeLuminance(darkGlyph), DARK_BACKGROUND_LUMINANCE),
    ).toBeGreaterThanOrEqual(TARGET_CONTRAST_RATIO - 0.05);
  });

  it('reaches target contrast against both theme backgrounds for a uniformly light photo', () => {
    const darkRegion = { b: 220, g: 225, r: 222 };
    const lightRegion = { b: 230, g: 235, r: 232 };
    const tint = heroTintForImageColors({ darkRegion, lightRegion });

    const lightGlyph = compositeOverImage(
      lightRegion,
      hexToRgb(tint.light.tintColor),
      tint.light.tintOpacity,
    );
    const darkGlyph = compositeOverImage(
      darkRegion,
      hexToRgb(tint.dark.tintColor),
      tint.dark.tintOpacity,
    );

    expect(
      contrastRatio(relativeLuminance(lightGlyph), LIGHT_BACKGROUND_LUMINANCE),
    ).toBeGreaterThanOrEqual(TARGET_CONTRAST_RATIO - 0.05);
    expect(
      contrastRatio(relativeLuminance(darkGlyph), DARK_BACKGROUND_LUMINANCE),
    ).toBeGreaterThanOrEqual(TARGET_CONTRAST_RATIO - 0.05);
  });

  it("reaches target contrast against a very dark worst-case patch (this site's own header photo)", () => {
    // Roughly matches src/assets/images/headline/20260913.jpg's own
    // 5th/95th luminance-percentile colours (a near-black forest photo).
    const darkRegion = { b: 9, g: 16, r: 10 };
    const lightRegion = { b: 17, g: 71, r: 46 };
    const tint = heroTintForImageColors({ darkRegion, lightRegion });

    const darkGlyph = compositeOverImage(
      darkRegion,
      hexToRgb(tint.dark.tintColor),
      tint.dark.tintOpacity,
    );
    expect(
      contrastRatio(relativeLuminance(darkGlyph), DARK_BACKGROUND_LUMINANCE),
    ).toBeGreaterThanOrEqual(TARGET_CONTRAST_RATIO - 0.05);
  });

  it('never drops below the minimum opacity or exceeds the maximum', () => {
    for (const region of [
      { b: 0, g: 0, r: 0 },
      { b: 255, g: 255, r: 255 },
      { b: 128, g: 128, r: 128 },
    ]) {
      const tint = heroTintForImageColors({
        darkRegion: region,
        lightRegion: region,
      });
      expect(tint.light.tintOpacity).toBeGreaterThanOrEqual(0.1);
      expect(tint.light.tintOpacity).toBeLessThanOrEqual(0.95);
      expect(tint.dark.tintOpacity).toBeGreaterThanOrEqual(0.1);
      expect(tint.dark.tintOpacity).toBeLessThanOrEqual(0.95);
    }
  });

  it('keeps the minimum opacity when the image is already high-contrast', () => {
    // Very dark image: already contrasts well against the light background
    // even before adding much tint.
    const region = { b: 5, g: 5, r: 5 };
    const tint = heroTintForImageColors({
      darkRegion: region,
      lightRegion: region,
    });
    expect(tint.light.tintOpacity).toBeCloseTo(0.1, 5);
  });
});
