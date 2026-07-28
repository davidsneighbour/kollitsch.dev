---
title: TagCloud
tags: []
created: 2026-07-28T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

Renders a weighted, filterable cloud of tag links.

See the content-level [tags documentation](../../../content/tags.md) for tag
metadata fields, overview setup, and hiding noisy tags from the default cloud.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/taxonomy/TagCloud.astro` |
| Data | none (receives tags via the `tags` prop, typically produced by [`src/utils/tags.ts`](../../../../src/utils/tags.ts)) |
| Tests | [`src/components/content/taxonomy/TagCloud.test.ts`](../../../../src/components/content/taxonomy/TagCloud.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tags` | `TagListItem[] \| Map<string, number>` | required | Tags to render |
| `searchTags` | `TagListItem[]` | `tags` | Optional superset used by `TagFilter`; entries outside `tags` are hidden until the query matches |
| `minSize` | `number` | `0.75` | Smallest rendered font size in `rem` |
| `maxSize` | `number` | `2.0` | Largest rendered font size in `rem` |
| `showCounts` | `boolean` | `true` | When `true`, appends `(count)` to each tag label |
| `filterId` | `string` | `"default"` | Written to `data-tag-filter-id`, matched against a [`TagFilter`](tag-filter.md) with the same `filterId` |

## Usage

```astro
---
import TagCloud from '@components/content/taxonomy/TagCloud.astro';
---

<TagCloud tags={allTagsWithCounts} filterId="tag-cloud" />
```

## Behaviour

`TagCloud` is distinct from [`TagList`](tag-list.md): it scales each link
between `minSize` and `maxSize` based on the tag's post count, while `TagList`
renders uniform pill-style [`Tag`](tag.md) components. Both expose
`data-tag-filter-list` and `data-label`, so they can be filtered by
[`TagFilter`](tag-filter.md).

The main tags index uses `TagCloud` because the page heading promises a
cloud-style display. Test pages may still use `TagList` when a flat pill list is
the desired component under inspection.

The main tags index filters out tag metadata entries whose
`hideInTagCloud` option is `true` before rendering the cloud. This keeps
high-volume utility or challenge tags addressable through posts and tag routes
without letting them dominate the public overview.

The page passes all tags with at least one post through `searchTags`, so
single-use tags and tags hidden from the default cloud are still discoverable
when filtering.

Font-size scaling is calculated from the default visible tags only. Search-only
entries render at the normal baseline size when a query reveals them.
