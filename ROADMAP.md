# Roadmap

> Generated cache of the current GitHub issue state. GitHub Issues are the source of truth — this file is a scannable index, not a substitute. Do not copy full issue bodies here; details live in the issues.
>
> Last regenerated: 2026-07-25

## Project state summary

26 open issues. Since the last regeneration, six tooling issues were implemented and closed in sequence: #1760 (direct-to-main commit policy, resolving a conflict with the old `CLAUDE.md` wording), #1763 (moved TypeDoc output from `docs/` to `documentation/api/`), #1759 (new `documentation/` markdown dev server via `npm run dev:docs`), #1758 (`npm run dev:open` browser launcher), #1762 (Vite dev-server watcher now ignores `scratch/`, `.vscode/`, `.agents/`, and root-level docs), and #1764 (ad hoc request: `npm run dev` now runs both dev servers in parallel). Tests, typecheck, and CI remain green throughout.

### Project health indicators

| Indicator | Status | Detail |
| --- | --- | --- |
| Unit tests (`npm test`) | ✅ Pass | 268 passed, 2 skipped (82/83 test files) |
| Typecheck (`npm run check`) | ✅ Pass | 0 errors, 0 warnings, 0 hints across 266 files |
| Lint/format (`npm run biome:check`) | ⚠️ 148 errors, 2 infos | Mostly auto-fixable via `npm run biome:lint`; ~15 need manual review (parse errors on a handful of `.astro` files, `noExplicitAny`, `noUndeclaredVariables`, `noAssignInExpressions`). Unchanged since last run. |
| `npm audit` | ⚠️ 34 findings (5 low, 27 moderate, 2 high) | Remaining CVEs tracked individually: #1750–#1756 (all `status:blocked`, pending upstream fixes). |
| CI (`main`, last runs) | ✅ Pass | Unit tests and daily Lighthouse audit green as of 2026-07-25 |
| Outdated deps (major) | ℹ️ Routine | Not re-checked this run; prior note flagged `@types/node`, `js-yaml`, `typescript` majors pending, not urgent |

## Bugs

None open.

## Dependencies & security

