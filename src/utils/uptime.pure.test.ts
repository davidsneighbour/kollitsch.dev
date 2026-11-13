// @vitest-environment node

import { describe, expect, it } from 'vitest';
import {
  addMonthsUTC,
  formatUptimeValue,
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
