---
applyTo: "**/*.astro"
---

# Astro + Tailwind Styling Strategy

## Core Rule

Choose the styling approach based on **expected usage frequency of the component or element**.

### 1. Frequently Reused Components (High Repetition)

If a component or element is expected to appear **multiple times on a page or across the site** (e.g. buttons, cards, badges, navigation items):

- MUST extract Tailwind utility classes into a local `<style>` block using `@apply`
- MUST use a semantic or component-scoped class name in the markup
- SHOULD group base styles and variants into separate classes where applicable

Example:

```astro
<button class="btn btn-primary">
  <slot />
</button>

<style>
  .btn {
    @apply inline-flex items-center rounded-md px-3 py-2 text-sm font-medium;
  }

  .btn-primary {
    @apply bg-zinc-900 text-white hover:bg-zinc-800;
  }
</style>
```

Reason:

* Reduces repeated HTML payload
* Improves maintainability for shared UI primitives
* Keeps component API clean and consistent

### 2. Infrequent or Single-Use Elements (Low Repetition)

If a component or element is **used rarely or only once per page**:

* MUST keep Tailwind utility classes inline in the markup
* MUST NOT extract into `@apply` purely for shortening class strings

Example:

```astro
<div class="rounded-xl border px-4 py-3 text-sm shadow-sm">
```

Reason:

* Avoids unnecessary abstraction
* Keeps styling colocated and readable
* Prevents premature optimisation

## Additional Constraints

* MUST NOT use `@apply` solely to hide long class lists
* MUST prefer inline utilities when styling is highly dynamic (e.g. many variants, conditional classes)
* SHOULD extract styles only when repetition is clear and meaningful (rule of thumb: used 3+ times)

## Decision Summary

* High repetition → `@apply` in `<style>`
* Low repetition → inline Tailwind classes

This rule optimises for both **final page size** and **code clarity** without sacrificing Tailwind's utility-first approach.
