---
title: Post
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders a full blog post: cover image, title, breadcrumbs, rendered content, share widget, single-post pagination, comments, meta information, and structured data.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/article/Post.astro` |
| Data | none (receives the post via the `post` prop) |
| Tests | [`src/components/content/article/Post.test.ts`](../../../../src/components/content/article/Post.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `post` | `CollectionEntry<"blog">` | required | The post to render in full |

## Usage

```astro
---
import Post from '@components/content/article/Post.astro';
---

<Post post={post} />
```

## Behaviour

This component has no behaviour of its own; it is a composition root that renders, in order: [`PostImage`](../media/post-image.md) as the cover, a level-1 [`Heading`](../typography/heading.md) (title rendered via `set:html`, since `post.data.title` may contain inline HTML) with an optional subtitle, [`BreadCrumbs`](../navigation/breadcrumbs.md), [`Prose`](../typography/prose.md) for the rendered body, a [`Komut`](../typography/komut.md) flourish, [`ShareSeparator`](../metadata/share-separator.md), [`PaginationSingle`](../pagenav/pagination-single.md), `Giscus` comments, [`PostMeta`](../metadata/post-meta.md), and the `BlogPosting` schema.

`src/components/README.md` flags this component as mixing content rendering, pagination, comments, and schema output, and notes it needs a decomposition plan in a future refactor.
