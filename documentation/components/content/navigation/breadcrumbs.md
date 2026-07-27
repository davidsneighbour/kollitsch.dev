---
title: BreadCrumbs
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders a breadcrumb trail derived from a content file's path, plus its matching `BreadcrumbList` structured data.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/navigation/BreadCrumbs.astro` |
| Data | none; derives breadcrumbs via `getBreadcrumbs()` in [`src/utils/content.ts`](../../../../src/utils/content.ts) |
| Tests | [`src/components/content/navigation/BreadCrumbs.test.ts`](../../../../src/components/content/navigation/BreadCrumbs.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `path` | `string` | required | The content file's path, passed to `getBreadcrumbs()` to derive the trail |

## Usage

```astro
---
import BreadCrumbs from '@components/content/navigation/BreadCrumbs.astro';
---

<BreadCrumbs path={post.filePath ?? ''} />
```

## Behaviour

This component has no client-side behaviour. It renders a `<nav aria-label="Breadcrumb">` with one link per breadcrumb, rendering an `house-fill` icon in place of the label for the "Home" entry, `set:html` for other labels (since they may contain inline HTML), and a chevron separator between entries. The last entry gets `aria-current="page"`. It also renders [`BreadcrumbList`](../../seo/schema/breadcrumb-list.md) structured data for the same trail. Known caveats from the source: the home icon link isn't currently given an accessible label of its own, and an empty `path` (which would yield no breadcrumbs) isn't specially handled.
