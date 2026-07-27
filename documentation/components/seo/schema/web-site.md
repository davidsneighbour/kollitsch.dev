---
title: WebSite
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Emits `schema.org` `WebSite` JSON-LD structured data for the site as a whole.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/seo/schema/WebSite.astro` |
| Data | none (site name/URL are hard-coded in the component) |
| Tests | [`src/components/seo/schema/WebSite.test.ts`](../../../../src/components/seo/schema/WebSite.test.ts) |

## Props

This component accepts no props.

## Usage

```astro
---
import WebSite from '@components/seo/schema/WebSite.astro';
---

<WebSite />
```

## Behaviour

This component has no client-side behaviour. It renders an inline `<script type="application/ld+json">` containing a fixed `WebSite` object (`name: "KOLLITSCH.dev*"`, `url: "https://kollitsch.dev/"`). See [`schema.org/WebSite`](https://schema.org/WebSite).

## Extending

Unlike [`BlogPosting`](blog-posting.md) and [`BreadcrumbList`](breadcrumb-list.md), the site name and URL here are hard-coded rather than read from `setup.json`; if the site is ever renamed or migrated, update this component directly.
