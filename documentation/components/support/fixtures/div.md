---
title: Div
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

A bare `<div>` fixture with a `class` prop, used to build ad hoc layout wrappers in `src/pages/test/**` pages without writing raw HTML.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/support/fixtures/Div.astro` |
| Data | none |
| Tests | [`src/components/support/fixtures/Div.test.ts`](../../../../src/components/support/fixtures/Div.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | Classes applied to the `<div>` |

## Usage

```astro
---
import Div from '@components/support/fixtures/Div.astro';
---

<Div class="flex gap-4">
  <p>Fixture content</p>
</Div>
```

## Behaviour

This component has no client-side behaviour; it renders `<div class={className}><slot /></div>` and nothing else. Per `src/components/README.md`, `support/fixtures/` is a parking spot for test fixtures and miscellaneous building blocks that don't belong to any functional bucket — not intended for use in production pages.
