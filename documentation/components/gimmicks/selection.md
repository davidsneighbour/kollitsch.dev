---
title: Selection
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Randomises the browser's text-selection (`::selection`) highlight colour to a Tailwind-token colour pair each time the user makes a selection.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/gimmicks/Selection.astro` |
| Data | none; reads Tailwind `--color-<family>-<shade>` CSS custom properties from computed styles |
| Tests | none |

## Props

This component accepts no props.

## Usage

```astro
---
import Selection from '@components/gimmicks/Selection.astro';
---

<Selection />
```

## Behaviour

Renders only an inline `<script>`, no markup. On every `selectionchange` event with a non-collapsed selection:

1. Detects the current theme from `<html data-theme="light|dark">` (defaults to dark).
2. Enumerates every distinct Tailwind colour family present as `--color-<family>-<shade>` custom properties on `:root` (cached after first computation).
3. For each family, resolves a background/text shade pair — `950`/`50` in light mode, `50`/`950` in dark mode — keeping only families where both shades actually resolve to a value.
4. Picks one combo at random and injects (or updates) a `<style data-selection-highlight>` tag in `<head>` setting `::selection`/`::-moz-selection` background and text colour, with a short colour transition.

A `DEBUG` constant (`false` by default) can be flipped to log theme detection, resolved families, and chosen combos to the console.
