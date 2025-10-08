import type { APIContext } from 'astro';

export function GET({ generator, site }: APIContext) {
  const body = JSON.stringify({ generator, site });
  return new Response(body);
}
