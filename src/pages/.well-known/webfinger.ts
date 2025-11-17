import type { APIRoute } from 'astro';

const WEBFINGER_BODY = {
  aliases: ['https://mas.to/@davidsneighbour'],
  links: [
    {
      href: 'https://mas.to/@davidsneighbour',
      rel: 'http://webfinger.net/rel/profile-page',
      type: 'text/html',
    },
    {
      href: 'https://mas.to/users/davidsneighbour',
      rel: 'self',
      type: 'application/activity+json',
    },
    {
      rel: 'http://ostatus.org/schema/1.0/subscribe',
      template: 'https://mas.to/authorize_interaction?uri={uri}',
    },
    {
      href: 'https://media.mas.to/accounts/avatars/109/705/059/351/505/561/original/1922ed28820230d4.jpg',
      rel: 'http://webfinger.net/rel/avatar',
      type: 'image/jpeg',
    },
  ],
  subject: 'acct:davidsneighbour@mas.to',
} as const;

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