* [#1676](https://github.com/davidsneighbour/kollitsch.dev/issues/1676) — fix(deps): umbrella audit-cleanliness tracker. Remaining findings now covered by the per-CVE issues below; keep open until those close, or close this in favor of them.
* [#1750](https://github.com/davidsneighbour/kollitsch.dev/issues/1750) — GHSA-frvp-7c67-39w9 in `@hono/node-server`. Blocked on upstream.
* [#1751](https://github.com/davidsneighbour/kollitsch.dev/issues/1751) — GHSA-8988-4f7v-96qf in `@opentelemetry/core`. Blocked on upstream.
* [#1752](https://github.com/davidsneighbour/kollitsch.dev/issues/1752) — GHSA-848j-6mx2-7j84 in `elliptic`. Blocked on upstream, low priority.
* [#1753](https://github.com/davidsneighbour/kollitsch.dev/issues/1753) — GHSA-22p9-wv53-3rq4 in `linkify-it`. Blocked on upstream, high priority.
* [#1754](https://github.com/davidsneighbour/kollitsch.dev/issues/1754) — GHSA-v245-v573-v5vm in `linkify-it`. Blocked on upstream, high priority.
* [#1755](https://github.com/davidsneighbour/kollitsch.dev/issues/1755) — GHSA-38c4-r59v-3vqw in `markdown-it`. Blocked on upstream.
* [#1756](https://github.com/davidsneighbour/kollitsch.dev/issues/1756) — GHSA-6v5v-wf23-fmfq in `markdown-it`. Blocked on upstream.

## Design & typography

* [#1688](https://github.com/davidsneighbour/kollitsch.dev/issues/1688) — feat(design): carry forward `DESIGN.md` backlog items. Umbrella item; scope concretely, check for overlap with #1697.
* [#1697](https://github.com/davidsneighbour/kollitsch.dev/issues/1697) — feat(design): 90% opacity page background to reveal body background colour.
* [#1701](https://github.com/davidsneighbour/kollitsch.dev/issues/1701) — feat(styles): restore `::search-text` CSS Highlight API rules once Lightning CSS supports them. Blocked on upstream Lightning CSS support — check before starting.

## Frontend UX / features

* [#1691](https://github.com/davidsneighbour/kollitsch.dev/issues/1691) — feat(layout): move blog post preview into container-based layout.
* [#1695](https://github.com/davidsneighbour/kollitsch.dev/issues/1695) — feat(ux): add page, link, and title transitions.
* [#1696](https://github.com/davidsneighbour/kollitsch.dev/issues/1696) — feat(ux): show link underlines on blog post card hover.
* [#1700](https://github.com/davidsneighbour/kollitsch.dev/issues/1700) — feat(icons): evaluate itshover.com/icons as an icon enhancement option. Exploratory/spike.
* [#1661](https://github.com/davidsneighbour/kollitsch.dev/issues/1661) — feat(content): replace `<color-grid>` web component with an MDX component.
* [#1662](https://github.com/davidsneighbour/kollitsch.dev/issues/1662) — feat(content): replace raw Spotify `<iframe>` embed with a `SpotifyAlbum` MDX component.

## Testing

* [#1680](https://github.com/davidsneighbour/kollitsch.dev/issues/1680) — test(utils): add co-located unit tests for 13 untested utility modules.
* [#1699](https://github.com/davidsneighbour/kollitsch.dev/issues/1699) — feat(tests): extend Playwright e2e suite with live site smoke tests.
* [#1761](https://github.com/davidsneighbour/kollitsch.dev/issues/1761) — chore(tests): evaluate Playwright v1.62 component testing feature.

## Tooling / DX / chores

* [#1678](https://github.com/davidsneighbour/kollitsch.dev/issues/1678) — refactor(utils): replace `@ts-ignore` with type-safe alternatives in `content.ts` and `Giscus.astro`.
* [#1682](https://github.com/davidsneighbour/kollitsch.dev/issues/1682) — chore(config): install `@google/design.md` locally instead of fetching via `npx` on each run.
* [#1693](https://github.com/davidsneighbour/kollitsch.dev/issues/1693) — feat(scripts): introduce Nanny CLI wrapper for `src/scripts` invocations.
* [#1704](https://github.com/davidsneighbour/kollitsch.dev/issues/1704) — feat(dev): replace basic-ssl with mkcert for a locally-trusted HTTPS dev server.
* [#1698](https://github.com/davidsneighbour/kollitsch.dev/issues/1698) — chore(vscode): add `excludeAgent` frontmatter to `.vscode/instructions/` files.
* [#1689](https://github.com/davidsneighbour/kollitsch.dev/issues/1689) — chore(ai): adopt `ai/review/` structured action registry when available. Blocked — registry doesn't exist upstream yet.

## Suggested order of work

1. **Dependency cleanup**: #1750–#1756 are blocked on upstream, but worth a periodic check; #1676 should be closed or explicitly scoped once those resolve.
2. **#1688** (DESIGN.md backlog) — scope concretely, check overlap with #1697.
3. UX/feature work (#1691, #1695, #1696, #1661, #1662) and remaining tooling (#1678, #1680, #1682, #1693, #1698, #1699, #1704, #1761) can proceed independently, in any order.
4. Deferred/blocked: **#1701** (upstream Lightning CSS support), **#1689** (upstream `ai/review/` registry) — check periodically, don't schedule work yet.

## Open clarification questions

None outstanding.

## Recently completed (this session)

* [#1760](https://github.com/davidsneighbour/kollitsch.dev/issues/1760) — direct-to-main, no-PR, issue-linked commit policy now documented in `CLAUDE.md` and `.agents/instructions/issue-handling.instructions.md`.
* [#1763](https://github.com/davidsneighbour/kollitsch.dev/issues/1763) — TypeDoc output moved from `docs/` to `documentation/api/`.
* [#1759](https://github.com/davidsneighbour/kollitsch.dev/issues/1759) — `documentation/` markdown dev server added (`npm run dev:docs`, `src/scripts/documentation-server.ts`).
* [#1758](https://github.com/davidsneighbour/kollitsch.dev/issues/1758) — `npm run dev:open` browser-tab launcher added (`src/scripts/dev-open.ts`).
* [#1762](https://github.com/davidsneighbour/kollitsch.dev/issues/1762) — Vite dev-server watcher (`astro.config.ts`) now ignores `scratch/`, `.vscode/`, `.agents/`, and root-level uppercase docs.
* [#1764](https://github.com/davidsneighbour/kollitsch.dev/issues/1764) — `npm run dev` now runs the Astro dev server and documentation server in parallel (`run-p dev:site dev:docs`); Astro-only script preserved as `dev:site`.
