import { following } from '@data/socialspec';
import { renderFollowingOpml, SOCIALSPEC_FILES } from '@utils/socialspec.pure';
import type { APIRoute } from 'astro';

export const prerender = true;

/**
 * FollowSpec subscription list. Production headers (content type, CORS) come
 * from `src/data/headers.ts`.
 *
 * @see https://followspec.org/
 */
export const GET: APIRoute = () =>
  new Response(renderFollowingOpml(following), {
    headers: { 'Content-Type': SOCIALSPEC_FILES.following.contentType },
  });
