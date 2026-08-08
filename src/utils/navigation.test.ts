// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { findActive, isActive, type NavItem } from './navigation.ts';

const item = (overrides: Partial<NavItem> = {}): NavItem => ({
  icon: 'lucide:house',
  label: 'Home',
  link: '/',
  ...overrides,
});

describe('isActive', () => {
  it('matches exactly by default (match undefined behaves like "full")', () => {
    expect(isActive(item({ link: '/blog' }), '/blog')).toBe(true);
    expect(isActive(item({ link: '/blog' }), '/blog/post')).toBe(false);
  });

  it('matches by prefix when match is "prefix"', () => {
    const nav = item({ link: '/blog', match: 'prefix' });
    expect(isActive(nav, '/blog/post')).toBe(true);
    expect(isActive(nav, '/blog')).toBe(true);
    expect(isActive(nav, '/other')).toBe(false);
  });

  it('matches when pathname starts with an entry in matchPaths, regardless of match type', () => {
    const nav = item({ link: '/blog', matchPaths: ['/archive'] });
    expect(isActive(nav, '/archive/2024')).toBe(true);
  });

  it('returns false when neither the link nor matchPaths match', () => {
    const nav = item({ link: '/blog', matchPaths: ['/archive'] });
    expect(isActive(nav, '/other')).toBe(false);
  });
});

describe('findActive', () => {
  it('returns the first matching top-level item', () => {
    const nav: NavItem[] = [
      item({ label: 'Home', link: '/' }),
      item({ label: 'Blog', link: '/blog' }),
    ];
    expect(findActive(nav, '/blog')?.label).toBe('Blog');
  });

  it('recurses into children to find a match', () => {
    const nav: NavItem[] = [
      item({
        children: [item({ label: 'Sub', link: '/parent/sub' })],
        label: 'Parent',
        link: '/parent',
      }),
    ];
    expect(findActive(nav, '/parent/sub')?.label).toBe('Sub');
  });

  it('returns null when nothing matches', () => {
    const nav: NavItem[] = [item({ label: 'Home', link: '/' })];
    expect(findActive(nav, '/missing')).toBeNull();
  });

  it('prefers a matching parent over checking siblings after it', () => {
    const nav: NavItem[] = [
      item({ label: 'Home', link: '/' }),
      item({ label: 'Blog', link: '/blog' }),
    ];
    expect(findActive(nav, '/')?.label).toBe('Home');
  });
});
