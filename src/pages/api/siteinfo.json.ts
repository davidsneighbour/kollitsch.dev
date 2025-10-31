// this is static and has no parameters and can be prerendered
export const prerender = true;

import type { APIContext } from 'astro';

export function GET({ generator, site }: APIContext) {
  const body = JSON.stringify({ generator, site });
  return new Response(body);
}
