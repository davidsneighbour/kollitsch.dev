---
title: Preview
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-08-11T00:00:00+07:00
---

Renders a blog post preview card: cover image, title, summary, and a "Read more…" button, used in blog listing grids.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/article/Preview.astro` |
| Data | none (receives the post via the `post` prop) |
| Tests | [`src/components/content/article/Preview.test.ts`](../../../../src/components/content/article/Preview.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `post` | `CollectionEntry<"blog">` | required | The post to summarise |

## Usage

```astro
---
import Preview from '@components/content/article/Preview.astro';
---

<Preview post={post} />
```

## Behaviour

This component has no client-side behaviour. It renders an `<article>` card containing a [`PostImage`](../media/post-image.md) cover (`quality="medium"`), a title (`post.data.title` via `set:html`, since it may contain inline HTML) linking to the post with `data-astro-prefetch="viewport"`, a summary (`post.data.summary` via `set:html`), and a `Button` linking to the post. The cover media spans the full card width and touches the card edge; the text and button regions provide their own internal padding. The card uses container queries (`@container`, `@sm:`/`@md:`/etc.) to scale its typography with the grid column width rather than the viewport. The article receives `transition:name={getPostPreviewTransitionName(post.id)}` so the preview-card shell participates in the shared-element transition into the full [`Post`](post.md) page. Its `PostImage` receives `transitionName={getPostPreviewMediaTransitionName(post.id)}` so cover media transitions separately with image-preserving `object-fit: cover` styling. It also renders the `BlogPosting` schema for the post.
