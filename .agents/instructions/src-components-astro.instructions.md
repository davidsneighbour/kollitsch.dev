---
applyTo: "src/components/**/*.astro"
---

# Astro Component Rules

## Props contract (enforced by test)

Every `.astro` file under `src/components/` **must** export its Props type with the `export` keyword:

```astro
export interface Props {
  myProp: string;
}
```

or

```astro
export type Props = {
  myProp: string;
};
```

`interface Props` without `export` is **not** sufficient. `src/test/browser/components-props.test.ts` scans every component with the regex `/export\s+(?:interface|type)\s+[A-Za-z0-9_]*Props\b/` and fails the suite if the pattern is absent.

Run `npm test` after creating or editing any component to confirm the contract is met.

## No-props components

If a component genuinely accepts no props, declare an empty exported interface rather than omitting it:

```astro
export interface Props {}
```

## Intentional decorative accessibility exceptions

`aria-hidden="true"` alone is not an accessibility exemption. Continue to flag
real structural accessibility problems such as focusable descendants, hidden
meaningful text, or interactive controls inside an `aria-hidden` subtree.

Elements marked with
`data-dnb-design-exception="decorative-low-contrast"` are intentional decorative
low-contrast design exceptions. Do not automatically "fix" their text contrast
or remove their `aria-hidden` state. If a change would alter the exception, ask
for explicit confirmation first.

## DOM ids on server-rendered components

Do not use `createIdentifier()`, `generateUniqueHtmlId()`, `Math.random()`, or any other per-render random value to generate an element's `id` unless the component can legitimately render more than once on the same page and the id must not collide.

For a component that only ever appears once per page (check with a repo-wide grep for its import before assuming this), use a fixed, human-readable id string instead, for example `'nav-search'` or `'footer-current-year'`. A random id makes every build of the page byte-different even when nothing visible changed, which defeats content-hash-based deploy diffing (Wrangler, Pagefind, CDN caches). Background: [GitHub issue #1978](https://github.com/davidsneighbour/kollitsch.dev/issues/1978).

## Script processing

When using `define:vars` on a `<script>` tag, add `is:inline` explicitly to silence the Astro hint:

```astro
<script is:inline define:vars={{ foo, bar }}>
```

## Cascade layers in component styles

A component stylesheet can load before `src/styles/theme.css`. The first stylesheet that names a cascade layer fixes its position, so a component that opens `@layer components` first would place `components` below `base`, and base rules would override it. When a component `<style>` block uses `@layer`, declare the full order before any layer block:

```css
@layer properties, theme, base, components, utilities;
```

See `src/components/features/search/Search.astro` and GitHub issue #2032.
