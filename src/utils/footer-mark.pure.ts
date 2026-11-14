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

/** Share of the viewport the note must enter before its entrance runs. */
const ENTRY_INSET = 0.15;
/** Share of the viewport that always stays observable. */
const MIN_OBSERVED = 0.25;

/**
 * Build the `rootMargin` for the footer mark observer. The bottom inset
 * delays the entrance until the note is 15% into the viewport when
 * scrolling down. The top inset covers the sticky site header plus the
 * same 15%, so a return from below starts under the header instead of
 * behind it. The top inset is capped so at least a quarter of the
 * viewport stays observable; otherwise the note could never intersect
 * and would stay hidden.
 */
export function footerMarkRootMargin(
  headerHeight: number,
  viewportHeight: number,
): string {
  const viewport =
    Number.isFinite(viewportHeight) && viewportHeight > 0 ? viewportHeight : 0;
  const header =
    Number.isFinite(headerHeight) && headerHeight > 0 ? headerHeight : 0;
  const maxTop = viewport * (1 - ENTRY_INSET - MIN_OBSERVED);
  const top = Math.round(Math.min(header + viewport * ENTRY_INSET, maxTop));
  return `${top > 0 ? -top : 0}px 0px -${ENTRY_INSET * 100}% 0px`;
}
