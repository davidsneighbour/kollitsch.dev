---
applyTo: "src/components/**/*.astro,src/layouts/**/*.astro"
---

# Minimising DOM depth

GTmetrix and Lighthouse both penalise excessive DOM nesting. Astro gives two
tools to avoid adding wrapper elements that exist only to satisfy
JSX-style "single root" habits carried over from React: the component
template itself needs no wrapper, and `Fragment`/`<>...</>` groups sibling
markup without emitting a tag.

## Astro templates do not need a single root element

Unlike JSX, an `.astro` template may already have multiple sibling
top-level elements with no wrapper at all. Before adding a `<div>` around a
component's template "to be safe", check whether the wrapper is doing any
of these:

* holding a Tailwind layout class (`flex`, `grid`, spacing, `ring`,
  `shadow`, etc.) that the children rely on,
* carrying an `id`, ARIA attribute, or other selector that CSS or a script
  targets,
* forming a semantically required parent (`<li>` inside `<ul>`/`<ol>`,
  `<figcaption>` inside `<figure>`, table row/cell structure).

If none of these apply, the wrapper is pure noise — remove it, or replace
it with `Fragment`/`<>...</>` if you need to group several elements as one
expression (for example inside a `.map()` callback, or a `{condition &&
(...)}` block).

## Use Fragment instead of a placeholder tag

The most common purposeless wrapper is a `<div>` or `<span>` added only
because a conditional or loop expression needed a single element to
return. Don't add a tag to satisfy the syntax: use `Fragment` (or the
`<>...</>` shorthand) instead, and if the conditional already gates a
single child, skip the wrapper altogether:

```astro
{/* Unnecessary: adds a span with no class, ARIA role, or styling purpose */}
{hasSlot && (
  <span>
    <slot />
  </span>
)}

{/* Better: no extra tag needed at all */}
{hasSlot && <slot />}
```

```astro
{/* Grouping several sibling elements per loop iteration without a wrapper tag */}
{items.map((item) => (
  <>
    <dt>{item.term}</dt>
    <dd>{item.definition}</dd>
  </>
))}
```

Reference implementations already in this codebase:
`src/components/devtools/ColorScheme.astro`,
`src/components/content/navigation/BreadCrumbs.astro`, and
`src/components/layout/head/OpenGraphImage.astro`.

## What is NOT a candidate

Do not remove or Fragment a wrapper that:

* carries any class (Tailwind layout/utility classes are real styling,
  not decoration to discard),
* is the only thing providing a CSS containment context (`flex`, `grid`,
  `contents`, positioning parents for `absolute` children),
* is targeted by a test, a script (`querySelector`, `data-*` attribute), or
  another component's CSS.

When in doubt, grep the codebase (`.astro`, `.css`, `.ts`) for the
wrapper's class name or `id` before removing it — a class that looks
unused in one file may be targeted from `theme.css` or a sibling
component.
