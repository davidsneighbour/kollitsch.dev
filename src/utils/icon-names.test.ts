// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';

// The real @iconify-json/* packages ship multi-megabyte icons.json files.
// Vitest's SSR node runtime externalizes them and hands the raw import
// straight to Node's loader, which then rejects it for missing the
// "type: json" attribute the source strips during transform. Mock both
// packages with a small fixture so icon-names.ts's own merging/prefixing
// logic can be tested without hitting that loader issue.
vi.mock('@iconify-json/bi/icons.json', () => ({
  default: { icons: { alarm: {}, 'house-door': {} } },
}));
vi.mock('@iconify-json/lucide/icons.json', () => ({
  default: { icons: { home: {}, user: {} } },
}));

const { iconNames } = await import('./icon-names.ts');

describe('iconNames', () => {
  it('lists Bootstrap icon names without a prefix', () => {
    expect(iconNames).toContain('alarm');
    expect(iconNames).toContain('house-door');
  });

  it('prefixes every Lucide icon name with "lucide:"', () => {
    expect(iconNames).toContain('lucide:home');
    expect(iconNames).toContain('lucide:user');
  });

  it('combines both icon sets into a single flat array with no duplicates', () => {
    expect(iconNames).toHaveLength(4);
    expect(new Set(iconNames).size).toBe(iconNames.length);
  });
});
