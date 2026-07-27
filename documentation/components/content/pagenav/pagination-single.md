---
title: PaginationSingle
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders "older post" / "newer post" navigation links at the bottom of a single blog post, based on publish-date order.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/pagenav/PaginationSingle.astro` |
| Data | none; loads and sorts the `blog` collection itself |
| Tests | [`src/components/content/pagenav/PaginationSingle.test.ts`](../../../../src/components/content/pagenav/PaginationSingle.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `post` | `CollectionEntry<"blog">` | required | The post currently being viewed; used to find its neighbours in the sorted post list |

## Usage

```astro
---
import PaginationSingle from '@components/content/pagenav/PaginationSingle.astro';
---

<PaginationSingle post={post} />
```

## Behaviour

This component has no client-side behaviour. It loads the full `blog` collection, filters out drafts via `filterDraftEntries()`, and sorts the remainder newest-first by `data.date`. It then finds `post`'s index in that sorted list: the entry immediately after it (`nextPost`, an older post) renders as a "back in time" link on the left, and the entry immediately before it (`prevPost`, a newer post) renders as a "forward in time" link on the right, each with a small tooltip-style label revealed on hover. Either link is omitted at the ends of the list. Because it re-fetches and re-sorts the entire collection on every render, this is comparatively expensive to call from a listing page; it is intended for single-post pages only.
