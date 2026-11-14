// @vitest-environment node

import { describe, expect, it } from 'vitest';
import {
  addMonthsUTC,
  ageVersion,
  dayClock,
  formatDayClockTime,
  formatDayCount,
  formatDayMilestone,
  formatUptimeValue,
  nextDayMilestone,
  uptimeParts,
  uptimeUnitLabel,
} from './uptime.pure.ts';

describe('addMonthsUTC', () => {
  it('clamps the day to the end of a shorter month', () => {
    const jan31 = new Date('2024-01-31T10:00:00Z');
    expect(addMonthsUTC(jan31, 1).toISOString()).toBe(
      '2024-02-29T10:00:00.000Z',
    );
    expect(
      addMonthsUTC(new Date('2023-01-31T10:00:00Z'), 1).toISOString(),
    ).toBe('2023-02-28T10:00:00.000Z');
  });

  it('crosses year boundaries', () => {
    expect(
      addMonthsUTC(new Date('2021-10-21T13:00:00Z'), 15).toISOString(),
    ).toBe('2023-01-21T13:00:00.000Z');
  });
});

describe('uptimeParts', () => {
  const firstPost = new Date('2021-10-21T20:00:00+07:00');

  it('splits a span into calendar units', () => {
    const now = new Date('2026-11-13T19:31:07+07:00');
    expect(uptimeParts(firstPost, now)).toEqual({
      days: 22,
      hours: 23,
      minutes: 31,
      months: 0,
      seconds: 7,
      years: 5,
    });
  });

  it('borrows a month when the day of month is not reached yet', () => {
    const now = new Date('2026-11-20T19:59:59+07:00');
    expect(uptimeParts(firstPost, now)).toEqual({
      days: 29,
      hours: 23,
      minutes: 59,
      months: 0,
      seconds: 59,
      years: 5,
    });
  });

  it('is exactly whole units on an anniversary', () => {
    const now = new Date('2026-10-21T20:00:00+07:00');
    expect(uptimeParts(firstPost, now)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      months: 0,
      seconds: 0,
      years: 5,
    });
  });

  it('handles a start at the end of a long month', () => {
    const start = new Date('2024-01-31T00:00:00Z');
    expect(uptimeParts(start, new Date('2024-03-01T00:00:00Z'))).toEqual({
      days: 1,
      hours: 0,
      minutes: 0,
      months: 1,
      seconds: 0,
      years: 0,
    });
  });

  it('returns zeros for a future start or invalid dates', () => {
    const zero = {
      days: 0,
      hours: 0,
      minutes: 0,
      months: 0,
      seconds: 0,
      years: 0,
    };
    expect(uptimeParts(new Date('2030-01-01'), new Date('2026-01-01'))).toEqual(
      zero,
    );
    expect(uptimeParts(new Date('nope'), new Date())).toEqual(zero);
  });
});

describe('formatUptimeValue and uptimeUnitLabel', () => {
  it('pads every unit except years to two digits', () => {
    expect(formatUptimeValue('years', 5)).toBe('5');
    expect(formatUptimeValue('months', 3)).toBe('03');
    expect(formatUptimeValue('seconds', 42)).toBe('42');
  });

  it('uses the singular label only for exactly 1', () => {
    expect(uptimeUnitLabel('years', 1)).toBe('year');
    expect(uptimeUnitLabel('days', 0)).toBe('days');
    expect(uptimeUnitLabel('minutes', 12)).toBe('minutes');
  });
});

describe('day count helpers', () => {
  // 05:25 CET (UTC+1); Germany had no summer time in 1975.
  const born = new Date('1975-07-05T05:25:00+01:00');

  it('counts whole days and the time of the current day', () => {
    expect(dayClock(born, new Date('2026-11-13T12:00:00Z'))).toEqual({
      days: 18759,
      hours: 7,
      minutes: 35,
      seconds: 0,
    });
  });

  it('returns zeros before the start or for invalid dates', () => {
    const zero = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    expect(dayClock(born, new Date('1975-01-01T00:00:00Z'))).toEqual(zero);
    expect(dayClock(born, new Date('invalid'))).toEqual(zero);
  });

  it('formats the day count and the time of day', () => {
    expect(formatDayCount(18759)).toBe('18.759');
    expect(formatDayCount(999)).toBe('999');
    expect(formatDayCount(1234567)).toBe('1.234.567');
    expect(
      formatDayClockTime({ days: 1, hours: 7, minutes: 5, seconds: 9 }),
    ).toBe('07:05:09');
  });

  it('writes the age as a version number', () => {
    expect(ageVersion(born, new Date('2026-11-13T12:00:00Z'))).toBe('51.4.8');
    expect(ageVersion(born, new Date('1976-07-05T04:25:00Z'))).toBe('1.0.0');
  });

  it('finds the next round thousand days', () => {
    const next = nextDayMilestone(born, new Date('2026-11-13T12:00:00Z'));
    expect(next.day).toBe(19000);
    expect(next.today).toBe(false);
    expect(next.date.toISOString()).toBe('2027-07-12T04:25:00.000Z');
  });

  it('matches day 17.000 from the 2022 post and reports it on the day', () => {
    const onTheDay = nextDayMilestone(born, new Date('2022-01-19T10:00:00Z'));
    expect(onTheDay).toEqual({
      date: new Date('2022-01-19T04:25:00.000Z'),
      day: 17000,
      today: true,
    });
    expect(nextDayMilestone(born, new Date('2022-01-20T04:25:00Z')).day).toBe(
      18000,
    );
  });
});

describe('formatDayMilestone', () => {
  it('names the next round day and its date in the given time zone', () => {
    expect(
      formatDayMilestone(
        {
          date: new Date('2027-07-12T04:25:00Z'),
          day: 19000,
          today: false,
        },
        'Asia/Bangkok',
      ),
    ).toBe('next: day 19.000, 12 July 2027');
  });

  it('says so on the day itself', () => {
    expect(
      formatDayMilestone(
        { date: new Date('2022-01-19T04:25:00Z'), day: 17000, today: true },
        'Asia/Bangkok',
      ),
    ).toBe('today: day 17.000');
  });
});
