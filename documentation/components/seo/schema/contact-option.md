---
title: ContactOption
tags: []
created: 2026-07-28T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

Emits the contact option JSON-LD node used by the contact page.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/seo/schema/ContactOption.astro` |
| Data | [`src/data/setup.json`](../../../../src/data/setup.json) (`url`) |
| Tests | [`src/components/seo/schema/ContactOption.test.ts`](../../../../src/components/seo/schema/ContactOption.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `contactType` | `string` | `general enquiries` | Human-readable purpose of the contact route |
| `formPath` | `string` | `/connect/` | Public page containing the form |
| `id` | `string` | `contact-form` | Fragment identifier for the contact point node |

## Usage

```astro
---
import ContactOptionSchema from '@components/seo/schema/ContactOption.astro';
---

<ContactOptionSchema />
```

## Behaviour

Schema.org defines `contactOption` as a property, not as a standalone type. This component therefore emits a `ContactPoint` JSON-LD node with a stable `@id`, `contactType`, and URL. The contact page schema references that node from `mainEntity`.
