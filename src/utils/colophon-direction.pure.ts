/**
 * Direction logic for the footer colophon hover spectrum (see "Footer
 * Colophon Watermark" in DESIGN.md). The spectrum floods in from the side
 * where the pointer enters and drains out to the side where it leaves.
 */
export type ColophonSide = 'left' | 'right';
export type ColophonPhase = 'enter' | 'leave';

/** `--colophon-front` value at rest: the olive cover hides the spectrum. */
export const COLOPHON_FRONT_REST = -15;
/** `--colophon-front` value at full hover: the cover is gone. */
export const COLOPHON_FRONT_FULL = 115;

/**
 * Side of the word nearest to the pointer: the left half counts as `left`,
 * the right half as `right`.
 */
export function colophonSide(
  clientX: number,
  left: number,
  width: number,
): ColophonSide {
  if (!(width > 0) || !Number.isFinite(clientX) || !Number.isFinite(left)) {
    return 'left';
  }
  return clientX - left < width / 2 ? 'left' : 'right';
}

/**
 * Whether the effect has finished the movement before this phase: at rest
 * before entering, or fully flooded before leaving. A value that cannot be
 * read counts as settled, so the pointer side always applies then.
 */
export function colophonSettled(front: number, phase: ColophonPhase): boolean {
  if (!Number.isFinite(front)) return true;
  return phase === 'enter'
    ? front <= COLOPHON_FRONT_REST
    : front >= COLOPHON_FRONT_FULL;
}

/**
 * Direction for the next flood or drain. The side changes only when the
 * effect is settled. While a flood or drain is still running, it keeps its
 * direction, so the cover edge reverses smoothly instead of jumping to the
 * other side.
 */
export function colophonDirection(
  current: ColophonSide,
  side: ColophonSide,
  settled: boolean,
): ColophonSide {
  return settled ? side : current;
}
