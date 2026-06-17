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
 * EXTENSION POINT — frontmatter headers
 * ─────────────────────────────────────
 * Pages and directories can add per-path rules via frontmatter or a sidecar file.
 * The build integration in `src/scripts/build/build-headers.ts` accepts an
 * `extraRules: PathRule[]` array that is appended after these base rules.
 *
 * Planned sources:
 *   1. Page frontmatter:  headers: { 'X-Robots-Tag': 'noindex' }
 *   2. Directory sidecar: src/content/blog/2025/_headers.json
 *
 * When implemented, the integration's `astro:build:start` hook will call
 * `getCollection('blog')`, filter entries that carry `data.headers`, and convert
 * them into `PathRule` objects that are forwarded to the generator.
 */
export const headerRules: PathRule[] = [
  {
    path: '/',
    headers: [
      { name: 'Accept-Encoding', value: 'gzip, deflate, br' },
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
          "base-uri 'self'; child-src 'self'; connect-src 'self' https://analytics.dnbhub.xyz/ https://api.github.com/ cloudflareinsights.com; default-src 'self'; font-src 'self' https://d33wubrfki0l68.cloudfront.net; form-action 'self' https://formspree.io/f/xoqyzooe; frame-ancestors 'self'; frame-src 'self' https://open.spotify.com/ https://giscus.app/ https://www.youtube-nocookie.com; img-src 'self' https://analytics.dnbhub.xyz/ https://d33wubrfki0l68.cloudfront.net ytimg.googleusercontent.com https://i.ytimg.com; manifest-src 'self'; media-src 'self'; object-src 'none'; script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval' https://d33wubrfki0l68.cloudfront.net https://giscus.app/ https://unpkg.com https://identity.netlify.com static.cloudflareinsights.com https://analytics.dnbhub.xyz/; style-src 'self' 'unsafe-inline' https://d33wubrfki0l68.cloudfront.net https://giscus.app/; worker-src 'self'; upgrade-insecure-requests;",
        disabled: true,
      },
      { name: 'Referrer-Policy', value: 'no-referrer' },
      { name: 'X-Content-Type-Options', value: 'nosniff' },
      { name: 'X-Frame-Options', value: 'DENY' },
      { name: 'X-XSS-Protection', value: '1; mode=block' },
      { name: 'Link', value: '<https://analytics.dnbhub.xyz>; rel="preconnect"' },
      {
        name: 'Link',
        value: '<https://d33wubrfki0l68.cloudfront.net>; rel="preconnect"',
      },
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
