export interface HeaderEntry {
  name: string;
  value: string;
  /** Renders the header as a comment line (`  # Name: value`) rather than an active header. */
  disabled?: boolean;
}

export interface PathRule {
  path: string;
  /** Optional comment block rendered above the path line. */
  comment?: string;
  headers: HeaderEntry[];
  /**
   * When true the generator appends an `Expires` header set to build time + 1 year.
   * Rules that already carry `Cache-Control: immutable` should set this so the date
   * is always accurate to the deploy rather than being hardcoded.
   */
  addExpires?: boolean;
}

/**
 * Base Netlify `_headers` rules.
 *
 * FRONTMATTER HEADERS
 * ────────────────────
 * A blog post can add headers scoped to its own permalink via frontmatter:
 *
 *   headers:
 *     X-Robots-Tag: noindex
 *
 * No path is given because it's implicit (the post's own URL). See the
 * `headers` field on `blogSchema` in `src/content.config.ts`, and
 * `src/scripts/build/collect-frontmatter-headers.ts`, which scans post
 * frontmatter at build time and turns matches into `PathRule` objects
 * appended after `headerRules`/`moduleHeaderRules` by
 * `generateHeadersIntegration` in `build-hooks.ts`.
 */
export const headerRules: PathRule[] = [
  {
    path: '/',
    headers: [
      { name: 'Accept-Encoding', value: 'gzip, deflate, br' },
      {
        name: 'Link',
        value: '</llms.txt>; rel="service-desc"; type="text/markdown"',
      },
      {
        name: 'Link',
        value: '</llms-full.txt>; rel="service-desc"; type="text/markdown"',
      },
      {
        name: 'Permissions-Policy',
        value:
          'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
      },
    ],
  },
  {
    path: '/*',
    headers: [
      {
        name: 'Content-Security-Policy',
        value:
          "base-uri 'self'; child-src 'self'; connect-src 'self' https://analytics.dnbhub.xyz/ https://api.github.com/ cloudflareinsights.com; default-src 'self'; font-src 'self'; form-action 'self' https://formspree.io/f/xoqyzooe; frame-ancestors 'self'; frame-src 'self' https://open.spotify.com/ https://giscus.app/ https://www.youtube-nocookie.com; img-src 'self' https://analytics.dnbhub.xyz/ ytimg.googleusercontent.com https://i.ytimg.com; manifest-src 'self'; media-src 'self'; object-src 'none'; script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval' https://giscus.app/ https://unpkg.com https://identity.netlify.com static.cloudflareinsights.com https://analytics.dnbhub.xyz/; style-src 'self' 'unsafe-inline' https://giscus.app/; worker-src 'self'; upgrade-insecure-requests;",
        disabled: true,
      },
      { name: 'Referrer-Policy', value: 'no-referrer' },
      { name: 'X-Content-Type-Options', value: 'nosniff' },
      { name: 'X-Frame-Options', value: 'DENY' },
      { name: 'X-XSS-Protection', value: '1; mode=block' },
      { name: 'Link', value: '<https://analytics.dnbhub.xyz>; rel="preconnect"' },
    ],
  },
  {
    path: '/*.html',
    headers: [{ name: 'Accept-Encoding', value: 'gzip, deflate, br' }],
  },
  {
    path: '/*.manifest',
    headers: [
      { name: 'Accept-Encoding', value: 'gzip, deflate, br' },
      { name: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      { name: 'Content-Type', value: 'application/manifest+json; charset=utf-8' },
    ],
    addExpires: true,
  },
  {
    path: '/*.js',
    headers: [
      { name: 'Accept-Encoding', value: 'gzip, deflate, br' },
      { name: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      { name: 'Content-Type', value: 'text/javascript; charset=utf-8' },
    ],
    addExpires: true,
  },
  {
    path: '/*.ico',
    headers: [
      { name: 'Accept-Encoding', value: 'gzip, deflate, br' },
      { name: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ],
    addExpires: true,
  },
  {
    path: '/*.css',
    headers: [
      { name: 'Accept-Encoding', value: 'gzip, deflate, br' },
      { name: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ],
    addExpires: true,
  },
  {
    path: '/*.jpg',
    headers: [
      { name: 'Accept-Encoding', value: 'gzip, deflate, br' },
      { name: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ],
    addExpires: true,
  },
  {
    path: '/*.jpeg',
    headers: [
      { name: 'Accept-Encoding', value: 'gzip, deflate, br' },
      { name: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ],
    addExpires: true,
  },
  {
    path: '/*.png',
    headers: [
      { name: 'Accept-Encoding', value: 'gzip, deflate, br' },
      { name: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ],
    addExpires: true,
  },
  {
    path: '/*.gif',
    headers: [
      { name: 'Accept-Encoding', value: 'gzip, deflate, br' },
      { name: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ],
    addExpires: true,
  },
  {
    path: '/*.eot',
    headers: [{ name: 'Accept-Encoding', value: 'gzip, deflate, br' }],
  },
  {
    path: '/*.ttf',
    headers: [{ name: 'Accept-Encoding', value: 'gzip, deflate, br' }],
  },
  {
    path: '/assets/*',
    headers: [{ name: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    addExpires: true,
  },
  {
    path: '/assets/styles/*',
    comment:
      "giscus.app fetches custom theme stylesheets via fetch() from its own origin, which " +
      "requires an explicit CORS allowance - see Giscus.astro. Netlify's _headers globbing only " +
      'supports a single trailing splat, so this cannot be scoped to `giscus-*.css` specifically. ' +
      "Cache-Control is overridden (short, no `immutable`) because these files aren't " +
      'content-hashed and can change without a URL bump - the `/assets/*` immutable default ' +
      "would otherwise leave stale, pre-CORS-fix responses cached in giscus.app's request " +
      'partition for up to a year.',
    headers: [
      { name: 'Access-Control-Allow-Origin', value: 'https://giscus.app' },
      { name: 'Cache-Control', value: 'public, max-age=300, must-revalidate' },
    ],
  },
  {
    path: '/images/*',
    headers: [{ name: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    addExpires: true,
  },
];

/**
 * Rules contributed by site modules or integrations.
 * These are appended after `headerRules` in the generated file under a
 * labelled section comment so they are easy to identify.
 */
export const moduleHeaderRules: PathRule[] = [
  {
    path: '/feed.json',
    headers: [
      { name: 'Accept-Encoding', value: 'gzip, deflate, br' },
      { name: 'Content-Type', value: 'application/json; charset=utf-8' },
    ],
  },
];
