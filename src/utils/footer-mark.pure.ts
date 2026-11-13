/**
 * State of the "we have a footer" mark above the footer window:
 * `shown` is its resting state, `pending` hides it until the footer
 * window scrolls into view and the entrance runs.
 */
export type FooterMarkState = 'shown' | 'pending';

export interface FooterMarkContext {
  /** `prefers-reduced-motion: reduce` matches. */
  reduceMotion: boolean;
  /** The browser has `IntersectionObserver`. */
  canObserve: boolean;
  /** Top edge of the footer window, relative to the viewport, in px. */
  targetTop: number;
  /** Height of the viewport, in px. */
  viewportHeight: number;
}

/**
 * Decide the first state of the footer mark on page load. The mark waits
 * for its entrance only when motion is allowed, the browser can observe
 * the footer, and the footer window is still below the viewport. When the
 * footer is already on screen (a short page, or a restored scroll
 * position), the mark shows at once, so it never disappears in front of
 * the visitor.
 */
export function footerMarkInitialState(
  context: FooterMarkContext,
): FooterMarkState {
  if (context.reduceMotion || !context.canObserve) {
    return 'shown';
  }
  return context.targetTop < context.viewportHeight ? 'shown' : 'pending';
}
