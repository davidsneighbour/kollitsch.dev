import setup from '@data/setup.json' with { type: 'json' };
import { getSocialNetwork } from '@data/social.ts';
import { buildWebfinger } from '@utils/social.pure.ts';
import type { APIRoute } from 'astro';

// Points WebFinger lookups on this domain to the Mastodon account that is
// configured in the `social` section of src/data/setup.json.
const mastodon = getSocialNetwork('mastodon');
if (!mastodon.profile.handle) {
  throw new Error(
    'The mastodon network in src/data/setup.json needs a profile.handle',
  );
}

const WEBFINGER_BODY = buildWebfinger(
  mastodon.profile.handle,
  mastodon.profile.url,
  new URL('/.well-known/avatar', setup.url).toString(),
);

export const GET: APIRoute = async () => {
  try {
    return new Response(JSON.stringify(WEBFINGER_BODY), {
      headers: {
        'Content-Type': 'application/jrd+json; charset=utf-8',
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error in WebFinger endpoint', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      headers: { 'Content-Type': 'application/jrd+json; charset=utf-8' },
      status: 500,
    });
  }
};
