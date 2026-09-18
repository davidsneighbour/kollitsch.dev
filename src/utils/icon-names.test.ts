// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { getIcon, type IconName, iconNames } from './icon-names.ts';

describe('getIcon', () => {
  it('resolves a known Lucide icon', () => {
    expect(getIcon('lucide:house')).toBeTypeOf('function');
  });

  it('resolves a known Simple Icons brand icon', () => {
    expect(getIcon('simple-icons:github')).toBeTypeOf('function');
  });

  it('throws for an unknown icon name', () => {
    expect(() => getIcon('lucide:does-not-exist' as IconName)).toThrow();
  });
});

describe('iconNames', () => {
  it('prefixes every Lucide icon with "lucide:"', () => {
    expect(iconNames).toContain('lucide:house');
    expect(iconNames).toContain('lucide:arrow-right');
  });

  it('prefixes every Simple Icons brand with "simple-icons:"', () => {
    expect(iconNames).toContain('simple-icons:github');
    expect(iconNames).toContain('simple-icons:mastodon');
  });

  it('has no duplicates', () => {
    expect(new Set(iconNames).size).toBe(iconNames.length);
  });
});
