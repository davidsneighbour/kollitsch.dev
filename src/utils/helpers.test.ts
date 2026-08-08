// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  createIdentifier,
  generateRandomString,
  generateUniqueHtmlId,
} from './helpers.ts';

describe('generateUniqueHtmlId', () => {
  it('uses the default prefix and length', () => {
    const id = generateUniqueHtmlId();
    expect(id).toMatch(/^dnbuid-[0-9a-f]{16}$/);
  });

  it('applies a custom prefix and length', () => {
    const id = generateUniqueHtmlId('block', 8);
    expect(id).toMatch(/^block-[0-9a-f]{8}$/);
  });

  it('produces different ids on repeated calls', () => {
    expect(generateUniqueHtmlId()).not.toBe(generateUniqueHtmlId());
  });

  it('throws for an odd length', () => {
    expect(() => generateUniqueHtmlId('x', 7)).toThrow(
      'Length must be a positive even number.',
    );
  });

  it('throws for a non-positive length', () => {
    expect(() => generateUniqueHtmlId('x', 0)).toThrow(
      'Length must be a positive even number.',
    );
  });
});

describe('generateRandomString', () => {
  it('generates a string of the requested length', () => {
    expect(generateRandomString(10)).toHaveLength(10);
  });

  it('only uses lowercase alphanumeric characters', () => {
    expect(generateRandomString(50)).toMatch(/^[a-z0-9]+$/);
  });

  it('returns an empty string for length 0', () => {
    expect(generateRandomString(0)).toBe('');
  });
});

describe('createIdentifier', () => {
  it('uses default prefix and length when called with no arguments', () => {
    const id = createIdentifier();
    expect(id).toMatch(/^identifier-[a-z0-9]{24}$/);
  });

  it('honors a custom prefix', () => {
    const id = createIdentifier({ prefix: 'header' });
    expect(id).toMatch(/^header-[a-z0-9]{24}$/);
  });

  it('honors a custom length', () => {
    const id = createIdentifier({ length: 6 });
    expect(id).toMatch(/^identifier-[a-z0-9]{6}$/);
  });

  it('throws for an invalid length via zod validation', () => {
    expect(() => createIdentifier({ length: -1 })).toThrow();
  });

  it('throws for unknown keys because the schema is strict', () => {
    expect(() => createIdentifier({ bogus: true })).toThrow();
  });
});
