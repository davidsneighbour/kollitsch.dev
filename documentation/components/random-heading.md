---
title: RandomHeading
component: src/components/gimmicks/RandomHeading.astro
tests: src/test/browser/components-props.test.ts
tags: []
created: 2026-06-14T00:00:00+07:00
updated: 2026-06-14T00:00:00+07:00
---

Renders an `<h2>` that replaces its visible text with a random alternative from a data file after the page loads, giving headings a touch of variety on each visit.

## File locations

| Field | Value |
| --- | --- |
| Component | [`src/components/gimmicks/RandomHeading.astro`](../../src/components/gimmicks/RandomHeading.astro) |
| Data | [`src/data/random-headings.json`](../../src/data/random-headings.json) |
| Tests | [`src/test/browser/components-props.test.ts`](../../src/test/browser/components-props.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | required | The canonical heading text rendered server-side and used as one candidate in the random pool |
| `slug` | `keyof typeof headings` | required | Key into `random-headings.json`; selects which list of alternatives to use |
| `class` | `string` | `undefined` | Additional CSS classes forwarded to the `<h2>` element |

`slug` must match an existing top-level key in `src/data/random-headings.json`. TypeScript enforces this at build time via `keyof typeof headings`.

## Usage

```astro
---
import RandomHeading from '@components/gimmicks/RandomHeading.astro';
---

<RandomHeading slug="interrupt" text="Allow me to interrupt!" />
```

With an optional CSS class:

```astro
<RandomHeading slug="interrupt" text="Allow me to interrupt!" class="text-2xl font-bold" />
```

## Behaviour

On `DOMContentLoaded` the inline script builds a pool containing `text` and all strings listed under the matching `slug` key in `random-headings.json`. It picks one entry at random and writes it into the `<h2>` via `textContent`. The data attribute `data-random-heading="{slug}"` is used as the selector so multiple independent instances on the same page do not collide.

Because the replacement happens in a `DOMContentLoaded` handler, the server-rendered `text` value is always the initial visible content, which keeps the page usable if JavaScript is unavailable or slow.

## Extending

To add a new heading group, add a key to `src/data/random-headings.json`:

```json
{
  "interrupt": [
    "A quick intermezzo",
    "For your watching pleasure",
    "For your consideration"
  ],
  "my-new-group": [
    "Alternative one",
    "Alternative two"
  ]
}
```

Then use the new key as the `slug` prop. TypeScript will pick up the new key automatically through the `with { type: "json" }` import and the `keyof typeof headings` type.
