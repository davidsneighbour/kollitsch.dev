---
title: TestPagesIndex
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Auto-generates and renders a linked index of every `.astro` page under `src/pages/test/**`, used by `src/pages/test/test-pages-index.astro` as a developer landing page for manual test/fixture pages.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/support/fixtures/TestPagesIndex.astro` |
| Data | none; discovers pages via `import.meta.glob("/src/pages/test/**/*.astro")` |
| Tests | [`src/components/support/fixtures/TestPagesIndex.test.ts`](../../../../src/components/support/fixtures/TestPagesIndex.test.ts) |

## Props

This component accepts no props.

## Usage

```astro
---
import TestPagesIndex from '@components/support/fixtures/TestPagesIndex.astro';
---

<TestPagesIndex />
```

## Behaviour

This component has no client-side behaviour. At build/SSR time it globs every `.astro` file under `src/pages/test/**`, excluding files whose name starts with `_` (Astro's convention for non-routable partials), and for each one:

- Derives its route from the file path (`toRoute()`: strips `src/pages`, the `.astro` extension, and collapses a trailing `/index` to `/`).
- Derives a hierarchical label from the route's segments after `/test/` (`toHierarchicalLabel()`, for example `/test/bugs/typography/` becomes `"Bugs/Typography"`), title-cased and joined with `/`.
- Excludes the index page itself (`/test/`) from its own listing.

Entries are sorted case-insensitively by label and rendered as a responsive 2/3/4-column grid of links inside a [`Section`](section.md) fixture, under a level-2 [`Heading`](../../content/typography/heading.md).

## Extending

New pages added under `src/pages/test/**` appear in the index automatically; no manual registration is needed. To exclude a page from the index without excluding it from routing, prefix its filename with `_`.
