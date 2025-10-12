import setup from '@data/setup.json' with { type: 'json' };

/**
 * Formats a Date object into ISO8601 format with local or UTC timezone offset.
 *
 * If the provided timezone is `'UTC'`, the result ends with `'Z'`.
 * Otherwise, the output ends with the local offset in `±hh:mm` format.
 *
 * Format: `YYYY-MM-DDTHH:mm:ssZ` or `YYYY-MM-DDTHH:mm:ss±hh:mm`
 *
 * @param {Date} date - The Date object to format.
 * @param {string} tz - IANA timezone name (e.g. "Asia/Bangkok" or "UTC").
 *                      `'UTC'` results in `Z`-suffix; other zones `±hh:mm`.
 *
 * @returns {string} ISO 8601–compliant datetime string.
 *
 * @example
 * // setup.timezone = "Asia/Bangkok"
 * const date = new Date('2025-06-22T07:50:00Z');
 * formatISO8601Local(date, 'Asia/Bangkok');
 * // → "2025-06-22T14:50:00+07:00"
 *
 * @example
 * formatISO8601Local(date, 'UTC');
 * // → "2025-06-22T07:50:00Z"
 */
export function formatISO8601Local(date: Date, tz?: string): string {
  const timezone = tz ?? setup.timezone;

  // sv-SE locale is used to ensure the date is formatted in a consistent way
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    month: '2-digit',
    second: '2-digit',
    timeZone: timezone,
    year: 'numeric',
  });

  const parts = formatter.formatToParts(date);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? '00';

  const formatted = `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}`;

  if (tz === 'UTC') return `${formatted}Z`;

  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
  const offsetMinutes = (tzDate.getTime() - date.getTime()) / 60000;
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const hh = String(Math.floor(Math.abs(offsetMinutes) / 60)).padStart(2, '0');
  const mm = String(Math.abs(offsetMinutes) % 60).padStart(2, '0');

  return `${formatted}${sign}${hh}:${mm}`;
}

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
