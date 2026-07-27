---
title: Meta
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders a batch of static `<meta>` and `<link>` tags driven entirely by a JSON configuration file.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/layout/head/Meta.astro` |
| Data | [`src/data/meta.json`](../../../../src/data/meta.json) |
| Tests | [`src/components/layout/head/Meta.test.ts`](../../../../src/components/layout/head/Meta.test.ts) |

## Props

This component accepts no props.

## Usage

```astro
---
import Meta from '@components/layout/head/Meta.astro';
---

<Meta />
```

## Behaviour

This component has no client-side behaviour. It reads `meta.json`, which has three top-level keys:

- `name`: a map of `<meta name="...">` tags, rendered as `name`/`content` pairs.
- `httpEquiv`: a map of `<meta http-equiv="...">` tags, rendered as `http-equiv`/`content` pairs.
- `link`: an array of objects spread directly onto `<link>` tags (each needs at least `rel` and `href`).

## Extending

To add, remove, or change a static meta tag or link, edit [`meta.json`](../../../../src/data/meta.json) directly; no component code changes are needed.
