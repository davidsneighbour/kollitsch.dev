// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  COLOPHON_FRONT_FULL,
  COLOPHON_FRONT_REST,
  colophonDirection,
  colophonSettled,
  colophonSide,
} from './colophon-direction.pure.ts';

describe('colophonSide', () => {
  it('splits the word at its horizontal centre', () => {
    expect(colophonSide(100, 0, 1000)).toBe('left');
    expect(colophonSide(499, 0, 1000)).toBe('left');
    expect(colophonSide(500, 0, 1000)).toBe('right');
    expect(colophonSide(1200, 300, 1000)).toBe('right');
  });

  it('falls back to the left without a usable box or position', () => {
    expect(colophonSide(100, 0, 0)).toBe('left');
    expect(colophonSide(Number.NaN, 0, 1000)).toBe('left');
  });
});

describe('colophonSettled', () => {
  it('is settled at rest before entering and at full colour before leaving', () => {
    expect(colophonSettled(COLOPHON_FRONT_REST, 'enter')).toBe(true);
    expect(colophonSettled(COLOPHON_FRONT_FULL, 'leave')).toBe(true);
  });

  it('is not settled while a flood or drain is still running', () => {
    expect(colophonSettled(40, 'enter')).toBe(false);
    expect(colophonSettled(40, 'leave')).toBe(false);
  });

  it('treats an unreadable value as settled', () => {
    expect(colophonSettled(Number.NaN, 'enter')).toBe(true);
  });
});

describe('colophonDirection', () => {
  it('follows the pointer side when the effect is settled', () => {
    expect(colophonDirection('left', 'right', true)).toBe('right');
    expect(colophonDirection('right', 'left', true)).toBe('left');
  });

  it('keeps the running direction so the edge does not jump', () => {
    expect(colophonDirection('left', 'right', false)).toBe('left');
    expect(colophonDirection('right', 'left', false)).toBe('right');
  });
});
