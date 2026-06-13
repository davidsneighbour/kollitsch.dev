# TODO

Open tasks, ideas, and deferred work for kollitsch.dev.
Priority labels: `P0` (immediately) · `P1` (next session) · `P2` (planned) · `P3` (nice to have) · `IDEA` (think about it).

## DESIGN.md

* [P1] **Sidebar tokens** — the `@theme inline` block references `--sidebar-*` variables that have no defined values anywhere; document their intended values or remove the mappings.
* [P2] **Semantic color system** — define explicit `primary`, `secondary`, `on-primary`, etc. token names mapped to the gray/orange/red palette so components reference semantic roles rather than raw hue scales.
* [P2] **Dark mode token pairs** — add explicit dark-mode values for every color token that has a light-mode counterpart, so dark mode is first-class rather than `dark:` utility overrides.
* [P2] **Form component tokens** — add `input`, `input-focus`, `input-error` component token entries once form styling is finalised.
* [P2] **Navigation tokens** — add `nav-item`, `nav-item-active`, `nav-item-hover` component entries for the top and footer navigation.
* [P3] **Motion tokens** — document the custom easing functions (`ease-out-cubic`, `ease-in-out-quart`, etc.) defined in `theme.css` as DESIGN.md tokens with prose rationale for which easing maps to which interaction type (enter, exit, in-place).
* [P3] **Full component coverage** — add component token entries for: `tag` / `category chip`, `pagination`, `blockquote`, `callout/aside`, `table`.
* [P3] **Icon system section** — add an `## Icons` section documenting the three icon sets in use (Bootstrap Icons bare names, `lucide:*`, `simple-icons:*`, `fa7-brands:*`) and when to use each.
* [P3] **OpenGraph image design** — document the OG image layout (satori-based) as a component entry with typography and color tokens that match the main design system.

## Linting / CI

* [P2] **lint:design in pre-commit** — add `lint:design` to the `lint-staged` config in `.lintstagedrc.ts` for `DESIGN.md` changes.
* [P3] **DESIGN.md diff in release workflow** — add a `npm run lint:design:diff` step to surface token regressions in release changelogs.
