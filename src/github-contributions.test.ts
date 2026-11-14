// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { githubContributions } from './github-contributions';
import worker from './worker';
const calendar = {
  totalContributions: 7,
  weeks: [
    {
      firstDay: '2026-11-08',
      contributionDays: [
        {
          date: '2026-11-08',
          weekday: 0,
          contributionCount: 7,
          contributionLevel: 'FIRST_QUARTILE',
          repository: 'private',
        },
      ],
    },
  ],
};
const request = new Request('https://kollitsch.dev/api/github-contributions');
const env = { GITHUB_USERNAME: 'example', GITHUB_TOKEN: 'secret-value' };
afterEach(() => vi.unstubAllGlobals());
describe('GitHub contributions endpoint', () => {
  it('routes through the Worker and returns only safe fields with a daily cache', async () => {
    const upstream = vi.fn(async () =>
      Response.json({
        data: {
          user: { contributionsCollection: { contributionCalendar: calendar } },
        },
      }),
    );
    vi.stubGlobal('fetch', upstream);
    const response = await worker.fetch(request, {
      ...env,
      ASSETS: { fetch: vi.fn() },
      RESEND_API_KEY: '',
      RESEND_FROM: '',
      RESEND_TO: '',
    });
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toContain('max-age=86400');
    const text = await response.text();
    expect(text).not.toContain('private');
    expect(text).not.toContain('secret-value');
    const body = JSON.parse(text);
    expect(Object.keys(body)).toEqual([
      'username',
      'generatedAt',
      'totalContributions',
      'weeks',
    ]);
    const init = upstream.mock.calls[0] as unknown as [string, RequestInit];
    const variables = JSON.parse(String(init[1].body)).variables;
    expect(Date.parse(variables.to) - Date.parse(variables.from)).toBe(
      365 * 86_400_000,
    );
  });
  it('handles missing bindings and unsupported methods without fetching', async () => {
    const upstream = vi.fn();
    vi.stubGlobal('fetch', upstream);
    expect((await githubContributions(request, {})).status).toBe(503);
    expect(
      (await githubContributions(new Request(request, { method: 'POST' }), env))
        .status,
    ).toBe(405);
    expect(upstream).not.toHaveBeenCalled();
  });
  it('does not leak upstream failures or malformed data', async () => {
    for (const result of [
      new Response('secret-value', { status: 403 }),
      Response.json({ errors: [{ message: 'secret-value' }] }),
      Response.json({ data: { user: null } }),
    ]) {
      vi.stubGlobal(
        'fetch',
        vi.fn(async () => result),
      );
      const response = await githubContributions(request, env);
      expect(response.status).toBe(502);
      expect(response.headers.get('cache-control')).toBe('no-store');
      expect(await response.text()).not.toContain('secret-value');
    }
  });
});
