---
title: Section
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

A bare `<section class="mb-8">` fixture, used to give `src/pages/test/**` pages consistent vertical spacing between sections.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/support/fixtures/Section.astro` |
| Data | none |
| Tests | [`src/components/support/fixtures/Section.test.ts`](../../../../src/components/support/fixtures/Section.test.ts) |

## Props

This component accepts no props.

## Usage

```astro
---
import Section from '@components/support/fixtures/Section.astro';
---

<Section>
  <p>Fixture content</p>
</Section>
```

## Behaviour

This component has no client-side behaviour; it renders `<section class="mb-8"><slot /></section>` and nothing else. See [`Div`](div.md) for the same pattern without the fixed spacing/section semantics. Per `src/components/README.md`, `support/fixtures/` is a parking spot for test fixtures — not intended for use in production pages.
