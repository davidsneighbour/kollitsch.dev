---
title: Button
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

The site's hand-written button/link component: renders as `<a>` when `href` is set, otherwise as `<button type="button">`, with a shared theme/size/outline variant system. Not related to the shadcn/ui [`Button`](../../shadcn-ui/button.md).

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/shared/elements/Button.astro` |
| Data | none |
| Tests | [`src/components/shared/elements/Button.test.ts`](../../../../src/components/shared/elements/Button.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `href` | `string` | `undefined` | When set, renders as `<a href={href}>`; otherwise renders as `<button>` |
| `name` | `string` | `undefined` | Icon name; when set, renders an icon after the slot content |
| `classes` | `string` | `""` | Extra classes appended after the computed variant classes |
| `theme` | `"primary" \| "secondary" \| "contrast"` | `"primary"` | Colour theme |
| `size` | `"xs" \| "sm" \| "base" \| "lg" \| "xl"` | `"base"` | Padding/font-size variant |
| `disabled` | `boolean` | `false` | Only affects the cursor style (`cursor-not-allowed`); does not set the `disabled` HTML attribute |
| `outline` | `boolean` | `true` | `true` renders an outlined/ghost style; `false` renders a filled style |
| `block` | `boolean` | `false` | Stretches the element to fill its container (`justify-self-stretch`) |

## Usage

```astro
---
import Button from '@components/shared/elements/Button.astro';
---

<Button href="/blog/" name="arrow-right">Read more...</Button>
```

```astro
---
import Button from '@components/shared/elements/Button.astro';
---

<Button theme="secondary" size="lg" outline={false} block>
  Submit
</Button>
```

## Behaviour

This component has no client-side behaviour. `getBaseClasses()`, `getSizeClasses()`, `getBlockClasses()`, and `getDisabledClasses()` each look up a fixed class string from a `theme`/`size` keyed map (falling back to `primary`/`base` for unrecognised values) and concatenate them into one class string. Includes a small press-down micro-interaction (`active:scale-x-97 active:scale-y-98`), disabled under `motion-reduce`. Note the `disabled` prop only changes the cursor; it does not add the native `disabled` attribute, so callers needing an actually-disabled `<button>` must add that separately via `classes`/attributes.
