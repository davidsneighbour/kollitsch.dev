// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { formatZoneTime, pickCredit, pickGreeting } from './greeting.pure.ts';

const greetings = {
  afternoon: 'Good afternoon!',
  default: 'Hello there :)',
  evening: 'Good evening!',
  morning: 'Good morning!',
  night: 'Burning the midnight oil, huh?',
};

describe('pickGreeting', () => {
  it.each([
    [5, 'Good morning!'],
    [11, 'Good morning!'],
    [12, 'Good afternoon!'],
    [16, 'Good afternoon!'],
    [17, 'Good evening!'],
    [20, 'Good evening!'],
    [21, 'Burning the midnight oil, huh?'],
    [0, 'Burning the midnight oil, huh?'],
    [4, 'Burning the midnight oil, huh?'],
  ])('hour %i gives %s', (hour, expected) => {
    expect(pickGreeting(hour, greetings)).toBe(expected);
  });

  it('falls back to the default greeting for invalid hours', () => {
    expect(pickGreeting(24, greetings)).toBe('Hello there :)');
    expect(pickGreeting(Number.NaN, greetings)).toBe('Hello there :)');
  });

  it('falls back to the default greeting when the slot is missing', () => {
    expect(pickGreeting(8, { default: 'Hi' })).toBe('Hi');
    expect(pickGreeting(8, {})).toBe('');
  });
});

describe('pickCredit', () => {
  const credits = ['Webwork done by', 'Proudly presented by', 'Another by'];

  it.each([
    [0, 'Webwork done by'],
    [0.4, 'Proudly presented by'],
    [0.999, 'Another by'],
  ])('random %f gives %s', (value, expected) => {
    expect(pickCredit(credits, () => value)).toBe(expected);
  });

  it('skips blank and non-string entries', () => {
    expect(pickCredit(['  ', 42, null, ' Webwork done by '], () => 0)).toBe(
      'Webwork done by',
    );
  });

  it('returns an empty string when no entry is usable', () => {
    expect(pickCredit([])).toBe('');
    expect(pickCredit(['', '   '])).toBe('');
  });

  it('falls back to the first entry for a random value outside [0, 1)', () => {
    expect(pickCredit(credits, () => 1)).toBe('Webwork done by');
    expect(pickCredit(credits, () => -0.5)).toBe('Webwork done by');
    expect(pickCredit(credits, () => Number.NaN)).toBe('Webwork done by');
  });

  it('returns one of the entries with the default random source', () => {
    expect(credits).toContain(pickCredit(credits));
  });
});

describe('formatZoneTime', () => {
  it('formats the wall-clock time in the given time zone', () => {
    const date = new Date('2026-11-13T12:05:00Z');
    expect(formatZoneTime(date, 'Asia/Bangkok')).toBe('19:05');
    expect(formatZoneTime(date, 'UTC')).toBe('12:05');
  });

  it('returns an empty string for an unknown time zone', () => {
    expect(formatZoneTime(new Date(), 'Nowhere/Atlantis')).toBe('');
  });
});
