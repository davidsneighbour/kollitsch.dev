# TODO

Open design and implementation items for kollitsch.dev.

## DESIGN.md

- [ ] **Semantic color system** — define explicit `primary`, `secondary`, `on-primary` etc. token names and map them to the gray/orange/red palette so components can reference semantic roles rather than raw hue scales.
- [ ] **Dark mode token pair** — add explicit `surface-dark` / `on-surface-dark` values for every color token that has a light-mode counterpart, so dark mode tokens are first-class citizens rather than `dark:` utility overrides.
- [ ] **Motion tokens** — document the custom easing functions (`ease-out-cubic`, `ease-in-out-quart`, etc.) defined in `theme.css` as DESIGN.md tokens and add a prose rationale for which easing maps to which interaction type (enter, exit, in-place).
- [ ] **Form component tokens** — add `input`, `input-focus`, `input-error` component token entries once the form styling is finalised.
- [ ] **Navigation tokens** — add `nav-item`, `nav-item-active`, `nav-item-hover` component entries for the top navigation and footer navigation.
- [ ] **Full component coverage** — add component token entries for: `tag` / `category chip`, `pagination`, `blockquote`, `callout/aside`, `table`.
- [ ] **Icon system section** — add an `## Icons` section documenting the three icon sets in use (Bootstrap Icons bare names, `lucide:*`, `simple-icons:*`, `fa7-brands:*`) and when to use each.
- [ ] **OpenGraph image design** — document the OG image layout (satori-based) as a component entry with typography and color tokens that match the main design system.
- [ ] **Sidebar tokens** — the `@theme inline` block maps `--sidebar-*` variables that are not yet defined anywhere with values; document or remove them.

## Linting / CI

- [ ] Add `lint:design` script to `package.json` once `@google/design.md` is stable enough to include in CI without flakiness.
- [ ] Add `lint:design` to the pre-commit `lint-staged` config for `DESIGN.md` changes.
- [ ] Add DESIGN.md diff step to the release workflow to surface token regressions in changelogs.
