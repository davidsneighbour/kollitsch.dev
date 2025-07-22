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
