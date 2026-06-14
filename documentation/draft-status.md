---
title: Draft Post Visibility
tags: []
created: 2026-06-14T00:00:00+07:00
updated: 2026-06-14T00:00:00+07:00
---

Blog posts can be marked as drafts via the `draft: true` frontmatter field. The visibility of draft posts is controlled by a single central mechanism that automatically respects the current Astro environment.

## Behaviour

| Command | `import.meta.env.DEV` | Draft posts |
| --- | --- | --- |
| `npx astro dev` | `true` | visible everywhere |
| `npx astro build` | `false` | hidden, not output |

No configuration flag is needed; the environment determines everything.

## Central mechanism

**[`src/utils/content.pure.ts`](../src/utils/content.pure.ts)**

Two exported functions form the single source of truth:

```ts
// Returns true when running under `astro dev`, false during `astro build`.
export function shouldShowDrafts(): boolean {
  return import.meta.env.DEV === true;
}

// Pass-through in dev; strips draft entries in production.
export function filterDraftEntries<TEntry extends { data: { draft?: boolean | undefined } }>(
  entries: readonly TEntry[],
): TEntry[] {
  if (shouldShowDrafts()) return [...entries];
  return entries.filter((entry) => entry.data.draft !== true);
}
```

Every collection query that needs to respect draft status **must** call `filterDraftEntries()` instead of inlining `!data.draft`.

## Where drafts are filtered

These are the call sites that use `filterDraftEntries`:

| File | Purpose |
| --- | --- |
| `src/utils/content.ts` → `getPostsSortedByDraft` | Blog listing pages, tag pages, year archives |
| `src/utils/content.ts` → `getHomepagePosts` | Homepage featured + recent posts |
| `src/pages/blog/[year]/[slug]/index.astro` `getStaticPaths` | Single post route generation |
| `src/components/content/pagenav/PaginationSingle.astro` | Prev/next post navigation |

All tag-related queries go through `getPostsSortedByDraft` (via `src/utils/tags.ts`), so tag overview pages, tag post lists, and tag counts all respect draft visibility automatically.

## Always-excluded (external-facing)

The following files always exclude drafts regardless of environment, because they produce output that is consumed by external services:

* `src/pages/rss.xml.js`, `src/pages/atom.xml.js`, `src/pages/feed.json.js` (feed readers)
* `src/pages/llms.txt.ts`, `src/pages/llms-full.txt.ts`, `src/pages/llms/[...slug].txt.ts` (LLM context files)

The sitemap (`@astrojs/sitemap`) is only generated during `astro build`, so it never includes drafts by construction.

## Production safety net

In addition to route generation filtering, the single post page has a runtime guard:

```ts
// src/pages/blog/[year]/[slug]/index.astro
if (import.meta.env.PROD && post.data.draft) {
  throw new Error(`[blog] Tried to render draft post in production: ${post.id}`);
}
```

This is a belt-and-suspenders check. It should never trigger because `getStaticPaths` already excludes drafts in production, but it prevents silent data leaks if the filtering were ever bypassed.

## Draft indicator in dev

The `Head.astro` component sets `robots: "noindex, nofollow, noarchive"` on all draft posts. This means draft posts that are visible in dev are not indexable if the dev server is accidentally exposed.

## Adding a draft post

Set `draft: true` in the post's frontmatter:

```yaml
---
title: My Work-in-Progress Post
date: 2026-06-14
draft: true
---
```

Run `npx astro dev` to see it appear in listings, tag pages, and navigation. Run `npx astro build` and the post will not be included in any output.

## Testing

Unit tests for `shouldShowDrafts` and `filterDraftEntries` live in [`src/utils/content.pure.test.ts`](../src/utils/content.pure.test.ts). In Vitest, `import.meta.env.DEV` is `true` by default, so tests run with draft visibility on, matching the dev experience.
