---
title: Input (shadcn/ui)
tags: []
created: 2026-08-10T00:00:00+07:00
updated: 2026-08-10T00:00:00+07:00
---

The generated shadcn/ui `Input` React component. The site has no React islands in production, so this file exists as the canonical class recipe for text inputs: the same literal class string is copied onto native, vanilla-JS-driven `<input>` elements (for example the tags-filter box) rather than hydrating them as a React component. See `DESIGN.md`'s "Form Fields (Inputs, Textareas)" section.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/forms/input.tsx` |
| Data | none |
| Tests | none |

## Props

`React.ComponentProps<"input">` (all standard `<input>` props, plus `className`).

## Usage

```astro
---
import { Input } from '@components/forms/input';
---

<Input client:load type="text" placeholder="Search..." />
```

## Behaviour

A thin `<input data-slot="input">` wrapper. Composes a fixed class string via the shared `cn()` helper ([`src/utils/shadcn-utils.ts`](../../../src/utils/shadcn-utils.ts)) covering border, background, focus-ring, placeholder, disabled, and `aria-invalid` states. As a React component it needs an Astro `client:*` directive to hydrate; in practice this project copies its class recipe onto native `<input>` elements instead.

## Extending

Add or update shadcn/ui components with `npx shadcn@latest add <name>`, then relocate the generated file into the folder matching its responsibility (per `src/components/README.md`) before review — see [`src/components/README.md`](../../../README.md) for the full shadcn/ui integration notes.
