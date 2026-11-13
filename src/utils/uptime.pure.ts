/**
 * Client-safe calendar difference for the footer "uptime" counter.
 *
 * No dependencies, so the footer's client script can import it.
 */

/** Calendar difference between two instants, largest unit first. */
export interface UptimeParts {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Units in display order. */
export const UPTIME_UNITS = [
  'years',
  'months',
  'days',
  'hours',
  'minutes',
  'seconds',
] as const satisfies readonly (keyof UptimeParts)[];

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Adds whole calendar months in UTC. When the target month is shorter, the
 * day is clamped to its last day (31 January + 1 month = 28/29 February).
 */
export function addMonthsUTC(date: Date, months: number): Date {
  const monthIndex = date.getUTCMonth() + months;
  const year = date.getUTCFullYear() + Math.floor(monthIndex / 12);
  const month = ((monthIndex % 12) + 12) % 12;
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return new Date(
    Date.UTC(
      year,
      month,
      Math.min(date.getUTCDate(), daysInMonth),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds(),
    ),
  );
}

/**
 * Splits the time from `start` to `now` into calendar years and months,
 * then days, hours, minutes, and seconds. Months are counted on the UTC
 * calendar, so the result does not jump when the visitor's time zone
 * changes to or from daylight saving time. Returns all zeros when `now` is
 * before `start` or either date is invalid.
 */
export function uptimeParts(start: Date, now: Date): UptimeParts {
  const zero: UptimeParts = {
    days: 0,
    hours: 0,
    minutes: 0,
    months: 0,
    seconds: 0,
    years: 0,
  };
  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(now.getTime()) ||
    now < start
  ) {
    return zero;
  }

  let totalMonths =
    (now.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    (now.getUTCMonth() - start.getUTCMonth());
  if (addMonthsUTC(start, totalMonths) > now) {
    totalMonths -= 1;
  }
  const anchor = addMonthsUTC(start, totalMonths);
  let rest = now.getTime() - anchor.getTime();

  const days = Math.floor(rest / DAY);
  rest -= days * DAY;
  const hours = Math.floor(rest / HOUR);
  rest -= hours * HOUR;
  const minutes = Math.floor(rest / MINUTE);
  rest -= minutes * MINUTE;
  const seconds = Math.floor(rest / SECOND);

  return {
    days,
    hours,
    minutes,
    months: totalMonths % 12,
    seconds,
    years: Math.floor(totalMonths / 12),
  };
}

/**
 * Formats one unit value for display. Years are not padded; every other
 * unit is padded to two digits, so the digit count (and the layout) stays
 * stable while the counter runs.
 */
export function formatUptimeValue(
  unit: (typeof UPTIME_UNITS)[number],
  value: number,
): string {
  return unit === 'years' ? String(value) : String(value).padStart(2, '0');
}

/** Unit label, singular for exactly 1 ("1 year", "02 years"). */
export function uptimeUnitLabel(
  unit: (typeof UPTIME_UNITS)[number],
  value: number,
): string {
  return value === 1 ? unit.slice(0, -1) : unit;
}
