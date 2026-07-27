---
title: Share
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders a compact inline row of LinkedIn, Facebook, and Reddit share links for the current page, used inside [`PostMeta`](post-meta.md).

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/metadata/Share.astro` |
| Data | none |
| Tests | [`src/components/content/metadata/Share.test.ts`](../../../../src/components/content/metadata/Share.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `post` | `CollectionEntry<"blog">` | required | Supplies the post title used in the Reddit share URL |

## Usage

```astro
---
import Share from '@components/content/metadata/Share.astro';
---

<Share post={post} />
```

## Behaviour

This component has no client-side behaviour. It builds `Astro.url.toString()` as the canonical URL to share and renders three `target="_blank" rel="noopener"` links: LinkedIn's share-offsite endpoint, Facebook's sharer endpoint, and Reddit's submit endpoint (which also includes the post title). All three URLs are built with the current page's URL, not necessarily the post's own canonical URL; see [`ShareSeparator`](share-separator.md) for the larger, brand-styled share widget that takes an explicit `title`/`description` instead.

## Extending

The component source notes a pending rework to accept `url`, `title`, and `description` props directly instead of the whole `post` object, matching the pattern [`ShareSeparator`](share-separator.md) already uses.
