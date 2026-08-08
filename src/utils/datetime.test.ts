// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  formatDateLong,
  formatDisplayDate,
  formatISO8601Local,
} from './datetime.ts';

describe('formatISO8601Local', () => {
  // formatISO8601Local derives the numeric offset by round-tripping the date
  // through the *process* local timezone, so the assertions below only hold
  // when the process timezone is one where that round-trip is exact (e.g.
  // UTC). Pin it here so results don't depend on the host machine's TZ.
  let originalTz: string | undefined;

  beforeEach(() => {
    originalTz = process.env['TZ'];
    process.env['TZ'] = 'UTC';
  });

  afterEach(() => {
    if (originalTz === undefined) delete process.env['TZ'];
    else process.env['TZ'] = originalTz;
  });

  it('formats with a Z suffix when tz is UTC', () => {
    const date = new Date('2025-06-22T07:50:00Z');
    expect(formatISO8601Local(date, 'UTC')).toBe('2025-06-22T07:50:00Z');
  });

  it('formats with a numeric offset for a named timezone', () => {
    const date = new Date('2025-06-22T07:50:00Z');
    expect(formatISO8601Local(date, 'Asia/Bangkok')).toBe(
      '2025-06-22T14:50:00+07:00',
    );
  });

  it('falls back to the configured site timezone when tz is omitted', () => {
    const date = new Date('2025-06-22T07:50:00Z');
    // setup.json timezone is Asia/Bangkok
    expect(formatISO8601Local(date)).toBe('2025-06-22T14:50:00+07:00');
  });
});

describe('formatDateLong', () => {
  it('formats a date with weekday, ordinal day, month and year', () => {
    expect(formatDateLong(new Date('2024-12-12T00:00:00'))).toBe(
      'Thursday, 12th December 2024',
    );
  });

  it.each([
    ['2024-01-01T00:00:00', '1st'],
    ['2024-01-02T00:00:00', '2nd'],
    ['2024-01-03T00:00:00', '3rd'],
    ['2024-01-04T00:00:00', '4th'],
    ['2024-01-11T00:00:00', '11th'],
    ['2024-01-12T00:00:00', '12th'],
    ['2024-01-13T00:00:00', '13th'],
    ['2024-01-21T00:00:00', '21st'],
  ])('applies the correct ordinal suffix for %s', (iso, suffix) => {
    expect(formatDateLong(new Date(iso))).toContain(suffix);
  });

  it('returns an empty string for an invalid date', () => {
    expect(formatDateLong(new Date('not-a-date'))).toBe('');
  });

  it('returns an empty string for a non-Date value', () => {
    expect(formatDateLong('2024-12-12' as unknown as Date)).toBe('');
  });
});

describe('formatDisplayDate', () => {
  it('formats a Date instance', () => {
    expect(formatDisplayDate(new Date('2024-12-12T00:00:00'))).toBe(
      'Thursday, 12th December 2024',
    );
  });

  it('parses and formats a valid date string', () => {
    expect(formatDisplayDate('2024-12-12T00:00:00')).toBe(
      'Thursday, 12th December 2024',
    );
  });

  it('returns an empty string for an invalid date string', () => {
    expect(formatDisplayDate('not-a-date')).toBe('');
  });

  it('returns an empty string for undefined', () => {
    expect(formatDisplayDate(undefined)).toBe('');
  });
});
