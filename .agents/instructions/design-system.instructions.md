---
applyTo: "DESIGN.md,src/**/*.{astro,css,tsx},public/assets/styles/**"
---

# Design system changes

`DESIGN.md` is the single source of truth for visual design (see `AGENTS.md`).

- Update `DESIGN.md` with every design change (new tokens, changed values, new components, revised rationale), then run `npm run lint:design` until it reports 0 errors.
- Do not introduce values that are absent from `DESIGN.md`; add them there first. Use token references (`{colors.primary}`, `{rounded.md}`) in component token definitions, never inline raw values.
