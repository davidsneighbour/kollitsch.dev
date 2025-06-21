import setup from '@data/setup.json';

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
    timeZone: timezone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const parts = formatter.formatToParts(date);
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '00';

  const formatted = `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}`;

  if (tz === 'UTC') return `${formatted}Z`;

  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const hh = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
  const mm = String(Math.abs(offset) % 60).padStart(2, '0');

  return `${formatted}${sign}${hh}:${mm}`;
}
