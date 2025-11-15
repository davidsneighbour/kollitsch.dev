// @vitest-environment node
import { describe, expect, it } from 'vitest';

import {
  sanitizeYouTubePlayerParams,
  serializeYouTubePlayerParams,
} from './youtube.ts';

describe('sanitizeYouTubePlayerParams', () => {
  it('coerces mixed inputs to canonical string values', () => {
    const params = sanitizeYouTubePlayerParams({
      autoplay: true,
      color: 'WHITE',
      controls: '2',
      hl: 'EN_us',
      start: ' 30 ',
      playlist: '  a1b2c3 ',
    });

    expect(params).toEqual({
      autoplay: '1',
      color: 'white',
      controls: '2',
      hl: 'en-us',
      playlist: 'a1b2c3',
      start: '30',
    });
  });

  it('drops unknown or invalid parameters while keeping valid ones', () => {
    const params = sanitizeYouTubePlayerParams({
      autoplay: 0,
      color: 'blue',
      unknown: 'value',
    });

    expect(params).toEqual({ autoplay: '0' });
  });

  it('returns an empty object when params are missing or not objects', () => {
    expect(sanitizeYouTubePlayerParams()).toEqual({});
    expect(sanitizeYouTubePlayerParams(undefined)).toEqual({});
    expect(sanitizeYouTubePlayerParams(null)).toEqual({});
    expect(sanitizeYouTubePlayerParams('not-an-object')).toEqual({});
  });
});

describe('serializeYouTubePlayerParams', () => {
  it('sorts keys and produces a stable query string', () => {
    const query = serializeYouTubePlayerParams({
      rel: '0',
      color: 'white',
      autoplay: '1',
    });

    expect(query).toBe('autoplay=1&color=white&rel=0');
  });
});
