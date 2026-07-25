# Roadmap

> Generated cache of the current GitHub issue state. GitHub Issues are the source of truth — this file is a scannable index, not a substitute. Do not copy full issue bodies here; details live in the issues.
>
> Last regenerated: 2026-07-25

## Project state summary

30 open issues, all still `status:unconfirmed` (none triaged/confirmed yet). No functional regressions are known — tests, typecheck, and CI are green. The bulk of the backlog is small, independent polish items (markdown lint, design tokens, UX micro-interactions) rather than blocking work. `TODO.md` is currently empty; all previously-deferred ideas have already been converted to the issues listed below.

### Project health indicators

| Indicator | Status | Detail |
| --- | --- | --- |
| Unit tests (`npm test`) | ✅ Pass | 261 passed, 2 skipped (81/82 test files) |
| Typecheck (`npm run check`) | ✅ Pass | 0 errors, 0 warnings, 0 hints across 265 files |
| Lint/format (`npm run biome:check`) | ⚠️ 148 errors, 2 infos | 133 are auto-fixable (103 format, 23 organize-imports, 7 sorted-keys) via `npm run biome:lint`. 15 need review: 6 parse errors on `.astro` files (LetterGlitch, FontsPreload, Head, OpenGraphImage, Featured, ShareSeparator), 5 `noExplicitAny`, 2 `noUndeclaredVariables` (Heading.astro), 2 `noAssignInExpressions` |
| CI (`main`, last runs) | ✅ Pass | Unit tests, push checks, and daily Lighthouse audit all green as of 2026-07-25 |
| `npm audit` | ⚠️ Tracked | 45 transitive dev-toolchain vulnerabilities (0 critical), none in production paths — see #1676 |
| Outdated deps (major) | ℹ️ Routine | 4 packages have a major bump available: `@davidsneighbour/imagemin-lint-staged` (2→3), `@types/node` (25→26), `js-yaml` (4→5), `typescript` (6→7) — not urgent, handle via normal dependency maintenance |

## Bugs

