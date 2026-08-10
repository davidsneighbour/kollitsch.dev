---
title: Textarea (shadcn/ui)
tags: []
created: 2026-08-10T00:00:00+07:00
updated: 2026-08-10T00:00:00+07:00
---

The generated shadcn/ui `Textarea` React component. The site has no React islands in production, so this file exists as the canonical class recipe for multi-line text fields: the same literal class string is copied onto native, vanilla-JS-driven `<textarea>` elements (for example the contact form) rather than hydrating them as a React component. See `DESIGN.md`'s "Form Fields (Inputs, Textareas)" section.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/forms/textarea.tsx` |
| Data | none |
| Tests | none |

## Props

`React.ComponentProps<"textarea">` (all standard `<textarea>` props, plus `className`).

## Usage

```astro
---
import { Textarea } from '@components/forms/textarea';
---

<Textarea client:load placeholder="Your message" />
```

## Behaviour

A thin `<textarea data-slot="textarea">` wrapper. Composes a fixed class string via the shared `cn()` helper ([`src/utils/shadcn-utils.ts`](../../../src/utils/shadcn-utils.ts)) covering border, background, focus-ring, placeholder, disabled, and `aria-invalid` states, plus `field-sizing-content` for content-driven auto-sizing. As a React component it needs an Astro `client:*` directive to hydrate; in practice this project copies its class recipe onto native `<textarea>` elements instead.

## Extending

Add or update shadcn/ui components with `npx shadcn@latest add <name>`, then relocate the generated file into the folder matching its responsibility (per `src/components/README.md`) before review — see [`src/components/README.md`](../../../README.md) for the full shadcn/ui integration notes.
