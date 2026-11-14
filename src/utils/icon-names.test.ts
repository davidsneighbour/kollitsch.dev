// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  getIcon,
  type IconName,
  iconNames,
  isIconName,
  unknownIconMessage,
} from './icon-names.ts';

describe('getIcon', () => {
  it('resolves a known Lucide icon', () => {
    expect(getIcon('lucide:house')).toBeTypeOf('function');
  });

  it('resolves a known Simple Icons brand icon', () => {
    expect(getIcon('simple-icons:github')).toBeTypeOf('function');
  });

  it('throws for an unknown icon name', () => {
    expect(() => getIcon('lucide:does-not-exist' as IconName)).toThrow(
      unknownIconMessage('lucide:does-not-exist'),
    );
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

describe('isIconName', () => {
  it('accepts registered names from every set', () => {
    expect(isIconName('lucide:notebook-pen')).toBe(true);
    expect(isIconName('simple-icons:github')).toBe(true);
    expect(isIconName('local:nostr')).toBe(true);
  });

  it('rejects unregistered names, wrong prefixes, and bare names', () => {
    expect(isIconName('lucide:does-not-exist')).toBe(false);
    expect(isIconName('lucide:github')).toBe(false);
    expect(isIconName('house')).toBe(false);
    expect(isIconName('')).toBe(false);
  });
});

describe('unknownIconMessage', () => {
  it('names the icon and where to register it', () => {
    const message = unknownIconMessage('lucide:foo');
    expect(message).toContain('"lucide:foo"');
    expect(message).toContain('src/utils/icon-names.ts');
  });
});
