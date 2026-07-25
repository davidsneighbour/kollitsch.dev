# Roadmap

> Generated cache of the current GitHub issue state. GitHub Issues are the source of truth — this file is a scannable index, not a substitute. Do not copy full issue bodies here; details live in the issues.
>
> Last regenerated: 2026-07-25

## Project state summary

31 open issues. Since the last regeneration, six bug/lint issues closed (#1666–#1672, #1681, #1683, #1684, #1692, #1694) plus #1690, which was closed manually this run — commit `dc53942` said "Closes #1690" but the auto-close keyword didn't trigger on push. `npm audit` dropped from 45 to 34 findings; the seven remaining CVEs are now tracked individually as `status:blocked` issues (#1750–#1756), each pending an upstream fix. Six new issues (#1758–#1763) were filed from stale `TODO.md` notes, which is now empty of actionable items. Tests, typecheck, and CI remain green; Biome lint has a pre-existing backlog of 148 errors (mostly auto-fixable).

### Project health indicators

| Indicator | Status | Detail |
| --- | --- | --- |
| Unit tests (`npm test`) | ✅ Pass | 268 passed, 2 skipped (82/83 test files) |
| Typecheck (`npm run check`) | ✅ Pass | 0 errors, 0 warnings, 0 hints across 266 files |
| Lint/format (`npm run biome:check`) | ⚠️ 148 errors, 2 infos | Mostly auto-fixable via `npm run biome:lint`; ~15 need manual review (parse errors on a handful of `.astro` files, `noExplicitAny`, `noUndeclaredVariables`, `noAssignInExpressions`). Unchanged since last run. |
| `npm audit` | ⚠️ 34 findings (5 low, 27 moderate, 2 high) | Down from 45. Remaining CVEs tracked individually: #1750–#1756 (all `status:blocked`, pending upstream fixes). |
| CI (`main`, last runs) | ✅ Pass | Unit tests and daily Lighthouse audit green as of 2026-07-25 |
| Outdated deps (major) | ℹ️ Routine | Not re-checked this run; prior note flagged `@types/node`, `js-yaml`, `typescript` majors pending, not urgent |

## Bugs

None open — all bug issues from the prior roadmap round are closed.

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

* [#1688](https://github.com/davidsneighbour/kollitsch.dev/issues/1688) — feat(design): carry forward `DESIGN.md` backlog items. Umbrella item; now that #1690 (typography baseline) is closed, this can likely be scoped concretely — check for overlap with #1697.
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
* [#1761](https://github.com/davidsneighbour/kollitsch.dev/issues/1761) — chore(tests): evaluate Playwright v1.62 component testing feature. New — filed from `TODO.md`.

## Tooling / DX / chores

* [#1678](https://github.com/davidsneighbour/kollitsch.dev/issues/1678) — refactor(utils): replace `@ts-ignore` with type-safe alternatives in `content.ts` and `Giscus.astro`.
* [#1682](https://github.com/davidsneighbour/kollitsch.dev/issues/1682) — chore(config): install `@google/design.md` locally instead of fetching via `npx` on each run.
* [#1693](https://github.com/davidsneighbour/kollitsch.dev/issues/1693) — feat(scripts): introduce Nanny CLI wrapper for `src/scripts` invocations.
* [#1704](https://github.com/davidsneighbour/kollitsch.dev/issues/1704) — feat(dev): replace basic-ssl with mkcert for a locally-trusted HTTPS dev server.
* [#1698](https://github.com/davidsneighbour/kollitsch.dev/issues/1698) — chore(vscode): add `excludeAgent` frontmatter to `.vscode/instructions/` files.
* [#1689](https://github.com/davidsneighbour/kollitsch.dev/issues/1689) — chore(ai): adopt `ai/review/` structured action registry when available. Blocked — registry doesn't exist upstream yet.
* [#1758](https://github.com/davidsneighbour/kollitsch.dev/issues/1758) — feat(dev): add `npm run dev:open` to launch browser tabs for dev server and docs. New — filed from `TODO.md`; depends on #1759.
* [#1759](https://github.com/davidsneighbour/kollitsch.dev/issues/1759) — feat(docs): add local dev server for `documentation/` markdown files. New — filed from `TODO.md`; needs clarification on the `../samui-samui.de` reference implementation.
* [#1760](https://github.com/davidsneighbour/kollitsch.dev/issues/1760) — docs(agents): formalize main-branch-only commit workflow in instructions. New — filed from `TODO.md`; **conflicts with `CLAUDE.md`'s "never commit directly to main" rule**, needs Patrick's decision before implementation.
* [#1762](https://github.com/davidsneighbour/kollitsch.dev/issues/1762) — chore(dev): exclude non-site files from dev server restart watcher. New — filed from `TODO.md`.
* [#1763](https://github.com/davidsneighbour/kollitsch.dev/issues/1763) — chore(docs): rename `docs/` folder usage to `documentation/` and move API doc generation. New — filed from `TODO.md`; sequence with #1759.

## Suggested order of work

1. **#1760** — resolve the main-branch-vs-feature-branch policy conflict first; it affects how every future commit in this repo is made.
2. **Dependency cleanup**: #1750–#1756 are blocked on upstream, but worth a periodic check; #1676 should be closed or explicitly scoped once those resolve.
3. **#1688** (DESIGN.md backlog) — now unblocked by #1690's closure; scope concretely, check overlap with #1697.
4. **Documentation tooling**: #1763 (move API docs into `documentation/`) before #1759 (docs dev server), before #1758 (`dev:open` browser launcher) — each depends on the previous.
5. UX/feature work (#1691, #1695, #1696, #1661, #1662) and remaining tooling (#1678, #1680, #1682, #1693, #1698, #1699, #1704) can proceed independently, in any order.
6. Deferred/blocked: **#1701** (upstream Lightning CSS support), **#1689** (upstream `ai/review/` registry) — check periodically, don't schedule work yet.

## Open clarification questions

* **#1760** — `CLAUDE.md` says never commit directly to `main`; the TODO note this issue was filed from says the opposite. Needs Patrick's decision.
* **#1759** — what mechanism does `../samui-samui.de` use for its documentation dev server? Not accessible from this repo; needs a pointer or description.
* **#1758** — should `dev:open` be wired to also open the documentation server once #1759 lands, or stay scoped to the main dev server only for now?
