// @vitest-environment node

import { describe, expect, it } from 'vitest';
import packageJson from '../../../package.json' with { type: 'json' };

import { GET } from './siteinfo.json.ts';

describe('/api/siteinfo.json', () => {
  it('serves the current package version without cache persistence', async () => {
    const response = GET({
      generator: 'Astro test',
      site: new URL('https://kollitsch.dev/'),
    } as never);
    const body = await response.json();

    expect(body.version).toBe(packageJson.version);
    expect(body.releasePage).toBe(
      `https://github.com/davidsneighbour/kollitsch.dev/releases/tag/v${packageJson.version}`,
    );
    expect(response.headers.get('cache-control')).toBe('no-store, max-age=0');
    expect(response.headers.get('content-type')).toBe(
      'application/json; charset=utf-8',
    );
  });
});
