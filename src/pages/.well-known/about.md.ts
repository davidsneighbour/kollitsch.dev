import { about } from '@data/socialspec';
import { renderAboutMarkdown, SOCIALSPEC_FILES } from '@utils/socialspec.pure';
import type { APIRoute } from 'astro';

export const prerender = true;

/**
 * AboutSpec Markdown profile. Production headers (content type, CORS) come
 * from `src/data/headers.ts`.
 *
 * @see https://aboutspec.org/
 */
export const GET: APIRoute = () =>
  new Response(renderAboutMarkdown(about), {
    headers: { 'Content-Type': SOCIALSPEC_FILES.about.contentType },
  });
