import { describe, expect, it } from 'vitest';
import { footerMarkInitialState } from './footer-mark.pure.ts';

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
