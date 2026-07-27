---
title: PageFind
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Embeds the Pagefind search box widget and themes it to match the site's design tokens.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/layout/header/search/PageFind.astro` |
| Data | none |
| Tests | none |

## Props

This component accepts no props.

## Usage

```astro
---
import PageFind from '@components/layout/header/search/PageFind.astro';
---

<div id="pagefind-container">
  <PageFind />
</div>
```

## Behaviour

Renders a `<pagefind-searchbox>` custom element, a global `<style>` block that maps Pagefind's `--pf-*` CSS custom properties onto the site's design tokens (colours, shadows, typography, sizing, and dark-mode overrides scoped to `#pagefind-container`), and loads `/pagefind/pagefind-component-ui.js` as a module script plus its stylesheet `/pagefind/pagefind-component-ui.css`.

`npx astro build` must have run at least once before these Pagefind assets exist in `dist/`; the component does not generate them itself.

## Extending

To restyle the search results dropdown, adjust the `--pf-*` custom properties in the `<style>` block rather than overriding Pagefind's own CSS, since the widget reads its appearance entirely from those variables.
