---
title: BlogPosting
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Emits `schema.org` `BlogPosting` JSON-LD structured data for a blog post.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/seo/schema/BlogPosting.astro` |
| Data | [`src/data/setup.json`](../../../../src/data/setup.json) (`author.name`, `author.url`) |
| Tests | [`src/components/seo/schema/BlogPosting.test.ts`](../../../../src/components/seo/schema/BlogPosting.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `post` | `CollectionEntry<"blog">` | required | The post to describe |

## Usage

```astro
---
import BlogPosting from '@components/seo/schema/BlogPosting.astro';
---

<BlogPosting post={post} />
```

## Behaviour

This component has no client-side behaviour. It renders an inline `<script type="application/ld+json">` containing a `BlogPosting` object: `author` (from `setup.author`), `description`, `headline`, `keywords` (`post.data.tags`), and, when present, `datePublished`/`dateModified` formatted via `formatISO8601Local()`. See [`schema.org/BlogPosting`](https://schema.org/BlogPosting).
