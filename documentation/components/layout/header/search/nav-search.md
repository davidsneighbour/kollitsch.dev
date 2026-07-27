---
title: NavSearch
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

A generic, slot-driven three-region navigation bar (left, centre, right) with a built-in, accessible search-toggle panel that any consumer can replace or leave as a placeholder.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/layout/header/search/NavSearch.astro` |
| Data | none |
| Tests | [`src/components/layout/header/search/NavSearch.test.ts`](../../../../../src/components/layout/header/search/NavSearch.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `"Placeholder title"` | Fallback title text, used only when no `title` or `left` slot is provided |
| `navItems` | `{ href: string; label: string }[]` | three placeholder items | Fallback nav items, used only when no `nav` or `center` slot is provided |
| `navLabel` | `string` | `"Primary navigation"` | Accessible label for the `<nav>` element |
| `searchPlaceholder` | `string` | `"Search..."` | Placeholder text for the fallback search input |
| `openSearchLabel` | `string` | `"Open search"` | Accessible label and text for the toggle button when the search panel is closed |
| `closeSearchLabel` | `string` | `"Close search"` | Accessible label and text for the toggle button when the search panel is open |
| `searchRegionLabel` | `string` | `"Site search"` | Accessible label for the `role="search"` panel |
| `searchInitiallyOpen` | `boolean` | `false` | Whether the search panel starts open |
| `searchOuterWidthVarName` | `string` | `"--search-outer-width"` | Name of the CSS custom property set to the outer wrapper's measured width, exposed on the search panel |
| `class` | `string` | `""` | Extra classes on the outer full-width wrapper |
| `innerClass` | `string` | `""` | Extra classes on the inner width-constrained wrapper |
| `leftClass` | `string` | `""` | Extra classes on the left region |
| `centerClass` | `string` | `""` | Extra classes on the centre region |
| `rightClass` | `string` | `""` | Extra classes on the right region |

## Usage

```astro
---
import NavSearch from '@components/layout/header/search/NavSearch.astro';
---

<NavSearch navLabel="Main navigation" />
```

```astro
---
import NavSearch from '@components/layout/header/search/NavSearch.astro';
---

<NavSearch
  navLabel="Main navigation"
  openSearchLabel="Open site search"
  closeSearchLabel="Close site search"
  searchRegionLabel="Site search"
  centerClass="justify-end"
>
  <Fragment slot="left">
    <a href="/">MyBrand</a>
  </Fragment>
  <Fragment slot="center">
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="/blog/">Blog</a></li>
      </ul>
    </nav>
  </Fragment>
  <Fragment slot="search">
    <input type="search" placeholder="Search..." data-nav-search-input />
  </Fragment>
</NavSearch>
```

## Behaviour

### Slot model

There are two slot layers, and they must not be nested inside one another:

- **Region slots** — `left`, `center`, `right` — replace an entire region's content wholesale.
- **Semantic slots** — `title`, `nav`, `search`, `search-toggle`, `search-open-icon`, `search-close-icon` — fill in one piece of a region's default markup while keeping the rest (for example, `nav` alone replaces just the item list inside the default `<nav>` wrapper).

Default mapping when no slots are given: `left` shows the fallback `title`, `center` shows a `<nav>` built from `navItems`, `right` shows the built-in search toggle button.

### Search open/close

An inline script (scoped per instance via a random `data-component-id`) manages an `isOpen` boolean and:

- Toggles the search panel and swaps the open/close icon and label on the toggle button, updating `aria-expanded` and `aria-label`.
- Hides the `<nav>` behind `invisible`, `pointer-events-none`, `aria-hidden`, and `inert` while the panel is open, so it cannot receive focus or be announced.
- Moves focus into the first focusable field inside the `search` slot on open (via `requestAnimationFrame`, selecting existing text if the field supports `.select()`), and restores focus to whichever element had it before opening (or the toggle button, as a fallback) on close.
- Closes on `Escape` and on any click outside the search surface or toggle button.
- Continuously measures the outer wrapper's width (on `resize` and via a `ResizeObserver`) and writes it to the `searchOuterWidthVarName` CSS custom property on the search panel, so consumers can size the panel relative to the bar's own width.

### Accessibility

`aria-expanded` and `aria-controls` on the toggle button, `role="search"` on the panel, `aria-hidden`/`inert` on the nav while search is open, managed focus on open/close, and `Escape`/click-outside dismissal are all built in.

## Extending

To change what the search panel actually searches (for example wiring in [`PageFind`](page-find.md)), replace the `search` slot content; the open/close mechanics, focus management, and accessibility attributes are handled by `NavSearch` itself and do not need to be reimplemented. Do not add a second close control — the component assumes a single toggle button drives the open/closed state.
