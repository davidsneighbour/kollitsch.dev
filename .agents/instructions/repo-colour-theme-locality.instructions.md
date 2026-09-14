---
applyTo: "**"
---

# Colour and theme locality

Use the project's `primary-*` and `grey-*`/`gray-*` Tailwind colour utilities as the normal interface for site colours.

Prefer declaring visual styling at the lowest practical level where it is applied. A component-specific colour belongs in that component, preferably as a Tailwind utility such as `text-primary-500`, `bg-grey-950`, or `hover:border-primary-700`.

Do not introduce a global CSS custom property or semantic token merely to avoid specifying a project palette utility locally.

Centralise a colour only when at least one of these applies:

* it represents a genuinely site-wide semantic role such as `card`, `muted`, `foreground`, `danger`, or `border`;
* multiple independent components intentionally share the same semantic design decision;
* changing the value globally must intentionally change all consumers;
* the value must cross a CSS/JavaScript/data/generated-asset boundary where a Tailwind utility cannot reasonably be used;
* the theme requires runtime light/dark indirection that cannot be expressed cleanly with Tailwind variants.

When a token exists only for one component, prefer moving its default value back to that component unless there is a technical reason not to.

Do not create chains of aliases for component-specific styling. A developer investigating a component should normally be able to determine its colours by inspecting that component without tracing through unrelated global style sheets.

Keep the source palette abstraction centralised:

```text
Tailwind/custom source palette -> primary-* / grey-*
```

Keep genuinely global semantic tokens centralised where useful:

```text
primary/grey palette -> global semantic role
```

Keep component-specific choices local:

```text
component -> primary-* / grey-* utilities
```

Semantic application states remain independent of the brand palette: red for danger/error, amber for warning, green for success, and sky for information.

Syntax highlighting remains independent of the site theme.
