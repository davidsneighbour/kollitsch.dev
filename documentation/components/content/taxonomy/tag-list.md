---
title: TagList
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders a flat, filterable list of tags with optional counts, used on the tags index page and in the browser test page for tags.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/taxonomy/TagList.astro` |
| Data | none (receives tags via the `tags` prop, typically produced by [`src/utils/tags.ts`](../../../../src/utils/tags.ts)) |
| Tests | [`src/components/content/taxonomy/TagList.test.ts`](../../../../src/components/content/taxonomy/TagList.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tags` | `TagListItem[]` | required | Tags to render; each item provides `id`, `label`, `count`, `url`, and an optional `icon` |
| `showCounts` | `boolean` | `true` | When `true`, appends `(count)` to each tag's label |
| `filterId` | `string` | `"default"` | Written to `data-tag-filter-id`, matched against a [`TagFilter`](tag-filter.md) with the same `filterId` |

## Usage

```astro
---
import TagList from '@components/content/taxonomy/TagList.astro';
---

<TagList tags={allTagsWithCounts} filterId="tag-cloud" />
```

## Behaviour

Renders `(none)` when `tags` is empty. Otherwise renders one [`Tag`](tag.md) per item, with `dataLabel` lowercased at render time for locale-safe client-side matching. The component ships its own inline `<script>` that performs the same fuzzy in-order filtering as [`TagFilter`](tag-filter.md) (see that component for the matching algorithm), scoped directly to its own `[data-tag-filter-list]` element rather than looking one up by `filterId`; the two filtering scripts are not currently shared.

There is also an older, unused duplicate of this component at `src/components/content/metadata/TagList.astro` with a different prop shape (`NormalizedTag[]` instead of `TagListItem[]`); it is tracked separately in `scratch/obsolete-components.md` pending a decision on removal.
