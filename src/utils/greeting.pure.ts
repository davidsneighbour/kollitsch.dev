/**
 * Client-safe helpers for the footer greeting, the credit line, and the Koh
 * Samui clock.
 *
 * This module has no dependencies, so the footer's client script can import
 * it without pulling `setup.json` or `markdown-it` into the browser bundle.
 */

/** Time-of-day greetings, as configured in `setup.greetings`. */
export interface Greetings {
  morning?: string;
  afternoon?: string;
  evening?: string;
  night?: string;
  default?: string;
}

/**
 * Picks the greeting for an hour of the day (0-23).
 *
 * - 05:00-11:59 morning
 * - 12:00-16:59 afternoon
 * - 17:00-20:59 evening
 * - 21:00-04:59 night
 *
 * Falls back to `greetings.default`, then to an empty string, when the
 * matching entry is missing or the hour is not a valid number.
 */
export function pickGreeting(hour: number, greetings: Greetings): string {
  const fallback = greetings.default ?? '';
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    return fallback;
  }
  let greeting: string | undefined;
  if (hour >= 5 && hour < 12) {
    greeting = greetings.morning;
  } else if (hour >= 12 && hour < 17) {
    greeting = greetings.afternoon;
  } else if (hour >= 17 && hour < 21) {
    greeting = greetings.evening;
  } else {
    greeting = greetings.night;
  }
  return greeting ?? fallback;
}

/**
 * Picks one credit line (the text before the footer wordmark), as configured
 * in `setup.credits`.
 *
 * Ignores entries that are not strings or are blank. Returns an empty string
 * when no entry is left, so callers can keep their server-rendered fallback.
 *
 * @param credits The configured credit lines.
 * @param random Returns a number in [0, 1); defaults to `Math.random`.
 */
export function pickCredit(
  credits: readonly unknown[],
  random: () => number = Math.random,
): string {
  const usable = credits.filter(
    (credit): credit is string =>
      typeof credit === 'string' && credit.trim() !== '',
  );
  if (usable.length === 0) {
    return '';
  }
  const index = Math.floor(random() * usable.length);
  // A random source outside [0, 1) falls back to the first entry.
  const safeIndex = index >= 0 && index < usable.length ? index : 0;
  return usable[safeIndex]?.trim() ?? '';
}

/**
 * Formats a date as a 24-hour `HH:MM` wall-clock time in an IANA time zone.
 *
 * Returns an empty string when the time zone is not valid, so callers can
 * keep their server-rendered fallback.
 */
export function formatZoneTime(date: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      hourCycle: 'h23',
      minute: '2-digit',
      timeZone,
    }).format(date);
  } catch {
    return '';
  }
}
