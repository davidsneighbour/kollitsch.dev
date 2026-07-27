---
title: PostMeta
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Assembles the "Meta Information" block shown under a blog post: publish date, GitHub source links, tags, and an inline share row.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/metadata/PostMeta.astro` |
| Data | none (receives the post via the `post` prop) |
| Tests | [`src/components/content/metadata/PostMeta.test.ts`](../../../../src/components/content/metadata/PostMeta.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `post` | `CollectionEntry<"blog">` | required | The post whose metadata should be rendered |

## Usage

```astro
---
import PostMeta from '@components/content/metadata/PostMeta.astro';
---

<PostMeta post={post} />
```

## Behaviour

This component has no client-side behaviour of its own. It renders a `Heading level={2}` reading "Meta Information", then delegates to [`PublishData`](publish-data.md), [`Github`](github.md), [`Tags`](tags.md), and [`Share`](share.md) in a `<div class="flex flex-col">`, passing `post` through to each. It is one of the components flagged in `src/components/README.md` as accepting the entire `post` object and delegating to several TODO-heavy subcomponents; a future refactor may narrow the props each subcomponent actually needs.
