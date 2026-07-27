---
title: Button (shadcn/ui)
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

The generated shadcn/ui `Button` React component, used as an Astro island where a native shadcn button (with its variant system) is needed rather than the hand-written [`shared/elements/Button`](../shared/elements/button.md).

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/shadcn-ui/button.tsx` |
| Data | none |
| Tests | none |

## Props

`React.ComponentProps<"button">` plus:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"default" \| "destructive" \| "ghost" \| "link" \| "outline" \| "secondary"` | `"default"` | Visual style |
| `size` | `"default" \| "sm" \| "lg" \| "xs" \| "icon" \| "icon-sm" \| "icon-lg" \| "icon-xs"` | `"default"` | Size and padding |
| `asChild` | `boolean` | `false` | When `true`, renders via Radix `Slot` so the styling merges onto a single child element instead of wrapping it in a `<button>` |

## Usage

```astro
---
import { Button } from '@components/shadcn-ui/button';
---

<Button client:load variant="outline" size="sm">
  Click me
</Button>
```

## Behaviour

Built with `class-variance-authority` (`cva`) to compose `variant`/`size` into a single class string via the shared `cn()` helper ([`src/utils/shadcn-utils.ts`](../../../src/utils/shadcn-utils.ts)). Sets `data-slot="button"`, `data-variant`, and `data-size` attributes for CSS targeting. As a React component, it needs an Astro `client:*` directive to hydrate; without one it still renders its HTML at build time but has no interactivity beyond native `<button>`/`<a>` behaviour.

Per `src/components/README.md`, generated shadcn components are not used as-is: each is checked against `DESIGN.md` before being committed, and colours/radii here map onto the same tokens the rest of the site uses (no new colours or radii introduced).

## Extending

Add or update shadcn/ui components with `npx shadcn@latest add <name>`, then review the diff against `DESIGN.md` before use — see [`src/components/README.md`](../../../README.md) for the full shadcn/ui integration notes.
