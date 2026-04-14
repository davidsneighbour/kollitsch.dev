Yes. The final state is now clearly `typography-*`, and the older `type-*` names should be treated as obsolete leftovers from the earlier draft. The uploaded note still reflects that older intermediate stage, so I would explicitly supersede it with the version below.

## Final documentation for `documentation/typography.md`

````md
# Typography structure

This project uses a semantic typography split for Astro and Tailwind instead of repeating `text-*` and `prose-*` chains throughout layouts and components.

## Final class system

The final typography system consists of three parts:

* `typography-ui`
* `typography-reading`
* `reading-*`

## Purpose of each layer

### `typography-ui`

`typography-ui` is the outer typography layer for interface elements.

It is the default typography wrapper for the application shell and general UI, including:

* header
* footer
* navigation
* buttons
* cards
* forms
* metadata
* layout chrome
* widgets and controls

This class should usually be applied at the `body` level so the whole page starts in UI typography mode.

### `typography-reading`

`typography-reading` is the inner reading layer for prose content.

It is used for:

* article bodies
* page content
* markdown-rendered content
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

These utilities are not a replacement for `typography-reading`. They are small local adjustments inside the reading context.

## Layering model

The intended structure is:

* outer UI layer with `typography-ui`
* inner prose layer with `typography-reading`
* optional fine-tuning inside prose with `reading-*`

Example:

```astro
<body class="typography-ui">
  <Header />

  <main>
    <article class="typography-reading">
      <p>Standard reading text.</p>

      <aside class="reading-sm">
        Supporting note inside prose.
      </aside>

      <div class="not-prose typography-ui">
        <button>UI element inside reading content</button>
      </div>
    </article>
  </main>

  <Footer />
</body>
````

## Current stylesheet structure

```css
/* MARK: Typography */
/* @see documentation/typography.md for the rationale these classes */
/*******************************************************************************
 * Prose styles
 ******************************************************************************/
@utility prose-dnb {
  --tw-prose-body: var(--color-gray-800);
  --tw-prose-headings: var(--color-gray-900);
  --tw-prose-lead: var(--color-gray-700);
  --tw-prose-links: var(--color-gray-900);
  --tw-prose-bold: var(--color-gray-900);
  --tw-prose-counters: var(--color-gray-600);
  --tw-prose-bullets: var(--color-gray-400);
  --tw-prose-hr: var(--color-gray-300);
  --tw-prose-quotes: var(--color-gray-900);
  --tw-prose-quote-borders: var(--color-gray-300);
  --tw-prose-captions: var(--color-gray-700);
  --tw-prose-code: var(--color-gray-900);
  --tw-prose-pre-code: var(--color-gray-100);
  --tw-prose-pre-bg: var(--color-gray-900);
  --tw-prose-th-borders: var(--color-gray-300);
  --tw-prose-td-borders: var(--color-gray-200);
  --tw-prose-invert-body: var(--color-gray-200);
  --tw-prose-invert-headings: var(--color-white);
  --tw-prose-invert-lead: var(--color-gray-300);
  --tw-prose-invert-links: var(--color-white);
  --tw-prose-invert-bold: var(--color-white);
  --tw-prose-invert-counters: var(--color-gray-400);
  --tw-prose-invert-bullets: var(--color-gray-600);
  --tw-prose-invert-hr: var(--color-gray-700);
  --tw-prose-invert-quotes: var(--color-gray-100);
  --tw-prose-invert-quote-borders: var(--color-gray-700);
  --tw-prose-invert-captions: var(--color-gray-400);
  --tw-prose-invert-code: var(--color-white);
  --tw-prose-invert-pre-code: var(--color-gray-300);
  --tw-prose-invert-pre-bg: rgb(0 0 0 / 0.5);
  --tw-prose-invert-th-borders: var(--color-gray-600);
  --tw-prose-invert-td-borders: var(--color-gray-700);
}

@layer components {
  .typography-ui {
    @apply text-sm md:text-base lg:text-xl xl:text-2xl;
  }

  .typography-reading {
    @apply prose;
    @apply prose-dnb;
    @apply prose-sm md:prose lg:prose-xl xl:prose-2xl;
    @apply dark:prose-invert prose-slate;
    @apply max-w-none;

    /* Changa is only available via weight 400 */
    @apply prose-headings:font-normal;

    p {
      font-variant-ligatures: common-ligatures;
    }

    hr {
      @apply my-8 border-0 border-t border-gray-300 dark:border-gray-700;
    }
  }
}

