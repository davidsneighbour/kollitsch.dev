---
title: Komut
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders the decorative Khmer or Thai komut symbol used as an inline flourish in content (for example, in the footer's version separator).

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/typography/Komut.astro` |
| Data | none |
| Tests | none |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | Additional classes merged onto the wrapper, alongside the fixed `is--komut` class |
| `visual` | `boolean` | `true` | When `true`, the symbol is decorative: `aria-hidden` is set and `select-none` is added |
| `type` | `"thai" \| "default"` | `"default"` | `"default"` renders the Khmer komut symbol (`៚`); `"thai"` renders the Thai komut symbol (`๛`) |
| `as` | `"span" \| "div"` | `"span"` | Container tag; any other value silently falls back to `"span"` |

## Usage

```astro
---
import Komut from '@components/content/typography/Komut.astro';
---

<Komut class="text-sm mr-2" />
```

```astro
---
import Komut from '@components/content/typography/Komut.astro';
---

<Komut type="thai" as="div" visual={false} />
```

## Behaviour

This component has no client-side behaviour. It renders a single decorative glyph inside a `<span>` or `<div>`. When `visual` is `true` (the default), `select-none` is added and `aria-hidden="true"` is set so screen readers skip the symbol; setting `visual={false}` exposes it to assistive technology instead.

## Extending

To add a third glyph variant, extend the `KomutType` union and the `if (type === ...)` chain that selects the `komut` character.
