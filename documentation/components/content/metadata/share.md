---
title: Share
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-11-13T00:00:00+07:00
---

Renders a compact inline row of share links for the current page, used inside [`PostMeta`](post-meta.md). The networks are those with `show.shareMeta` in the [social media setup](../../../content/social-setup.md) (currently Facebook, LinkedIn, and Reddit).

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/metadata/Share.astro` |
| Data | [`src/data/setup.json`](../../../../src/data/setup.json) (`social` section, networks with `show.shareMeta`) |
| Tests | [`src/components/content/metadata/Share.test.ts`](../../../../src/components/content/metadata/Share.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `post` | `CollectionEntry<"blog">` | required | Supplies the post title and description for the share URL templates |

## Usage

```astro
---
import Share from '@components/content/metadata/Share.astro';
---

<Share post={post} />
```

## Behaviour

This component has no client-side behaviour. It uses `Astro.url.toString()` as the URL to share and renders one `target="_blank" rel="noopener"` link per network, built with `buildShareUrl()` from the network's `share.url` template. The URLs are built with the current page's URL, not necessarily the post's own canonical URL; see [`ShareSeparator`](share-separator.md) for the larger, brand-styled share widget that takes an explicit `title`/`description` instead.

## Extending

The component source notes a pending rework to accept `url`, `title`, and `description` props directly instead of the whole `post` object, matching the pattern [`ShareSeparator`](share-separator.md) already uses.
