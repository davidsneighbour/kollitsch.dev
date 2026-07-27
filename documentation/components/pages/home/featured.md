---
title: Featured
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders the homepage's featured post in full, via [`Post`](../../content/article/post.md).

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/pages/home/Featured.astro` |
| Data | none; resolves the featured post via `getHomepagePosts()` in [`src/utils/content.ts`](../../../../src/utils/content.ts) |
| Tests | [`src/components/pages/home/Featured.test.ts`](../../../../src/components/pages/home/Featured.test.ts) |

## Props

This component accepts no props.

## Usage

```astro
---
import Featured from '@components/pages/home/Featured.astro';
---

<Featured />
```

## Behaviour

This component has no client-side behaviour. It calls `getHomepagePosts()` and renders the `featuredPost` result through [`Post`](../../content/article/post.md); the sibling `recentPosts` result is discarded here (used instead by [`Recent`](recent.md)). The non-null assertion (`featuredPost!`) assumes at least one blog post exists.
