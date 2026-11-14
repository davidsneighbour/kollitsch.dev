// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  footerMarkInitialState,
  footerMarkRootMargin,
} from './footer-mark.pure.ts';

const below = {
  canObserve: true,
  reduceMotion: false,
  targetTop: 2400,
  viewportHeight: 900,
};

describe('footerMarkInitialState', () => {
  it('waits for the entrance while the footer is below the viewport', () => {
    expect(footerMarkInitialState(below)).toBe('pending');
    expect(footerMarkInitialState({ ...below, targetTop: 900 })).toBe(
      'pending',
    );
  });

  it('shows the mark at once when the footer is already on screen', () => {
    expect(footerMarkInitialState({ ...below, targetTop: 899 })).toBe('shown');
    expect(footerMarkInitialState({ ...below, targetTop: -300 })).toBe('shown');
  });

  it('shows the mark without an entrance under reduced motion', () => {
    expect(footerMarkInitialState({ ...below, reduceMotion: true })).toBe(
      'shown',
    );
  });

  it('shows the mark when the browser cannot observe the footer', () => {
    expect(footerMarkInitialState({ ...below, canObserve: false })).toBe(
      'shown',
    );
  });
});

describe('footerMarkRootMargin', () => {
  it('keeps the entrance below the sticky header when scrolling up', () => {
    // 57px header + 15% of 900px.
    expect(footerMarkRootMargin(57, 900)).toBe('-192px 0px -15% 0px');
  });

  it('uses only the 15% inset without a header', () => {
    expect(footerMarkRootMargin(0, 900)).toBe('-135px 0px -15% 0px');
    expect(footerMarkRootMargin(Number.NaN, 900)).toBe('-135px 0px -15% 0px');
  });

  it('keeps a quarter of a short viewport observable', () => {
    // A tall header on a 400px viewport would leave no observable area.
    expect(footerMarkRootMargin(300, 400)).toBe('-240px 0px -15% 0px');
  });

  it('falls back to no top inset without a usable viewport height', () => {
    expect(footerMarkRootMargin(57, 0)).toBe('0px 0px -15% 0px');
  });
});
