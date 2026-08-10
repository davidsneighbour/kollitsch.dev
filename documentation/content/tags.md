---
title: Tags
tags: []
created: 2026-07-28T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

Tags connect blog posts, tag archive pages, featured tag cards, and the public
tag overview. See [Frontmatter](frontmatter.md) for the complete frontmatter
property index.

## Source Files

| Area | File |
| --- | --- |
| Tag metadata | `src/content/tags/*.md` |
| Tag schema | `src/content.config.ts` |
| Tag helpers | `src/utils/tags.ts` |
| Tag overview | `src/pages/tags/index.astro` |
| Tag archive routes | `src/pages/tags/[tag]/page/[page].astro` |
| Weighted cloud | `src/components/content/taxonomy/TagCloud.astro` |
| Search field | `src/components/content/taxonomy/TagFilter.astro` |
| Flat list | `src/components/content/taxonomy/TagList.astro` |

## Post Tags

Posts list tags in blog frontmatter. Tags are normalised by `src/utils/tags.ts`
before they are used for URLs, counts, aliases, and display labels.
Write tag ids in lowercase kebab-case: words are separated with dashes, never
spaces, underscores, camel case, PascalCase, leading hash marks, or
slash-prefixed route aliases.

```yaml
---
title: Example Post
tags:
  - astro
  - 100-days-to-offload
---
```

Every tag used by a post can generate a tag archive route. A tag does not need a
metadata file to be routeable, but metadata files are preferred for tags that
need a controlled label, aliases, featured-card data, or overview options.

## Tag Metadata

Each file in `src/content/tags/` describes one canonical tag. The required
fields are `id` and `title`.

```yaml
---
id: 100-days-to-offload
aliases:
  - 100daystooffload
hideInTagCloud: true
title: "100 Days To Offload challenge"
linktitle: "100 Days To Offload"
badge:
  variant: green
  icon:
    name: bookmark-check-fill
    position: inline-start
description: "Read more about this in the [blog post](/blog/2022/100daystooffload/) and see the [100 Days To Offload](https://100daystooffload.com/) website for more information."
cover:
  type: image
  src: tags/100daysToOffload.jpg
  title: "100 Days To Offload badge"
---
```

| Field | Required | Purpose |
| --- | --- | --- |
| `id` | yes | Canonical lowercase kebab-case tag id used for URLs and alias resolution |
| `title` | yes | Full title for tag metadata and card contexts |
| `linktitle` | no | Plain-text label used in tag links; falls back to `title` |
| `aliases` | no | Lowercase alternative ids that resolve to the canonical tag |
| `badge` | no | Badge presentation metadata; see [Tag Badges](#tag-badges) |
| `description` | no | Markdown-capable tag description |
| `featured` | no | Enables the tag card on the tag overview when the tag is present |
| `weight` | no | Sort weight for featured-tag helpers; defaults to `0` |
| `cover` | no | Cover image or video metadata for tag cards |
| `hideInTagCloud` | no | Hides the tag from the default weighted cloud only |

## Tag Badges

Use `badge` when a tag needs a specific chip treatment in tag lists, tag clouds,
or post metadata. The object follows the local
[`Badge`](../components/shared/elements/badge.md) component model, which mirrors
the shadcn badge pattern: choose a `variant`, then add optional custom classes
only when a variant is not enough.

```yaml
---
id: 100-days-to-offload
badge:
  variant: green
  class:
    - bg-green-50
    - text-green-700
    - dark:bg-green-950
    - dark:text-green-300
  icon:
    name: bookmark-check-fill
    position: inline-start
---
```

| Field | Required | Purpose |
| --- | --- | --- |
| `variant` | no | Badge template: `default`, `secondary`, `destructive`, `outline`, `ghost`, `link`, `green`, `gray`, or `red` |
| `class` | no | Extra Tailwind classes as a string or list; appended after the variant classes |
| `icon.name` | no | Icon name rendered inside the badge via `astro-icon/components` |
| `icon.position` | no | `inline-start` or `inline-end`; defaults to `inline-start` |
| `icon.color` | no | Optional inline icon colour override |

Do not use the old top-level `class` or `icon` fields for new tag metadata.
Keep presentation metadata under `badge`.

## Tag Overview

The tag overview at `/tags/` has two different tag sets:

- The default weighted cloud uses `getTags({ order: 'label-asc' })`, so it
  respects the configured tag threshold.
- The search index uses `getTags({ order: 'label-asc', threshold: 1 })`, so it
  can find every tag with at least one post.

The search field displays the note “Showing tags used more than once. Search
includes all tags.” The visible cloud is intentionally smaller, while search can
surface single-use tags and tags hidden from the default cloud.

The weighted font-size range is calculated only from tags visible in the default
cloud. Search-only matches use the normal baseline size instead of affecting the
cloud scale.

## Hiding Noisy Tags

Use `hideInTagCloud: true` when a tag is useful for post metadata or archives
but too noisy for the public overview. This is intended for challenge, migration,
or operational tags that appear on many posts.

```yaml
---
id: 100-days-to-offload
hideInTagCloud: true
title: "100 Days To Offload challenge"
---
```

`hideInTagCloud` only affects the default tag cloud. The tag remains available
for:

- post frontmatter,
- tag archive routes,
- tag links from posts,
- tag search on `/tags/`.

Do not use `draft: true` to hide an otherwise published tag from the cloud.
Draft visibility is for blog-post publication state, not tag overview curation.

## Featured Tags

Tag cards on the overview come from `getFeaturedTagEntries()`. Set
`featured: true` on a tag metadata file to make it eligible, and use `weight` to
control weight-first ordering.

In production, the overview filters featured cards against the visible cloud tag
ids. A tag hidden with `hideInTagCloud: true` is therefore also omitted from the
featured-card grid on that page.

## Component References

- [`TagCloud`](../components/content/taxonomy/tag-cloud.md)
- [`TagFilter`](../components/content/taxonomy/tag-filter.md)
- [`TagList`](../components/content/taxonomy/tag-list.md)
- [`Tag`](../components/content/taxonomy/tag.md)
