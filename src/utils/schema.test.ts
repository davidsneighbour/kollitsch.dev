// @vitest-environment node
import { z } from 'astro/zod';
import { describe, expect, it } from 'vitest';
import { buildOptionsSchema } from './schema.ts';

describe('buildOptionsSchema', () => {
  it('groups dotted override keys into nested section objects', () => {
    const schema = buildOptionsSchema({
      'nav.label': z.string(),
      'nav.link': z.string(),
    });

    const result = schema.parse({ nav: { label: 'Home', link: '/' } });
    expect(result).toEqual({ nav: { label: 'Home', link: '/' } });
  });

  it('creates one top-level section per distinct prefix', () => {
    const schema = buildOptionsSchema({
      'a.one': z.string(),
      'b.two': z.string(),
    });

    const result = schema.parse({
      a: { one: 'x' },
      b: { two: 'y' },
    });
    expect(Object.keys(result)).toEqual(['a', 'b']);
  });

  it('allows extra string keys within a known section via catchall', () => {
    const schema = buildOptionsSchema({ 'nav.label': z.string() });

    const result = schema.parse({
      nav: { extra: 'anything', label: 'Home' },
    });
    expect(result['nav']).toEqual({ extra: 'anything', label: 'Home' });
  });

  it('allows arbitrary unknown top-level sections via catchall', () => {
    const schema = buildOptionsSchema({ 'nav.label': z.string() });

    const result = schema.parse({
      footer: { note: 'copyright' },
      nav: { label: 'Home' },
    });
    expect(result['footer']).toEqual({ note: 'copyright' });
  });

  it('rejects non-string values in an unknown section (catchall is string-only)', () => {
    const schema = buildOptionsSchema({ 'nav.label': z.string() });

    expect(() =>
      schema.parse({ footer: { count: 1 }, nav: { label: 'Home' } }),
    ).toThrow();
  });

  it('returns an empty object schema when given no overrides', () => {
    const schema = buildOptionsSchema({});
    expect(schema.parse({})).toEqual({});
  });
});
