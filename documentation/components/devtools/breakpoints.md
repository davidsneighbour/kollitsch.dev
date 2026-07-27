---
title: Breakpoints
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Development-only floating dev bar: shows the currently active Tailwind breakpoint and a one-click heading-hierarchy audit tool.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/devtools/Breakpoints.astro` |
| Data | none |
| Tests | [`src/components/devtools/Breakpoints.test.ts`](../../../src/components/devtools/Breakpoints.test.ts) |

## Props

This component accepts no props.

## Usage

```astro
---
import Breakpoints from '@components/devtools/Breakpoints.astro';
---

<Breakpoints />
```

## Behaviour

Renders nothing when `import.meta.env.DEV` is `false`, so it never ships in production builds. When active, it renders a fixed bar (default: bottom of the viewport) showing which Tailwind breakpoint (`XS` through `2XL`) is currently active via responsive `hidden`/`inline` utility classes, plus:

- **Audit Headings** — walks the DOM with a `TreeWalker`, collecting every semantic (`h1`-`h6`) or ARIA (`role="heading"` + `aria-level`) heading, its text, and whether it's currently visible (not `display: none`, not `visibility: hidden`, not `aria-hidden`, not `.sr-only`). Results are listed in the bar; clicking one scrolls it into view.
- **Toggle opacity** — dims the bar to 20% opacity (full opacity restored on hover), persisted to `localStorage` (`devBarOpacity`).
- **Toggle position** — moves the bar between top and bottom of the viewport, persisted to `localStorage` (`devBarPosition`).
- **Hide until reload** — hides the bar for the current page load only (not persisted).
- **Dismiss permanently** — hides the bar and persists that choice to `localStorage` (`devBarHidden`; migrates from a legacy `hideDevBar` key if present).

A `tinykeys` keyboard shortcut (`Shift+A` by default, configurable via the `DEVBAR_SHOW_KEY` constant in the component) restores a hidden bar. The `tinykeys` subscription is torn down on `astro:before-swap` and re-registered on `astro:page-load`, so it survives view-transition navigations without leaking listeners.

## Extending

To change the restore shortcut, edit the `DEVBAR_SHOW_KEY` constant (uses [tinykeys](https://github.com/jamiebuilds/tinykeys) syntax, for example `"Shift+A"`).
