---
title: BreadcrumbList
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Emits `schema.org` `BreadcrumbList` JSON-LD structured data for a breadcrumb trail, used by [`BreadCrumbs`](../../content/navigation/breadcrumbs.md).

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/seo/schema/BreadcrumbList.astro` |
| Data | none |
| Tests | [`src/components/seo/schema/BreadcrumbList.test.ts`](../../../../src/components/seo/schema/BreadcrumbList.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `BreadcrumbItem[]` | required | The same breadcrumb items rendered visually by [`BreadCrumbs`](../../content/navigation/breadcrumbs.md) |

## Usage

```astro
---
import BreadcrumbList from '@components/seo/schema/BreadcrumbList.astro';
---

<BreadcrumbList items={breadcrumbs} />
```

## Behaviour

This component has no client-side behaviour. It renders an inline `<script type="application/ld+json">` containing a `BreadcrumbList` object, built by spreading the result of `toBreadcrumbSchema(items)` (from [`src/utils/content.ts`](../../../../src/utils/content.ts)) onto the `@context`/`@type` envelope. See [`schema.org/BreadcrumbList`](https://schema.org/BreadcrumbList).
