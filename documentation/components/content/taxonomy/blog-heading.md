---
title: BlogHeading
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders the heading section at the top of a blog listing page, with an optional note about the date range of the posts shown.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/taxonomy/BlogHeading.astro` |
| Data | none |
| Tests | [`src/components/content/taxonomy/BlogHeading.test.ts`](../../../../src/components/content/taxonomy/BlogHeading.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | required | Heading text |
| `posts` | `CollectionEntry<"blog">[]` | required | Posts shown on the page; used to derive the date-range note |
| `level` | `number` | `1` (from [`Heading`](../typography/heading.md)) | Forwarded to `Heading` |
| `description` | `string` | `"A collection of articles, tutorials, and updates."` | Forwarded to `Heading` as its `title` attribute |
| `link` | `string` | `undefined` | Forwarded to `Heading`; wraps the title in a link when set |
| `class` | `string` | `undefined` | Forwarded to `Heading` |

## Usage

```astro
---
import BlogHeading from '@components/content/taxonomy/BlogHeading.astro';
---

<BlogHeading title="Blog" posts={posts} level={1} description="A collection of articles, tutorials, and updates." />
```

## Behaviour

This component has no client-side behaviour. It renders a `<section>` wrapping a [`Heading`](../typography/heading.md) with the given `title`, and, when `posts` is an array, calls `getPageDateNote(posts)` (from [`src/utils/content.ts`](../../../../src/utils/content.ts)) to derive a note such as a covered date range; the note is only rendered when non-null.
