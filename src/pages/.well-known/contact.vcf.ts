import { contact } from '@data/socialspec';
import { renderContactVcard, SOCIALSPEC_FILES } from '@utils/socialspec.pure';
import type { APIRoute } from 'astro';

export const prerender = true;

/**
 * ContactSpec vCard. Production headers (content type, CORS) come from
 * `src/data/headers.ts`.
 *
 * @see https://contactspec.org/
 */
export const GET: APIRoute = () =>
  new Response(renderContactVcard(contact), {
    headers: { 'Content-Type': SOCIALSPEC_FILES.contact.contentType },
  });
