---
title: Card (shadcn/ui)
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

The generated shadcn/ui `Card` React component family (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`), hand-patched to match `DESIGN.md`'s card conventions.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/shared/elements/card.tsx` |
| Data | none |
| Tests | none |

## Props

Each part accepts `React.ComponentProps<"div">` (i.e. any standard `<div>` prop, plus `className`).

## Usage

```astro
---
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@components/shared/elements/card';
---

<Card client:load>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Body content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

## Behaviour

Each part is a thin `<div data-slot="card-*">` wrapper with fixed layout classes, composed via the shared `cn()` helper so a caller's `className` merges in rather than overriding. `CardHeader` uses a `@container/card-header` grid that shifts to a two-column layout when a `CardAction` is present as a sibling.

The stock shadcn `Card` primitive ships `rounded-xl` and a light/dark-agnostic shadow; both are forbidden by `DESIGN.md`. This version is hand-patched to `rounded-lg` (the standard container radius, reserved for images inside cards is `rounded-xl`) and the "Elevation & Depth" shadow/outline split: `shadow-sm` in light mode, no shadow plus a subtle white outline in dark mode. As pure layout wrappers, none of these components require a `client:*` directive unless a caller adds interactive behaviour around them.

## Extending

See [`Button (shadcn/ui)`](./button-shadcn.md) and [`src/components/README.md`](../../../../README.md) for the general shadcn/ui update workflow (`npx shadcn@latest add <name>`, then relocate into the matching folder and review against `DESIGN.md`).
