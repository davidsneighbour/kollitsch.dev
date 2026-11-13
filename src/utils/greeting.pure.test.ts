// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { formatZoneTime, pickGreeting } from './greeting.pure.ts';

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
