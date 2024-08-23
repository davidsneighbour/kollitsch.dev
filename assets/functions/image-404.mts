import type { Config } from '@netlify/functions'

export default async function () {
  return new Response('<html><!-- The HTML for your 404 page goes here --></html>', {
    headers: {
      'content-type': 'text/html',
      'netlify-cdn-cache-control': 'durable, immutable, max-age=31536000, public'
    },
    status: 404
  })
}

export const config: Config = {
  pattern: '^.*\\.jpe?g$',
  preferStatic: true
}
