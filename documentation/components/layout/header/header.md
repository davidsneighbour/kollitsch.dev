---
title: Header
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-09-16T00:00:00+07:00
---

Renders the sticky site header: the homepage [`SiteTitle`](title/site-title.md) hero, the reading-progress bar, the [`NavSearch`](search/nav-search.md) shell wrapping the main navigation, the mobile hamburger menu, and the [`PageFind`](search/page-find.md) search box.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/layout/header/Header.astro` |
| Data | [`src/data/setup.json`](../../../../src/data/setup.json) (site title), [`src/data/topnavigation.json`](../../../../src/data/topnavigation.json) (nav items) |
| Tests | [`src/components/layout/header/Header.test.ts`](../../../../src/components/layout/header/Header.test.ts) |
| Behaviour spec | [`Behaviour.spec.md`](../../../../src/components/layout/header/Behaviour.spec.md) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultTheme` | `StoredThemeMode` (`"dark" \| "light" \| "auto"`) | `"dark"` | Initial theme passed through to [`ThemeSelector`](theme/theme-selector.md) |
| `siteTitleId` | `string` | `"sitetitle-header"` | Stable `id` shared with [`SiteTitle`](title/site-title.md); used as the intersection-observer target that toggles the sticky brand state |
| `compact` | `boolean` | `false` | Passed to [`SiteTitle`](title/site-title.md) for the smaller reading-page masthead. `DefaultPage.astro` sets it from its `compactHeader` prop; single post pages opt in. |

## Usage

```astro
---
import Header from '@components/layout/header/Header.astro';
---

<Header />
```

```astro
---
import Header from '@components/layout/header/Header.astro';
---

<Header defaultTheme="light" siteTitleId="site-title" />
```

## Behaviour

- Renders `<SiteTitle siteTitleId={siteTitleId} />` above a sticky `<header id="site-header">`.
- Determines the active navigation item via `findActive`/`isActive` from [`src/utils/navigation.ts`](../../../../src/utils/navigation.ts). Paths under `/tags/` or `/tag/` are treated as a special case: only the `/tags/` nav item is marked active, regardless of the specific tag.
- Filters both top-level and child navigation items marked `devOnly` out of production builds, keeping them in `import.meta.env.DEV`.
- Logs a debug message (dev only) when no navigation item matches the current path.

### Sticky brand and reading progress

An inline script (`data-astro-rerun`, so it re-executes on every view-transition navigation) wires up:

- **Sticky brand fade-in** — an `IntersectionObserver` watches the `SiteTitle` element (via `siteTitleId`). When it scrolls out of view, `#navbar-brand` fades from `opacity-0` to `opacity-100`, slides in from `translateX(-6px)`, removes its hidden accessibility state, and returns to the normal tab order. While the link is visually hidden, it keeps `aria-hidden="true"` and `tabindex="-1"` so keyboard and screen-reader users do not encounter a duplicate invisible home link. The viewport reading-progress bar (`progress--viewport-top`) is shown inside the sticky header's bottom edge, and `data-scrolled` is toggled on `#site-header` for a deeper box-shadow.
- **Reading-progress overlay** — the progress bar is absolutely positioned at the bottom of `#site-header`, so it does not add to the navigation's height, padding, or spacing. It uses `pointer-events: none`, allowing click and hover hit-testing to pass through to the top navigation underneath.
- **Mobile menu** — clicking `#hamburger-and-close` toggles `window.kdev.mobileOpen`, swapping the open/close icons and the `hidden`/`flex` classes on `#navigation-and-theme-select`. The toggle button is cloned and replaced on each `astro:after-swap` to drop stale listeners before re-binding. The open panel uses the opaque `--popover` surface (no backdrop blur), so page content never shows through behind the menu items.
- **Theme toggle placement** — from `md` up, the theme toggle sits in the fixed top-right `.theme-corner`. Below `md`, the corner is hidden and a second `<theme-selector class="nav-theme-toggle">` (44 px button) sits in the sticky nav bar next to the hamburger and search buttons, so it never collides with the wordmark and stays reachable while scrolling. Both instances stay in sync through the `theme-changed` event. The desktop/mobile switch uses plain CSS media rules, because `ThemeSelector`'s unlayered `theme-selector { display }` rule would beat Tailwind's layered `md:hidden`.
- **Resize handling** — a `resize` listener keeps the mobile nav visible at `md:` widths and above regardless of the mobile-open state.

### Reduced motion

Under `@media (prefers-reduced-motion: reduce)`, the brand slide transform is removed (only an opacity transition remains) and the mobile-nav reveal animation is disabled.

## Extending

To add or remove a navigation entry, edit [`topnavigation.json`](../../../../src/data/topnavigation.json); each item is rendered by [`NavItem`](navigation/nav-item.md), which handles dropdown sub-items automatically when `children` is present.
