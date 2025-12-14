// this is static and has no parameters and can be prerendered
export const prerender = true;

import type { APIContext } from 'astro';
import pkg from 'package.json' with { type: 'json' };

export function GET({ generator, site }: APIContext) {
  const version = (pkg as { version?: string })?.version ?? null;
  const releasePage = `https://github.com/davidsneighbour/kollitsch.dev/releases/tag/v${version}`;
  const body = JSON.stringify({ generator, releasePage, site, version });
  return new Response(body, {
    headers: {
      'cache-control': 'public, max-age=86400, stale-while-revalidate=3600',
      'content-type': 'application/json; charset=utf-8',
    },
  });
}
