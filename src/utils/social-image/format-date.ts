/**
 * Pure date-display formatting, with no imports, so it works from the
 * plain-Node build-og-images.ts CLI script as well as from Astro/Vite.
 * `src/utils/datetime.ts` re-exports these for existing consumers.
 */

/**
 * Format a Date object as "Monday, 12th December 2024".
 * Hardcoded to English (en-GB) locale; no i18n support.
 *
 * @example
 * formatDateLong(new Date('2024-12-12'))
 * // → "Thursday, 12th December 2024"
 *
 * @param date - A valid Date object
 * @returns The formatted date string
 */
export function formatDateLong(date: Date): string {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '';
  }

  const day = date.getDate();

  // Determine ordinal suffix
  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
          ? 'rd'
          : 'th';

  const weekday = date.toLocaleDateString('en-GB', { weekday: 'long' });
  const month = date.toLocaleDateString('en-GB', { month: 'long' });
  const year = date.getFullYear();

  return `${weekday}, ${day}${suffix} ${month} ${year}`;
}

/**
 * Converts an input (Date or string) to formatted long-date string.
 * Returns empty string on invalid input.
 *
 * @param raw - A Date or ISO/string value
 * @returns Formatted date string
 */
export function formatDisplayDate(raw: Date | string | undefined): string {
  if (raw instanceof Date) return formatDateLong(raw);
  if (typeof raw === 'string') {
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? '' : formatDateLong(parsed);
  }
  return '';
}
