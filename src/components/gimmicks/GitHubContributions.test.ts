// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { afterEach, describe, expect, it, vi } from 'vitest';
import GitHubContributions from './GitHubContributions.astro';
import {
  cacheLifetime,
  isContributionData,
  loadContributions,
} from './github-contributions';
export const fixture = {
  generatedAt: '2026-11-14T00:00:00Z',
  totalContributions: 7,
  username: 'example',
  weeks: [
    {
      contributionDays: [
        {
          contributionCount: 7,
          contributionLevel: 'FIRST_QUARTILE',
          date: '2026-11-08',
          weekday: 0,
        },
      ],
      firstDay: '2026-11-08',
    },
  ],
};
afterEach(() => vi.unstubAllGlobals());
describe('contribution data and cache', () => {
  it('validates dates, levels, counts, and weekdays', () => {
    expect(isContributionData(fixture)).toBe(true);
    for (const changes of [
      { date: '2026-02-30' },
      { weekday: 4 },
      { contributionCount: -1 },
      { contributionLevel: 'INVALID' },
    ]) {
      expect(
        isContributionData({
          ...fixture,
          weeks: [
            {
              contributionDays: [
                { ...fixture.weeks[0]?.contributionDays[0], ...changes },
              ],
              firstDay: '2026-11-08',
            },
          ],
        }),
      ).toBe(false);
    }
  });
  it('enforces at least 24 hours', () => {
    expect(cacheLifetime(1)).toBe(86_400_000);
    expect(cacheLifetime(Number.NaN)).toBe(86_400_000);
    expect(cacheLifetime(48)).toBe(172_800_000);
  });
  it('reuses fresh data and replaces expired and malformed data', async () => {
    vi.stubGlobal('window', {
      location: { href: 'https://example.com/', origin: 'https://example.com' },
    });
    const fetcher = vi.fn(async () => Response.json(fixture));
    vi.stubGlobal('fetch', fetcher);
    let value: string | null = JSON.stringify({ data: fixture, savedAt: 100 });
    const storage = {
      getItem: () => value,
      removeItem: vi.fn(() => {
        value = null;
      }),
      setItem: (_key: string, next: string) => {
        value = next;
      },
    } as unknown as Storage;
    await loadContributions(
      '/api/github-contributions',
      24,
      storage,
      86_400_099,
    );
    expect(fetcher).not.toHaveBeenCalled();
    await loadContributions(
      '/api/github-contributions',
      24,
      storage,
      86_400_100,
    );
    expect(fetcher).toHaveBeenCalledTimes(1);
    value = '{broken';
    await loadContributions('/api/github-contributions', 24, storage);
    expect(storage.removeItem).toHaveBeenCalled();
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it('renders without usable storage and rejects remote endpoints', async () => {
    vi.stubGlobal('window', {
      location: { href: 'https://example.com/', origin: 'https://example.com' },
    });
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json(fixture)),
    );
    const storage = {
      getItem: () => {
        throw new Error('blocked');
      },
      removeItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    } as unknown as Storage;
    await expect(
      loadContributions('/api/github-contributions', 24, storage),
    ).resolves.toEqual(fixture);
    await expect(
      loadContributions('https://remote.example/api', 24),
    ).rejects.toThrow('local endpoint');
  });
});

describe('contribution heading', () => {
  it('keeps a plain section name when a terminal prompt replaces the heading', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(GitHubContributions, {
      props: { heading: 'GitHub activity' },
      slots: { heading: '<h3>gh api graphql</h3>' },
    });
    expect(html).toContain('aria-label="GitHub activity"');
    expect(html).toContain('<h3>gh api graphql</h3>');
    expect(html).not.toContain('<h3>GitHub activity</h3>');
  });
  it('provides a default heading outside the footer', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(GitHubContributions);
    expect(html).toMatch(/<h3\b[^>]*>Recent GitHub activity<\/h3>/);
  });
});

describe('decorative calendar', () => {
  it('keeps the summary accessible and the day grid out of the tab order', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(GitHubContributions);
    expect(html).toMatch(/aria-live="polite"[^>]*data-summary/);
    expect(html).toMatch(/data-calendar[^>]*aria-hidden="true"/);
    const source = await (await import('node:fs/promises')).readFile(
      new URL('./GitHubContributions.astro', import.meta.url),
      'utf8',
    );
    expect(source).not.toContain("createElement('button')");
    expect(source).not.toContain('tabindex');
    expect(source).not.toContain('data-tooltip');
  });
});

describe('calendar loading reservation', () => {
  it('reserves the wrapped error summary before JavaScript without announcing it twice', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(GitHubContributions);
    expect(html).toMatch(
      /class="github-contributions__summary-reserve"[^>]*aria-hidden="true"/,
    );
    expect(html).toContain(
      'GitHub activity is unavailable. Please try again later.',
    );
    expect(html.match(/aria-live="polite"/g)).toHaveLength(1);
    expect(html).toContain('Loading GitHub activity...');
  });
});
