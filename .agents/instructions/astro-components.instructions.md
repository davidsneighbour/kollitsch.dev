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

## Icons in components

* Import `Icon` from `astro-icon/components`, never write inline `<svg>`.
* If a component renders a link that contains an icon, use `<IconLink>` from `@components/shared/links/IconLink.astro` rather than composing `<Icon>` and `<a>` by hand.
* When you find an inline `<svg>` in an existing component, check [simpleicons.org](https://simpleicons.org) (brands) or [lucide.dev](https://lucide.dev) (UI) for an equivalent and replace it.
* Size icons with a CSS class such as `size-[1em]` so they scale with the surrounding font size. Do not rely solely on the SVG `width`/`height` presentation attributes.

## Script processing

When using `define:vars` on a `<script>` tag, add `is:inline` explicitly to silence the Astro hint:

```astro
<script is:inline define:vars={{ foo, bar }}>
```
