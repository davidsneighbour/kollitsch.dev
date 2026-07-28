---
title: Blog
tags: []
created: 2026-07-28T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

Emits `schema.org` `Blog` JSON-LD structured data for blog listing pages.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/seo/schema/Blog.astro` |
| Data | [`src/data/setup.json`](../../../../src/data/setup.json) (`author`, `description`, `url`) and rendered blog posts |
| Tests | [`src/components/seo/schema/Blog.test.ts`](../../../../src/components/seo/schema/Blog.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `description` | `string` | `setup.description` | Listing page description |
| `posts` | `CollectionEntry<"blog">[]` | `[]` | Posts shown on the current listing page |
| `title` | `string` | `Blog` | Listing page title |

## Usage

```astro
---
import BlogSchema from '@components/seo/schema/Blog.astro';
---

<BlogSchema title="Blog" description="A collection of articles." posts={posts} />
```

## Behaviour

This component has no client-side behaviour. It renders an inline `<script type="application/ld+json">` containing a `Blog` object for the current listing URL. When posts are supplied, it includes lightweight nested `BlogPosting` entries for the posts shown on that page. The component is used by the main blog index, paginated blog pages, year archive pages, and paginated year archive pages.
