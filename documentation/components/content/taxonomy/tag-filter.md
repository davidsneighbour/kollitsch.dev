---
title: TagFilter
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders a search input that fuzzy-filters matching tag lists elsewhere on the
page, matched by a shared `filterId`.

See the content-level [tags documentation](../../../content/tags.md) for how the
tag overview combines the default cloud with all-tag search.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/taxonomy/TagFilter.astro` |
| Data | none |
| Tests | [`src/components/content/taxonomy/TagFilter.test.ts`](../../../../src/components/content/taxonomy/TagFilter.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `filterId` | `string` | `"default"` | Must match the `filterId` passed to the target `TagList` or `TagCloud`; sanitised before being used in the input's `id` |
| `note` | `string` | none | Optional explanatory note rendered between the input and the live status |
| `placeholder` | `string` | `"Search tags..."` | Search input placeholder text |

## Usage

```astro
---
import TagFilter from '@components/content/taxonomy/TagFilter.astro';
import TagList from '@components/content/taxonomy/TagList.astro';
---

<TagFilter filterId="tag-cloud" />
<TagList tags={allTags} filterId="tag-cloud" />
```

The tag overview passes a short note instead of using a long placeholder:

```astro
<TagFilter
  filterId="tag-cloud"
  note="Showing tags used more than once. Search includes all tags."
/>
```

## Behaviour

Renders a `type="search"` input with a live-region status element (`aria-live="polite"`) below it. An inline `<script>`:

- On `astro:page-load` (and once immediately for non-router loads), finds every `[data-tag-filter]` root on the page and initialises it.
- Locates all `[data-tag-filter-list][data-tag-filter-id="<filterId>"]`
  elements matching this filter's `filterId`, and collects every `a[data-label]`
  inside them.
- On input, runs a fuzzy in-order character match (`fuzzyInOrder`, for example
  `"koll"` matches `"kollitsch"`) between the query and each link's
  `data-label`, toggling `hidden` on non-matching links and updating the status
  text (`"N / M tags"`).
- Keeps links with `data-tag-filter-default-hidden="true"` hidden while the
  search field is empty. These links become searchable once a query is present.
- Guards against double-binding its `input` listener across view-transition navigations via a `dataset.tagFilterBound` flag on the input element.

Note that [`TagList`](tag-list.md) ships its own, near-identical copy of this filtering script (scoped to a single list rather than a `filterId` lookup); the two are not currently unified.

## Extending

If both components' filter scripts diverge further, consider extracting the shared `fuzzyInOrder` matching logic into `src/utils/` so both stay in sync.
