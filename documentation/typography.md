---
title: Typography
tags: []
created: 2026-05-31T15:14:25+07:00
updated: 2026-05-31T15:46:01+07:00
---

This project uses a semantic typography setup throughout layouts and components using Tailwind [utility classes][1] and the [typography plugin][2].

```table-of-contents
```

## Typographic Class System

The typography of the site consists of three parts:

* `typography-ui`
* `typography-reading`
* `reading-*`

### `typography-ui`

`typography-ui` is the outer typography layer for interface elements, application shell and general UI, including:

* header
* footer
* navigation
* buttons
* cards
* forms
* metadata
* layout chrome
* widgets and controls

This class is applied at the `body` level so the whole page starts in UI typography mode.

### `typography-reading`

`typography-reading` is the inner reading layer for prose content.

It is used for:

* article bodies
* page content
* Markdown-rendered content
* prose-heavy sections
* long-form text blocks

This class is intentionally separate from the outer UI layer and is based on the Tailwind Typography plugin.

### `reading-*`

`reading-*` utility classes are for fine-tuning selected content parts inside `typography-reading`.

Typical use cases include:

* calls to action
* sidenotes
* asides
* annotations
* visual emphasis
* reduced or enlarged supporting text

These utilities are not a replacement for `typography-reading`. They are small local adjustments inside the reading context. Or in layman's terms: they (currently only) fine tune the font sizes.

### Layering Model

The intended structure is:

* outer UI layer with `typography-ui`
* inner prose layer with `typography-reading`
* optional fine-tuning inside prose with `reading-*`

Example:

```html

<body class="typography-ui">
 <Header />
 <main>
  <article class="typography-reading">
   <p>Standard reading text.</p>
   <aside class="reading-sm">
     Supporting note inside prose in 0.875em size.
   </aside>
   <div class="not-prose typography-ui">
    <button>UI element inside reading content</button>
   </div>
  </article>
 </main>
 <Footer />
</body>
```

### Rationale

UI typography and reading typography solve different problems.

UI typography (`typography-ui`) supports:

* navigation
* controls
* metadata
* cards
* compact interface elements

Reading typography supports:

* comfortable prose reading
* heading rhythm
* paragraph spacing
* list spacing
* code formatting
* blockquotes
* semantic long-form content

Keeping them separate avoids accidental styling leakage and makes both systems easier to maintain.

`typography-reading` provides a controlled prose environment using the Typography plugin plus project-specific theme values through `prose-dnb`.

This centralises reading rules instead of scattering them across components.

Some content elements inside prose need local scaling without breaking the overall reading system.

Examples:

* a quieter sidenote
* a larger call to action
* a smaller supporting paragraph
* a visually distinct annotation

`reading-*` utilities provide this fine-tuning without replacing the main prose wrapper.

## Rules

### Rule 1: `typography-ui` is the Default Outer Layer

Use `typography-ui` for the outer application shell and for standalone UI elements.

In most cases, apply it to `body`.

### Rule 2: `typography-reading` is only for Prose Areas

Do not use `typography-reading` for general layout wrappers, cards, navigation, or UI-heavy containers.

Use it only where prose behaviour is actually wanted.

### Rule 3: `reading-*` is only for Local Adjustments inside Reading Content

`reading-*` should fine-tune text inside `typography-reading`.

Do not use `reading-*` as a substitute for the UI typography system.

### Rule 4: `reading-*` Must Always Be `em` Based

This is critical.

`reading-*` utilities must use relative `em` values so they scale with the current prose size from `typography-reading`.

Correct:

```css
.reading-sm {
 font-size: 0.875em;
}
```

Incorrect:

```css
.reading-sm {
 font-size: 0.875rem;
}
```

Incorrect:

```css
.reading-sm {
  @apply text-sm;
}
```

Using `rem` or Tailwind `text-*` utilities would detach the adjustment from the current prose scale and break the intended relationship.

### Rule 5: Do not Use Tailwind `text-*` inside `typography-reading`

Inside the reading context, font-size adjustments should be done with `reading-*` or other `em`-based helpers.

Do not use `text-sm`, `text-lg`, etc. inside `typography-reading`, because those operate on the global scale rather than the current prose base.

### Rule 6: Use `not-prose` Directly in Markup

When a UI element appears inside `typography-reading`, use Tailwind Typography's escape hatch directly in markup:

```html
<div class="not-prose typography-ui">
 <button>Button inside prose</button>
</div>
```

Do not use `@apply not-prose`.

`not-prose` must always be written directly in markup.

### Rule 7: Always Pair `not-prose` with `typography-ui`

`not-prose` exits the Typography plugin, but it does not automatically restore the UI typography system.

That means this is correct:

```html
<div class="not-prose typography-ui">
 …
</div>
```

and this is not sufficient:

```html
<div class="not-prose">
 …
</div>
```

### Rule 8: Do not Re-enter Prose inside `not-prose`

`not-prose` creates a hard boundary.

Do not try to nest `typography-reading` inside a `not-prose` block.

### Rule 9: Keep Sizes in `reading-*` at or above ~0.75em

Avoid font sizes below ~0.75em in reading context. Smaller sizes should only be used for very specific, intentional cases (for example, annotations or microcopy) and should not be introduced as general-purpose utilities.

### Warning: `reading-*` is Intentionally Small in Scope

If `reading-*` feels unused, that is not necessarily a problem.

These utilities exist for exceptions and fine-tuning, not for everyday typography decisions.

They should appear less often than `typography-ui` and `typography-reading`.

### Warning: Keep `typography-*` in `@layer components`

`typography-ui` and `typography-reading` are semantic wrapper classes, not atomic utilities.

They belong in `@layer components`.

### Warning: Keep `reading-*` in `@layer utilities`

`reading-*` classes are local, single-purpose adjustments.

They belong in `@layer utilities`.

### Warning: Typography Plugin Required

`typography-reading` depends on the Tailwind Typography plugin being installed and configured.

Without the plugin, the prose-related behaviour will not work as intended.

## Summary

The final system is:

* `typography-ui` for general interface typography
* `typography-reading` for prose content
* `reading-*` for small, relative adjustments inside prose
* `not-prose typography-ui` for UI islands inside prose

This is the final intended structure and should replace older notes that still refer to `type-*`.

---

[1]: <https://tailwindcss.com/docs/adding-custom-styles#adding-custom-utilities>
[2]: <https://github.com/tailwindlabs/tailwindcss-typography#basic-usage>
