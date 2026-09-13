---
title: Cloudflare response headers
tags: []
created: 2026-07-26T00:00:00+07:00
updated: 2026-09-13T00:00:00+07:00
---

Cloudflare Workers Static Assets reads response headers from a `_headers` file at the root of the deploy. This site never hand-writes that generated output; it is created at build time from typed data so headers stay reviewable and testable like any other source.

## Source of truth

**[`src/data/headers.ts`](../../src/data/headers.ts)**

Two arrays of `PathRule` objects:

* `headerRules` - the site's base rules, including security headers, `Cache-Control` for static assets, homepage `Link` discovery headers, Markdown alternate discovery for blog posts, and CORS for the Giscus theme stylesheet.
* `moduleHeaderRules` - rules contributed by specific site features (feeds,
  etc.), kept separate so they render under their own labelled section in the
  generated file.

A `PathRule` looks like:

```ts
{
  path: '/assets/styles/*',
  comment: 'optional comment rendered above the path line',
  headers: [
    { name: 'Cache-Control', value: 'public, max-age=300, must-revalidate' },
  ],
  addExpires: true, // appends an Expires header set to build time + 1 year
}
```

`disabled: true` on a `HeaderEntry` keeps a source-side candidate rule inactive. Disabled headers are not rendered into `dist/_headers`, because Cloudflare applies line-length limits to the deploy file.

## Generation

**[`src/scripts/build/build-headers.ts`](../../src/scripts/build/build-headers.ts)**
renders `headerRules`, `moduleHeaderRules`, and any `extraRules` (see below)
into the plain-text `_headers` format Cloudflare expects.

**[`src/scripts/build/build-hooks.ts`](../../src/scripts/build/build-hooks.ts)**
wires this into the `astro:build:done` hook, writing `dist/_headers` after the
Astro build completes. Writing after the build (rather than committing a
static file under `public/`) lets the `Expires` header reflect the actual
deploy timestamp.

Never edit `dist/_headers` directly - it's regenerated on every build.

## Blog and Markdown alternate headers

Blog post HTML pages and `.md` representations are advertised with generic Cloudflare header patterns:

```text
/blog/:year/:slug/
  Link: </blog/:year/:slug.md>; rel="alternate"; type="text/markdown"
  Vary: Accept

/blog/:year/:slug.md
  Content-Type: text/markdown; charset=utf-8
  Link: </blog/:year/:slug/>; rel="alternate"; type="text/html"
  Vary: Accept
```

These two pattern rules replace the old per-post generated rules. The behaviour stays the same for published blog URLs, but the generated `_headers` file stays inside Cloudflare's 100-rule limit.

The generated `_headers` rules advertise Markdown alternates but do not trigger same-URL `Accept: text/markdown` negotiation. The homepage points automated clients to `/llms.txt` and `/llms-full.txt`; blog posts point to their generated `.md` targets.

## Per-post frontmatter headers

A blog post can add headers scoped to its own permalink without touching
`headers.ts`, via a flat frontmatter map:

```yaml
---
title: My Post
headers:
  X-Robots-Tag: noindex
---
```

No path is given because it's implicit - the rule always targets the post's
own URL (`/blog/{year}/{slug}/`). This is defined as an optional `headers`
field (`Record<string, string>`) on `blogSchema` in
[`src/content.config.ts`](../../src/content.config.ts).

### How it's collected

**[`src/scripts/build/collect-frontmatter-headers.ts`](../../src/scripts/build/collect-frontmatter-headers.ts)**
scans `src/content/blog/**/*.{md,mdx}` directly with `gray-matter`. It only emits rules for published posts with explicit `headers` frontmatter. This runs inside the `astro:build:done` hook, so the result is passed as `extraRules` to `generateHeaders()` and appended after `headerRules`/`moduleHeaderRules` under a `# headers from page frontmatter` section.

Frontmatter is read straight off disk rather than through `getCollection()`
from `astro:content`, because `astro:content` is a Vite virtual module scoped
to the page-render pipeline - it isn't resolvable from an Astro integration
hook (which is what generates `_headers`).

Draft posts (`draft: true`) are skipped; a header rule for a page that isn't
published would be dead weight in the generated file.

## Adding a new static rule

Add a `PathRule` to `headerRules` (or `moduleHeaderRules` for a
feature-specific rule) in `src/data/headers.ts`. Keep the Cloudflare limits in mind: `_headers` supports 100 rules, and each line can be at most 2,000 characters.

Run the hosting preflight after changing header rules:

```bash
npm run build
npm run hosting:check
```

## Verifying the output

Render the file without running a full build:

```bash
npx tsx -e "
import { renderHeaders } from './src/scripts/build/build-headers.ts';
console.log(renderHeaders());
"
```

Or inspect the real output after a build at `dist/_headers`.
