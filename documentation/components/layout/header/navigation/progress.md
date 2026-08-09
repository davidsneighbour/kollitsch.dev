---
title: Progress
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders a horizontal reading-progress bar that fills as the user scrolls down the page.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/layout/header/navigation/Progress.astro` |
| Data | none |
| Tests | [`src/components/layout/header/navigation/Progress.test.ts`](../../../../../src/components/layout/header/navigation/Progress.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `classes` | `string` | `"progress z-40 relative [--height:4px] lg:[--height:6px]"` | Classes applied to the outer `<div role="progressbar">`; callers can replace positioning classes when the bar is used as an overlay |

## Usage

```astro
---
import ProgressBar from '@components/layout/header/navigation/Progress.astro';
---

<ProgressBar />
```

```astro
---
import ProgressBar from '@components/layout/header/navigation/Progress.astro';
---

<ProgressBar classes="progress progress--viewport-top pointer-events-none absolute inset-x-0 bottom-0 hidden [--height:4px] lg:[--height:6px]" />
```

## Behaviour

An inline script computes scroll percentage as `scrollTop / (scrollHeight - clientHeight) * 100` and applies it to every `[data-reading-progress]` element on the page. The header instance is an absolutely positioned overlay inside the sticky navigation; its `pointer-events: none` class keeps hover, mouseover, and click hit-testing on the navigation underneath. For each progress element the script sets `aria-valuenow` to the rounded percentage, sets the `--scroll` CSS custom property (used by `.progress-fill`'s `scaleX`), and toggles a `data-complete` attribute once scroll reaches at least 99.9%, which switches the fill's border radius from "rounded end" to fully rounded.

The listener re-runs on `scroll` (passive), `load`, and `astro:page-load` (so it re-initialises correctly after view-transition navigations), and guards against double-registration via `window.kdev.readingProgressInitialised`.

The fill uses a diagonal striped background (`progress-bar-stripes` keyframes animating `background-position-x`) that is disabled under `@media (prefers-reduced-motion: reduce)`.

## Extending

To change the bar's thickness, override the `--height` (or `--thickness`) CSS custom property via the `classes` prop rather than editing the component's `<style>` block.