* [#1684](https://github.com/davidsneighbour/kollitsch.dev/issues/1684) — fix(components): guard Tags meta line against empty tags array. Rendering bug in `Tags.astro`; small, self-contained fix.
* [#1692](https://github.com/davidsneighbour/kollitsch.dev/issues/1692) — fix(content): validate and fix YouTube content type definition. Possible schema mismatch in `content.config.ts`; worth checking before other content-schema work.
* [#1681](https://github.com/davidsneighbour/kollitsch.dev/issues/1681) — fix(config): `astro.config.ts` imports `build-hooks.ts` from `src/scripts/`, which is excluded from `tsconfig`. Type-checking gap for a build-critical file.
* [#1683](https://github.com/davidsneighbour/kollitsch.dev/issues/1683) — fix(components): replace bare `console.log` in `OpenGraphImage.astro` cleanup catch with structured logging. Cosmetic but easy.
* [#1694](https://github.com/davidsneighbour/kollitsch.dev/issues/1694) — fix(content): audit and fix the web ring implementation. Unaudited since the Hugo→Astro migration; scope needs to be established before implementation.

## Content / markdown lint cleanup

Small, independent fixes surfaced by `markdownlint`; safe to batch or knock out individually.

* [#1666](https://github.com/davidsneighbour/kollitsch.dev/issues/1666) — MD045: missing image alt text.
* [#1667](https://github.com/davidsneighbour/kollitsch.dev/issues/1667) — MD036: bold text used as a faux heading.
* [#1668](https://github.com/davidsneighbour/kollitsch.dev/issues/1668) — MD025: duplicate H1 in the firefox-developer-edition post.
* [#1669](https://github.com/davidsneighbour/kollitsch.dev/issues/1669) — MD040: fenced code blocks missing a language specifier.
* [#1671](https://github.com/davidsneighbour/kollitsch.dev/issues/1671) — MD001: heading level jumps (H1→H3).
* [#1672](https://github.com/davidsneighbour/kollitsch.dev/issues/1672) — MD042: empty link href in the LocalWP plugin-installation post.
* [#1661](https://github.com/davidsneighbour/kollitsch.dev/issues/1661) — Replace `<color-grid>` web component with an MDX component (MD033 whitelist entry removal).
* [#1662](https://github.com/davidsneighbour/kollitsch.dev/issues/1662) — Replace raw Spotify `<iframe>` embed with a `SpotifyAlbum` MDX component (only current non-whitelisted MD033 violation).

## Dependencies & security

* [#1676](https://github.com/davidsneighbour/kollitsch.dev/issues/1676) — fix(deps): audit shows 45 transitive vulnerabilities in dev toolchain. Non-production impact; still worth resolving via overrides/updates.

## Design & typography

* [#1690](https://github.com/davidsneighbour/kollitsch.dev/issues/1690) — fix(design): review and fix typography scale against `DESIGN.md`. Foundational audit — do before other visual-polish issues below, since they may depend on its findings.
* [#1688](https://github.com/davidsneighbour/kollitsch.dev/issues/1688) — feat(design): carry forward `DESIGN.md` backlog items. Umbrella item; overlaps with #1690, #1697, #1701 — resolve or fold in once scoped.
* [#1697](https://github.com/davidsneighbour/kollitsch.dev/issues/1697) — feat(design): 90% opacity page background to reveal body background colour.
* [#1701](https://github.com/davidsneighbour/kollitsch.dev/issues/1701) — feat(styles): restore `::search-text` CSS Highlight API rules once Lightning CSS supports them. Blocked on upstream Lightning CSS support — check before starting.

## Frontend UX / features

* [#1691](https://github.com/davidsneighbour/kollitsch.dev/issues/1691) — feat(layout): move blog post preview into container-based layout.
* [#1695](https://github.com/davidsneighbour/kollitsch.dev/issues/1695) — feat(ux): add page, link, and title transitions.
* [#1696](https://github.com/davidsneighbour/kollitsch.dev/issues/1696) — feat(ux): show link underlines on blog post card hover.
* [#1700](https://github.com/davidsneighbour/kollitsch.dev/issues/1700) — feat(icons): evaluate itshover.com/icons as an icon enhancement option. Exploratory/spike, not a committed implementation.

## Testing

* [#1680](https://github.com/davidsneighbour/kollitsch.dev/issues/1680) — test(utils): add co-located unit tests for 13 untested utility modules.
* [#1699](https://github.com/davidsneighbour/kollitsch.dev/issues/1699) — feat(tests): extend Playwright e2e suite with live site smoke tests.

## Tooling / DX / chores

* [#1678](https://github.com/davidsneighbour/kollitsch.dev/issues/1678) — refactor(utils): replace `@ts-ignore` with type-safe alternatives in `content.ts` and `Giscus.astro`.
* [#1682](https://github.com/davidsneighbour/kollitsch.dev/issues/1682) — chore(config): install `@google/design.md` locally instead of fetching via `npx` on each run.
* [#1693](https://github.com/davidsneighbour/kollitsch.dev/issues/1693) — feat(scripts): introduce Nanny CLI wrapper for `src/scripts` invocations.
* [#1704](https://github.com/davidsneighbour/kollitsch.dev/issues/1704) — feat(dev): replace basic-ssl with mkcert for a locally-trusted HTTPS dev server.
* [#1698](https://github.com/davidsneighbour/kollitsch.dev/issues/1698) — chore(vscode): add `excludeAgent` frontmatter to `.vscode/instructions/` files.
* [#1689](https://github.com/davidsneighbour/kollitsch.dev/issues/1689) — chore(ai): adopt `ai/review/` structured action registry when available. Blocked — the registry doesn't exist upstream yet; revisit later, don't start now.

## Suggested order of work

1. **Quick bug fixes**: #1684, #1683, #1681 — small, self-contained, low risk.
2. **Content lint batch**: #1666, #1667, #1668, #1669, #1671, #1672 — mechanical fixes, good for a single cleanup pass.
3. **#1692** (YouTube content type) and **#1694** (web ring audit) — need a short investigation before fixing.
4. **#1690** (typography audit) before **#1688**, **#1697** — establishes the baseline the rest of the design work should follow.
5. **#1676** (dependency vulnerabilities) — routine but should not be left indefinitely.
6. UX/feature work (#1691, #1695, #1696) and tooling (#1682, #1693, #1704, #1698) can proceed independently, in any order, as time allows.
7. Deferred/blocked: **#1701** (upstream Lightning CSS support), **#1689** (upstream `ai/review/` registry) — check periodically, don't schedule work yet.

## Open clarification questions

None outstanding — no GitHub issue currently has an unanswered clarification question blocking implementation. #1688 and #1690 overlap in scope and may need to be merged or explicitly scoped apart once #1690's audit lands.
