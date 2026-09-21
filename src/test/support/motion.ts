import type { Locator } from '@playwright/test';

export interface MotionSnapshot {
  animationName: string;
  opacity: string;
  transform: string;
  transitionDuration: string;
  transitionProperty: string;
}

/**
 * Reads the computed motion-related styles of an element (or one of its
 * pseudo-elements), for asserting the `prefers-reduced-motion` contract
 * without depending on animation timing.
 */
export async function getMotionStyles(
  locator: Locator,
  pseudoElement?: string,
): Promise<MotionSnapshot> {
  return locator.evaluate((element, pseudo) => {
    const styles = pseudo
      ? getComputedStyle(element, pseudo)
      : getComputedStyle(element);
    return {
      animationName: styles.animationName,
      opacity: styles.opacity,
      transform: styles.transform,
      transitionDuration: styles.transitionDuration,
      transitionProperty: styles.transitionProperty,
    };
  }, pseudoElement);
}

/**
 * `transition-duration`/`transition-property` resolve to one comma-separated
 * value per transitioned property, even when a shorthand or an override only
 * gave a single value (it's cycled across every property) - so comparing the
 * raw string against something like `'0.01ms'` breaks the moment more than
 * one property transitions. Split it instead and compare the parts.
 */
export function splitCommaList(value: string): string[] {
  return value.split(',').map((part) => part.trim());
}

export function everyDurationEquals(value: string, expected: string): boolean {
  return splitCommaList(value).every((duration) => duration === expected);
}

/**
 * Reduced-motion overrides in this codebase collapse a transition to
 * `0.01ms` rather than `0s`/`none`, so the transition still technically
 * fires (keeping `transitionend` listeners working) without being visible.
 * Browsers serialize a value that small in scientific notation (`1e-05s`),
 * which is brittle to assert against directly - parse instead.
 */
function parseDurationToMs(token: string): number {
  const trimmed = token.trim();
  if (trimmed.endsWith('ms')) return Number.parseFloat(trimmed);
  if (trimmed.endsWith('s')) return Number.parseFloat(trimmed) * 1000;
  return Number.parseFloat(trimmed);
}

export function isEffectivelyInstant(value: string, thresholdMs = 1): boolean {
  return splitCommaList(value).every(
    (duration) => parseDurationToMs(duration) <= thresholdMs,
  );
}
