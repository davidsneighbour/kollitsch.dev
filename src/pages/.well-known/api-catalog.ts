import setup from '@data/setup.json' with { type: 'json' };
import type { APIRoute } from 'astro';

export const prerender = true;

const SITE_URL = setup.url;
const RFC_9727_PROFILE = 'https://www.rfc-editor.org/info/rfc9727';

function absoluteUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).toString();
}

export const API_CATALOG = {
  linkset: [
    {
      anchor: SITE_URL,
      item: [
        {
          href: absoluteUrl('/api/siteinfo.json'),
          title: 'Site metadata JSON',
          type: 'application/json',
        },
        {
          href: absoluteUrl('/.well-known/webfinger'),
          title: 'WebFinger profile document',
          type: 'application/jrd+json',
        },
      ],
      'service-desc': [
        {
          href: absoluteUrl('/llms.txt'),
          title: 'Curated LLM-readable site index',
          type: 'text/markdown',
        },
      ],
      'service-doc': [
        {
          href: absoluteUrl('/llms-full.txt'),
          title: 'Full LLM-readable site content',
          type: 'text/markdown',
        },
      ],
    },
  ],
} as const;

export const GET: APIRoute = () =>
  new Response(JSON.stringify(API_CATALOG, null, 2), {
    headers: {
      'Content-Type': `application/linkset+json; charset=utf-8; profile="${RFC_9727_PROFILE}"`,
    },
  });
