// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { API_CATALOG, GET } from './api-catalog.ts';

describe('/.well-known/api-catalog', () => {
  it('returns an RFC 9264 JSON linkset response', async () => {
    const response = await GET({} as never);
    const body = await response.json();

    expect(response.headers.get('Content-Type')).toBe(
      'application/linkset+json; charset=utf-8; profile="https://www.rfc-editor.org/info/rfc9727"',
    );
    expect(body).toEqual(API_CATALOG);
    expect(Array.isArray(body.linkset)).toBe(true);
  });

  it('lists public site API resources and service descriptions', () => {
    const [context] = API_CATALOG.linkset;

    expect(context.anchor).toBe('https://kollitsch.dev/');
    expect(context.item).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          href: 'https://kollitsch.dev/api/siteinfo.json',
          type: 'application/json',
        }),
        expect.objectContaining({
          href: 'https://kollitsch.dev/.well-known/webfinger',
          type: 'application/jrd+json',
        }),
      ]),
    );
    expect(context['service-desc']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          href: 'https://kollitsch.dev/llms.txt',
          type: 'text/markdown',
        }),
      ]),
    );
    expect(context['service-doc']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          href: 'https://kollitsch.dev/llms-full.txt',
          type: 'text/markdown',
        }),
      ]),
    );
  });
});
