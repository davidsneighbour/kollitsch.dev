---
title: ThemeSelector
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders a light/dark theme toggle button as a custom element, backed by a shared theme manager that persists the choice to `localStorage` and reacts to the operating system's colour scheme.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/layout/header/theme/ThemeSelector.astro` |
| Data | none |
| Tests | [`src/components/layout/header/theme/ThemeSelector.test.ts`](../../../../../src/components/layout/header/theme/ThemeSelector.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultTheme` | `StoredThemeMode` (`"dark" \| "light" \| "auto"`) | `"dark"` | Theme applied when no theme is yet stored in `localStorage` |

## Usage

```astro
---
import ThemeSelector from '@components/layout/header/theme/ThemeSelector.astro';
---

<ThemeSelector defaultTheme="dark" />
```

## Behaviour

### Theme manager

An inline, `data-astro-rerun` script defines a singleton theme manager on `window.kdev.theme` (created once, reused across view-transition navigations). It:

- Reads/writes the theme (`"light" | "dark" | "auto"`) to `localStorage` under the key `kdev-theme`, falling back to an in-memory no-op store when `localStorage` is unavailable.
- Tracks the OS colour scheme via `matchMedia("(prefers-color-scheme: dark)")` and re-applies the resolved theme whenever it changes.
- On apply, sets `data-theme` and `data-code-theme` (`"dracula"` for dark, `"light-plus"` for light) on `<html>`, sets `style.colorScheme`, and dispatches a `theme-changed` `CustomEvent` with `{ defaultTheme, resolvedTheme, systemTheme, theme }`.
- Runs `theme.setTheme(theme.getTheme())` once on script load, and again on every `astro:after-swap`, so the theme survives view-transition navigations.

### `<theme-selector>` custom element

Registers a `theme-selector` custom element (idempotently, guarded by `customElements.get`) whose `connectedCallback` renders a `<button role="switch">` with an inline sun/moon SVG icon. Clicking the button cycles between `"light"` and `"dark"` (not `"auto"`) via `nextTheme()`, and calls `theme.setTheme()`. The element listens for `theme-changed` to keep its `aria-checked` and `aria-label` (`"Switch to light theme"` / `"Switch to dark theme"`) in sync, and removes the listener in `disconnectedCallback`.

### Icon animation

The sun/moon SVG morphs via CSS: `.theme-toggle-icon` rotates 180 degrees in dark mode, `.theme-toggle-rays` shrink and fade out, and `.theme-toggle-cutout` slides in to turn the circle into a crescent. All transitions collapse to `0.01ms` under `@media (prefers-reduced-motion: reduce)`. There is deliberately no hover/active scale ("pressed button") effect, since it visually conflicts with the icon's own morph animation.

## Extending

To add a third selectable state (for example exposing `"auto"` directly in the toggle), extend the `this.themes` array in the custom element and adjust `nextTheme()`'s cycling logic; the theme manager itself already supports `"auto"` end-to-end.
