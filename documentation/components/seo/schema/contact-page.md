---
title: ContactPage
tags: []
created: 2026-07-28T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

Emits `schema.org` `ContactPage` JSON-LD structured data for the contact page.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/seo/schema/ContactPage.astro` |
| Data | [`src/data/setup.json`](../../../../src/data/setup.json) (`url`) and contact-page frontmatter |
| Tests | [`src/components/seo/schema/ContactPage.test.ts`](../../../../src/components/seo/schema/ContactPage.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `description` | `string` | `Find a way to get into contact with me.` | Contact page summary |
| `formPath` | `string` | `/connect/` | Canonical contact page route |
| `title` | `string` | `Contact` | Contact page title |

## Usage

```astro
---
import ContactPageSchema from '@components/seo/schema/ContactPage.astro';
---

<ContactPageSchema title={frontmatter.title} description={frontmatter.description} />
```

## Behaviour

This component has no client-side behaviour. It renders an inline `<script type="application/ld+json">` containing a `ContactPage` object for `/connect/`, including a `mainEntity` reference to the contact point emitted by `ContactOption`.
