---
title: Alias Redirects
tags: []
created: 2026-07-28T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

Blog posts can define URL aliases in frontmatter. Aliases are generated into Astro's configured redirect map during `astro.config.ts` loading and are merged with the static redirects in `src/data/redirects.json`.

## Frontmatter

Use either a single string or an array of strings:

```yaml
aliases: old-post-slug
```

```yaml
aliases:
  - old-post-slug
  - /legacy/old-post-slug
```

`src/content.config.ts` validates `aliases` as `string | string[]` and normalises a single string to an array for collection entries.

## Path Semantics

Relative aliases are resolved against the current blog route folder. For a post at `src/content/blog/2026/current-post/index.md`, the canonical route is `/blog/2026/current-post/`, so:

```yaml
aliases: old-post
```

generates:

```json
{
  "/blog/2026/old-post/": "/blog/2026/current-post/"
}
```

Absolute aliases start at the site root:

```yaml
aliases: /legacy/old-post
```

generates:

```json
{
  "/legacy/old-post/": "/blog/2026/current-post/"
}
```

Aliases are local pathnames only. Protocol URLs, protocol-relative URLs, query strings, hash fragments, and relative dot segments are rejected.

## Conflict Handling

Alias redirects fail loudly during config loading when:

* two generated aliases resolve to the same source path,
* a generated alias conflicts with a key in `src/data/redirects.json`,
* an alias resolves to the post's canonical route.

The implementation lives in `src/utils/redirects.ts`; tests live beside it in `src/utils/redirects.test.ts`.
