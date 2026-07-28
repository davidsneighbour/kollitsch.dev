---
title: Tags
tags: []
created: 2026-07-28T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

Tags connect blog posts, tag archive pages, featured tag cards, and the public
tag overview.

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

```yaml
---
title: Example Post
tags:
  - astro
  - 100daystooffload
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
id: 100daystooffload
hideInTagCloud: true
title: "100 Days To Offload challenge"
linktitle: "100 Days To Offload"
class: success
description: "Read more about this in the [blog post](/blog/2022/100daystooffload/) and see the [100 Days To Offload](https://100daystooffload.com/) website for more information."
icon: bookmark-check-fill
cover:
  type: image
  src: tags/100daysToOffload.jpg
  title: "100 Days To Offload badge"
---
```

| Field | Required | Purpose |
| --- | --- | --- |
| `id` | yes | Canonical lowercase tag id used for URLs and alias resolution |
| `title` | yes | Full title for tag metadata and card contexts |
| `linktitle` | no | Plain-text label used in tag links; falls back to `title` |
| `aliases` | no | Lowercase alternative ids that resolve to the canonical tag |
| `class` | no | Legacy tag class consumed by tag presentation |
| `description` | no | Markdown-capable tag description |
| `featured` | no | Enables the tag card on the tag overview when the tag is present |
| `weight` | no | Sort weight for featured-tag helpers; defaults to `0` |
| `icon` | no | Icon shown by tag components |
| `cover` | no | Cover image or video metadata for tag cards |
| `hideInTagCloud` | no | Hides the tag from the default weighted cloud only |

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
id: 100daystooffload
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
