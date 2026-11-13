// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { pupilOffset } from './FooterEyes';

describe('footer pupil boundaries', () => {
  it('keeps close targets at their actual position', () => {
    expect(pupilOffset(0, 0)).toEqual({ x: 0, y: 0 });
    expect(pupilOffset(2, -1)).toEqual({ x: 2, y: -1 });
  });
  it('keeps distant targets inside the eye white in every direction', () => {
    for (const dx of [-10000, -100, 0, 100, 10000]) {
      for (const dy of [-10000, -100, 0, 100, 10000]) {
        const { x, y } = pupilOffset(dx, dy);
        expect(Math.hypot(x / 8, y / 4.5)).toBeLessThanOrEqual(1.000001);
        if (dx) expect(Math.sign(x)).toBe(Math.sign(dx));
        if (dy) expect(Math.sign(y)).toBe(Math.sign(dy));
      }
    }
  });
});
