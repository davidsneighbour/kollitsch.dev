---
title: Recent
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders the homepage's "Recent Posts" grid of [`Preview`](../../content/article/preview.md) cards, with a link to the full blog archive.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/pages/home/Recent.astro` |
| Data | none; resolves recent posts via `getHomepagePosts()` in [`src/utils/content.ts`](../../../../src/utils/content.ts) |
| Tests | [`src/components/pages/home/Recent.test.ts`](../../../../src/components/pages/home/Recent.test.ts) |

## Props

This component accepts no props.

## Usage

```astro
---
import Recent from '@components/pages/home/Recent.astro';
---

<Recent />
```

## Behaviour

This component has no client-side behaviour. It calls `getHomepagePosts()` and renders the `recentPosts` result (the sibling `featuredPost` result is discarded here; used instead by [`Featured`](featured.md)) as a responsive grid of [`Preview`](../../content/article/preview.md) cards (1/2/3 columns depending on viewport width), followed by a "Read more..." link to `/blog/`.
