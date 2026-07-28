---
title: Netlify Response Headers
tags: []
created: 2026-07-26T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

Netlify reads response headers (caching, CORS, security headers, etc.) from a
`_headers` file at the root of the deploy. This site never hand-writes that
file; it's generated at build time from typed data so headers stay reviewable
and testable like any other source.

## Source of truth

**[`src/data/headers.ts`](../../src/data/headers.ts)**

Two arrays of `PathRule` objects:

* `headerRules` - the site's base rules (security headers, `Cache-Control` for
  static assets, CORS for the Giscus theme stylesheets, and so on).
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

Set `disabled: true` on a `HeaderEntry` to render it as a commented-out line
(`# Name: value`, indented) instead of an active header - useful for keeping
a rule around without shipping it.

## Generation

**[`src/scripts/build/build-headers.ts`](../../src/scripts/build/build-headers.ts)**
renders `headerRules`, `moduleHeaderRules`, and any `extraRules` (see below)
into the plain-text `_headers` format Netlify expects.

**[`src/scripts/build/build-hooks.ts`](../../src/scripts/build/build-hooks.ts)**
wires this into the `astro:build:done` hook, writing `dist/_headers` after the
Astro build completes. Writing after the build (rather than committing a
static file under `public/`) lets the `Expires` header reflect the actual
deploy timestamp.

Never edit `dist/_headers` directly - it's regenerated on every build.

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
scans `src/content/blog/**/*.{md,mdx}` directly with `gray-matter`. For every
published post, it generates an HTML permalink rule with `Link:
<...md>; rel="alternate"; type="text/markdown"` and `Vary: Accept`, plus a
matching `.md` representation rule with `Content-Type: text/markdown`,
`Link: <.../>; rel="alternate"; type="text/html"`, and `Vary: Accept`. Any
frontmatter `headers` map is folded into the HTML permalink rule. This runs
inside the `astro:build:done` hook, so the result is passed as `extraRules` to
`generateHeaders()` and appended after `headerRules`/`moduleHeaderRules` under
a `# headers from page frontmatter` section.

Frontmatter is read straight off disk rather than through `getCollection()`
from `astro:content`, because `astro:content` is a Vite virtual module scoped
to the page-render pipeline - it isn't resolvable from an Astro integration
hook (which is what generates `_headers`).

Draft posts (`draft: true`) are skipped; a header rule for a page that isn't
published would be dead weight in the generated file.

## Adding a new static rule

Add a `PathRule` to `headerRules` (or `moduleHeaderRules` for a
feature-specific rule) in `src/data/headers.ts`. Keep in mind Netlify's
`_headers` glob syntax only supports **one trailing splat per path** - a
pattern like `/assets/styles/giscus-*.css`, with the wildcard in the middle
of a filename, silently never matches anything. Scope to a whole directory
(`/assets/styles/*`) or list exact filenames instead.

## Verifying the output

Render the file without running a full build:

```bash
npx tsx -e "
import { renderHeaders } from './src/scripts/build/build-headers.ts';
console.log(renderHeaders());
"
```

Or inspect the real output after a build at `dist/_headers`.
