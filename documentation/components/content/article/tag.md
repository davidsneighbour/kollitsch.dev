---
title: Tag (article card)
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders a preview card for a `tags` collection entry: cover image, title, description, and a "Read more..." button. Not to be confused with [`content/taxonomy/Tag`](../taxonomy/tag.md), the small pill-styled tag link.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/article/Tag.astro` |
| Data | none (receives the entry via the `post` prop) |
| Tests | [`src/components/content/article/Tag.test.ts`](../../../../src/components/content/article/Tag.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `post` | `CollectionEntry<"tags">` | required | The `tags` collection entry to summarise |

## Usage

```astro
---
import Tag from '@components/content/article/Tag.astro';
---

<Tag post={tagEntry} />
```

## Behaviour

This component has no client-side behaviour. It renders an `<article transition:animate="slide">` card with a [`PostImage`](../media/post-image.md) cover (`quality="medium"`), a title and description, and a "Read more..." `Button` linking to `/${post.collection}/${post.id}/`. The title link stretches to cover the whole card via an absolutely positioned `<span class="absolute inset-0">` inside it. Unlike [`Preview`](preview.md), it does not currently render structured data; the source notes a schema for the tag overview page is still to be added.
