/**
 * Client-safe calendar and day-count differences for the footer "online"
 * (blog) and "uptime" (author) counters.
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

/** Whole days since `start`, then the time of the current day. */
export interface DayClock {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Splits the time from `start` to `now` into whole elapsed days (no years
 * or months) and the hours, minutes, and seconds of the current day. Day 0
 * is the day of `start`. Returns all zeros when `now` is before `start` or
 * either date is invalid.
 */
export function dayClock(start: Date, now: Date): DayClock {
  const elapsed = now.getTime() - start.getTime();
  if (Number.isNaN(elapsed) || elapsed < 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    days: Math.floor(elapsed / DAY),
    hours: Math.floor((elapsed % DAY) / HOUR),
    minutes: Math.floor((elapsed % HOUR) / MINUTE),
    seconds: Math.floor((elapsed % MINUTE) / SECOND),
  };
}

/** Formats a footer day count with the approved dot grouping ("18.759"). */
export function formatDayCount(days: number): string {
  return new Intl.NumberFormat('de-DE').format(days);
}

/** Formats the time of day of a `DayClock` as "07:05:09". */
export function formatDayClockTime(clock: DayClock): string {
  return [clock.hours, clock.minutes, clock.seconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
}

/**
 * Age as a kernel-style version number: years.months.days on the UTC
 * calendar ("51.4.8").
 */
export function ageVersion(start: Date, now: Date): string {
  const parts = uptimeParts(start, now);
  return `${parts.years}.${parts.months}.${parts.days}`;
}

/** The next round day count and the instant it starts. */
export interface DayMilestone {
  /** The round day count, for example 19000. */
  day: number;
  /** The instant that day starts. */
  date: Date;
  /** True while `now` is inside that day. */
  today: boolean;
}

/**
 * Finds the next multiple of `step` days since `start`. While the current
 * day is itself a multiple of `step` (and not day 0), that day is returned
 * with `today: true`.
 */
export function nextDayMilestone(
  start: Date,
  now: Date,
  step = 1000,
): DayMilestone {
  const { days } = dayClock(start, now);
  const today = days > 0 && days % step === 0;
  const day = today ? days : (Math.floor(days / step) + 1) * step;
  return { date: new Date(start.getTime() + day * DAY), day, today };
}

/**
 * Comment line for the next round day count, as shown in `timeZone`:
 * "next: day 19,000, 12 July 2027", or "today: day 19,000" on the day.
 */
export function formatDayMilestone(
  milestone: DayMilestone,
  timeZone: string,
): string {
  const day = `day ${formatDayCount(milestone.day)}`;
  if (milestone.today) return `today: ${day}`;
  const date = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'long',
    timeZone,
  }).format(milestone.date);
  return `next: ${day}, ${date}`;
}