@layer utilities {
  /* these MUST be em based so the typography-reading class can scale here */
  .reading-sm {
    font-size: 0.875em;
  }
  .reading-lg {
    font-size: 1.2em;
  }
  .reading-xl {
    font-size: 1.5em;
  }
}
```

## Rationale

### Why `typography-ui` exists

UI typography and reading typography solve different problems.

UI typography should support:

* navigation
* controls
* metadata
* cards
* compact interface elements

Reading typography should support:

* comfortable prose reading
* heading rhythm
* paragraph spacing
* list spacing
* code formatting
* blockquotes
* semantic long-form content

Keeping them separate avoids accidental styling leakage and makes both systems easier to maintain.

### Why `typography-reading` exists

`typography-reading` provides a controlled prose environment using the Typography plugin plus project-specific theme values through `prose-dnb`.

This centralises reading rules instead of scattering them across components.

### Why `reading-*` exists

Some content elements inside prose need local scaling without breaking the overall reading system.

Examples:

* a quieter sidenote
* a larger call to action
* a smaller supporting paragraph
* a visually distinct annotation

`reading-*` utilities provide this fine-tuning without replacing the main prose wrapper.

## Rules

### Rule 1: `typography-ui` is the default outer layer

Use `typography-ui` for the outer application shell and for standalone UI elements.

In most cases, apply it to `body`.

### Rule 2: `typography-reading` is only for prose areas

Do not use `typography-reading` for general layout wrappers, cards, navigation, or UI-heavy containers.

Use it only where prose behaviour is actually wanted.

### Rule 3: `reading-*` is only for local adjustments inside reading content

`reading-*` should fine-tune text inside `typography-reading`.

Do not use `reading-*` as a substitute for the UI typography system.

### Rule 4: `reading-*` must always be `em` based

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

### Rule 5: do not use Tailwind `text-*` inside `typography-reading`

Inside the reading context, font-size adjustments should be done with `reading-*` or other `em`-based helpers.

Do not use `text-sm`, `text-lg`, etc. inside `typography-reading`, because those operate on the global scale rather than the current prose base.

### Rule 6: use `not-prose` directly in markup

When a UI element appears inside `typography-reading`, use Tailwind Typography's escape hatch directly in markup:

```astro
<div class="not-prose typography-ui">
  <button>Button inside prose</button>
</div>
```

Do not use `@apply not-prose`.

`not-prose` must always be written directly in markup.

### Rule 7: always pair `not-prose` with `typography-ui`

`not-prose` exits the Typography plugin, but it does not automatically restore the UI typography system.

That means this is correct:

```astro
<div class="not-prose typography-ui">
  ...
</div>
```

and this is not sufficient:

```astro
<div class="not-prose">
  ...
</div>
```

### Rule 8: do not re-enter prose inside `not-prose`

`not-prose` creates a hard boundary.

Do not try to nest `typography-reading` inside a `not-prose` block.

### Rule 9: keep sizes in `reading-*` at or above ~0.75em

Avoid font sizes below ~0.75em in reading context. Smaller sizes should only be used for very specific, intentional cases (e.g. annotations or microcopy) and should not be introduced as general-purpose utilities.

## Notes and warnings

### Warning: old names are obsolete

Older intermediate names such as:

* `type-ui`
* `type-reading`

should be considered obsolete.

The final names are:

* `typography-ui`
* `typography-reading`

### Warning: `reading-*` is intentionally small in scope

If `reading-*` feels unused, that is not necessarily a problem.

These utilities exist for exceptions and fine-tuning, not for everyday typography decisions.

They should appear less often than `typography-ui` and `typography-reading`.

### Warning: keep `typography-*` in `@layer components`

`typography-ui` and `typography-reading` are semantic wrapper classes, not atomic utilities.

They belong in `@layer components`.

### Warning: keep `reading-*` in `@layer utilities`

`reading-*` classes are local, single-purpose adjustments.

They belong in `@layer utilities`.

### Warning: Typography plugin required

`typography-reading` depends on the Tailwind Typography plugin being installed and configured.

Without the plugin, the prose-related behaviour will not work as intended.

## Summary

The final system is:

* `typography-ui` for general interface typography
* `typography-reading` for prose content
* `reading-*` for small, relative adjustments inside prose
* `not-prose typography-ui` for UI islands inside prose

This is the final intended structure and should replace older notes that still refer to `type-*`.

## Migration note (from older typography system)

If any code still uses the previous naming or patterns, update it to the current system.

Replace all occurrences of `type-ui` with `typography-ui` and `type-reading` with `typography-reading`.
Ensure that any use of Tailwind Typography escape classes follows the correct pattern:
do not use `@apply not-prose`; instead, use `not-prose` directly in markup and always combine it with `typography-ui` (e.g. `<div class="not-prose typography-ui">`).
Additionally, remove any use of Tailwind `text-*` utilities inside `typography-reading` and replace them with `reading-*` utilities or `em`-based sizing where appropriate.
Verify that all `reading-*` utilities use `em` units (not `rem` or `text-*`) and avoid introducing sizes below ~0.75em unless explicitly required for a specific use case.
