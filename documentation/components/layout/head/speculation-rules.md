---
title: SpeculationRules
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Emits a Chrome/Edge Speculation Rules script that eagerly prerenders the site's highest-traffic pages.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/layout/head/SpeculationRules.astro` |
| Data | none |
| Tests | [`src/components/layout/head/SpeculationRules.test.ts`](../../../../src/components/layout/head/SpeculationRules.test.ts) |

## Props

This component accepts no props.

## Usage

```astro
---
import SpeculationRules from '@components/layout/head/SpeculationRules.astro';
---

<SpeculationRules />
```

## Behaviour

Renders a `<script type="speculationrules">` tag listing `/about/`, `/blog/`, and `/tags/` with `"eagerness": "immediate"`, so Chromium-based browsers begin prerendering these URLs as soon as the rules are parsed, with no hover or viewport trigger required. Browsers without Speculation Rules support silently ignore the tag. All other links on the site are covered by Astro's `clientPrerender` and `data-astro-prefetch`, not this component.

## Extending

To prerender additional high-traffic routes, add them to the `urls` array in the component. Keep the list short; eager prerendering has a real bandwidth and compute cost per listed URL.
