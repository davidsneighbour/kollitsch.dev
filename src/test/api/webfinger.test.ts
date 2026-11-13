// @vitest-environment node

import { describe, expect, it } from 'vitest';

import { GET } from '../../pages/.well-known/webfinger.ts';

describe('/.well-known/webfinger', () => {
  it('points to the Mastodon account from the social setup', async () => {
    const response = await GET({} as never);
    const body = await response.json();

    expect(response.headers.get('content-type')).toBe('application/jrd+json; charset=utf-8');
    expect(body.subject).toBe('acct:davidsneighbour@mas.to');
    expect(body.aliases).toEqual(['https://mas.to/@davidsneighbour']);
    expect(body.links).toContainEqual({
      href: 'https://kollitsch.dev/.well-known/avatar',
      rel: 'http://webfinger.net/rel/avatar',
      type: 'image/png',
    });
  });
});
