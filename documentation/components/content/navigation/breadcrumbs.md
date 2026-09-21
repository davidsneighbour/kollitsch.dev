---
title: BreadCrumbs
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-09-21T00:00:00+07:00
---

Renders a breadcrumb trail derived from a content file's path, plus its matching `BreadcrumbList` structured data. On blog post breadcrumbs, the year segment and the post (last) segment expand into a year/post switcher when siblings exist.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/navigation/BreadCrumbs.astro` |
| Switcher primitive | `src/components/content/navigation/BreadcrumbSwitcher.astro` |
| Data | derives breadcrumbs via `getBreadcrumbs()`, year/post switcher items via `getBlogYears()`/`getBlogPostsForYear()`, all in [`src/utils/content.ts`](../../../../src/utils/content.ts) |
| Tests | [`BreadCrumbs.test.ts`](../../../../src/components/content/navigation/BreadCrumbs.test.ts), [`BreadcrumbSwitcher.test.ts`](../../../../src/components/content/navigation/BreadcrumbSwitcher.test.ts), [`BreadcrumbSwitcher.spec.ts`](../../../../src/test/content/navigation/BreadcrumbSwitcher.spec.ts) (Playwright) |

## Props

`BreadCrumbs.astro`:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `path` | `string` | required | The content file's path, passed to `getBreadcrumbs()` to derive the trail |

`BreadcrumbSwitcher.astro`:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `href` | `string` | required | The unchanged target the plain breadcrumb link would have had |
| `label` | `string` | required | Current label, rendered with `set:html` |
| `items` | `BreadcrumbSwitcherItem[]` | required | Sibling items (`{ id, label, href }`), sorted newest first |
| `currentId` | `string` | required | Id of the current item within `items` |
| `ariaLabel` | `string` | required | Accessible label for the disclosure toggle button |
| `isCurrentPage` | `boolean` | `false` | Sets `aria-current="page"` on the link |

## Usage

```astro
---
import BreadCrumbs from '@components/content/navigation/BreadCrumbs.astro';
---

<BreadCrumbs path={post.filePath ?? ''} />
```

`BreadCrumbs.astro` derives everything the switcher needs from `path` alone — callers never pass year/post data directly. `BreadcrumbSwitcher.astro` itself is a generic, data-agnostic primitive (it does not know it is blog-specific); only `BreadCrumbs.astro` wires it to blog year/post data.

## Behaviour

`BreadCrumbs.astro` renders a `<nav aria-label="Breadcrumb">` with one link per breadcrumb, rendering a `lucide:house` icon in place of the label for the "Home" entry, `set:html` for other labels (since they may contain inline HTML), and a chevron separator between entries. The last entry gets `aria-current="page"`. It also renders [`BreadcrumbList`](../../seo/schema/breadcrumb-list.md) structured data for the same trail. Known caveats from the source: the home icon link isn't currently given an accessible label of its own, and an empty `path` (which would yield no breadcrumbs) isn't specially handled.

For the year segment and the last (post) segment, `BreadCrumbs.astro` renders `BreadcrumbSwitcher` instead of a plain link, passing the full list of blog years (`getBlogYears()`) or the current year's sibling posts (`getBlogPostsForYear()`). `BreadcrumbSwitcher` degrades to the same plain link with no switcher chrome when there is only one item (no siblings to switch between).

When siblings exist, `BreadcrumbSwitcher` renders the unchanged link plus a small disclosure `<button>` (`aria-expanded`/`aria-controls`) next to it — mirroring `NavItem.astro`'s link-plus-toggle composition, so the link's click-to-navigate behaviour is never overloaded with open/close semantics. Sibling items split around `currentId` into two lists, CSS-anchored directly above (`bottom-full`) and below (`top-full`) the trigger via a `position: relative` wrapper — the active item is the trigger itself, so it never moves and there is nothing to duplicate or measure. Opening: closes any other open switcher, adds a `.open` class, scrolls the "above" list to its end, and focuses the trigger link. Keyboard support inside an open switcher: `ArrowUp`/`ArrowDown` roam between the trigger and sibling links, `Home`/`End` jump to the first/last link, `Escape` closes and returns focus to the toggle button. Outside-click dismissal is a single delegated `document` listener guarded by a flag on `<body>` (auto-resets on Astro view-transition swap, same convention as `NavItem.astro`). Motion respects `prefers-reduced-motion: reduce` via a scoped `<style>` block that collapses the transition to `0.01ms` and drops the translate (the same convention as `Header.astro`'s reduced-motion overrides, not the `motion-reduce:` Tailwind variant).
