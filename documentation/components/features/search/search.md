---
title: Search
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-11-14T00:00:00+07:00
---

Mounts a full [Pagefind](https://pagefind.app/) search UI (results grid, not the compact searchbox) into a page, themed to match the site.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/features/search/Search.astro` |
| Data | none; loads the generated Pagefind index from `pagefind/` under `BASE_URL` |
| Tests | [`src/components/features/search/Search.test.ts`](../../../../src/components/features/search/Search.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | `undefined` | `id` for the search root element |
| `className` | `string` | `undefined` | Extra classes for the search root element |
| `query` | `string` | `undefined` | When set, pre-fills the search input and triggers a search on mount |
| `uiOptions` | `Record<string, unknown>` | `{}` | Extra options forwarded to `new PagefindUI({ ...uiOptions })` |

## Usage

```astro
---
import Search from '@components/features/search/Search.astro';
---

<Search id="site-search" />
```

```astro
---
import Search from '@components/features/search/Search.astro';
---

<Search query={Astro.url.searchParams.get('q') ?? undefined} />
```

## Behaviour

Renders a root `<div data-pagefind-ui class="pagefind-init">` carrying its configuration in `data-*` attributes. An inline `<script>` imports `PagefindUI` from `@pagefind/default-ui` and, for every not-yet-initialised `.pagefind-init[data-pagefind-ui]` element found on `astro:page-load` (and once immediately, or on `DOMContentLoaded` if the document is still loading), instantiates a `PagefindUI` scoped to that specific element (built from its `id`/classes so multiple instances don't collide), removes the `pagefind-init` marker, and, if `query` was set, fills the search input and dispatches an `input` event to trigger the search.

The component also ships a large `<style is:global>` block layering Tailwind utility classes onto Pagefind's own `.pagefind-ui__*` class names (form, results grid, buttons, result cards), since Pagefind's UI is unstyled by default. The block starts with the statement `@layer properties, theme, base, components, utilities;`: this stylesheet loads before `theme.css` on `/find/`, and without the statement its `components` layer would rank below `base`, so base rules such as the forms plugin's white input background would win (GitHub issue #2032). In dark mode the field is `bg-white/5` with `text-white` and a `gray-400` placeholder; in light mode it is white with `gray-900` text and a `gray-600` placeholder. The "Load more results" button uses `primary-700` text in light mode for AA contrast. Note that this is the full search results UI; the compact navbar searchbox widget is [`PageFind`](../../layout/header/search/page-find.md).

`npx astro build` must have run at least once so the `pagefind/` bundle exists to load from.
