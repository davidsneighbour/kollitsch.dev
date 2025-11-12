import type { IconName } from '@utils/icon-names';

/**
 * Navigation type definition.
 * Represents an array of navigation items.
 */
export type Navigation = NavItem[];

/**
 * Navigation item type definition.
 * Represents a single navigation item with properties for label, link, icon,
 * and optional matching criteria.
 */
export type NavItem = {
  label: string;
  link: string;
  icon: IconName;
  match?: 'full' | 'prefix';
  matchPaths?: string[];
  children?: NavItem[];
};

export function isActive(item: NavItem, pathname: string): boolean {
  const matchType = item.match ?? 'full';
  const directMatch =
    matchType === 'full'
      ? pathname === item.link
      : pathname.startsWith(item.link);
  const extraMatches =
    item.matchPaths?.some((prefix) => pathname.startsWith(prefix)) ?? false;
  return directMatch || extraMatches;
}

export function findActive(nav: NavItem[], pathname: string): NavItem | null {
  for (const item of nav) {
    if (isActive(item, pathname)) return item;
    if (item.children) {
      const match = findActive(item.children, pathname);
      if (match) return match;
    }
  }
  return null;
}
