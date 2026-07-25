# Roadmap

> Generated cache of the current GitHub issue state. GitHub Issues are the source of truth — this file is a scannable index, not a substitute. Do not copy full issue bodies here; details live in the issues.
>
> Last regenerated: 2026-07-25

## Project state summary

20 open issues. Since the last regeneration, six previously-tracked issues (#1682, #1691, #1693, #1695, #1696, #1704) were confirmed closed on GitHub and removed from this index — the prior roadmap snapshot was stale. Five new issues (#1769–#1773) were filed from `TODO.md`, covering caption link contrast, Markdown definition lists, ported typographic replacements, a dev-server CTRL+C shutdown bug, and a documentation-server frontmatter leak bug. Tests remain green; other health indicators not re-verified this pass.

### Project health indicators

| Indicator | Status | Detail |
| --- | --- | --- |
| Unit tests (`npm test`) | ✅ Pass | 268 passed, 2 skipped (82/83 test files) |
| Typecheck (`npm run check`) | ✅ Pass | 0 errors, 0 warnings, 0 hints across 266 files (not re-verified this pass) |
| Lint/format (`npm run biome:check`) | ⚠️ 148 errors, 2 infos | Mostly auto-fixable via `npm run biome:lint`; ~15 need manual review. Not re-verified this pass. |
| `npm audit` | ⚠️ 34 findings (5 low, 27 moderate, 2 high) | Remaining CVEs tracked individually: #1750–#1756 (all `status:blocked`, pending upstream fixes). |
| CI (`main`, last runs) | ✅ Pass | Unit tests and daily Lighthouse audit green as of 2026-07-25 |
| Outdated deps (major) | ℹ️ Routine | Not re-checked this run; prior note flagged `@types/node`, `js-yaml`, `typescript` majors pending, not urgent |

## Bugs

* [#1769](https://github.com/davidsneighbour/kollitsch.dev/issues/1769) — fix(styles): improve contrast of links inside cover images/captions. Fine to drop red link color in this context if needed for contrast.
* [#1771](https://github.com/davidsneighbour/kollitsch.dev/issues/1771) — fix(dev): CTRL+C does not cleanly shut down both dev servers. Regression risk introduced by #1764's parallel `dev` script.
* [#1772](https://github.com/davidsneighbour/kollitsch.dev/issues/1772) — fix(docs): frontmatter bleeds through on some documentation server pages. Depends on the doc server from #1759.

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

## Content authoring

* [#1770](https://github.com/davidsneighbour/kollitsch.dev/issues/1770) — feat(content): support Markdown definition lists (dl/dt/dd). Investigate Astro's current remark/rehype integration points first.
* [#1773](https://github.com/davidsneighbour/kollitsch.dev/issues/1773) — feat(content): port typographic replacement rules from samui-samui.de. Investigation-first task.

## Frontend UX / features

* [#1700](https://github.com/davidsneighbour/kollitsch.dev/issues/1700) — feat(icons): evaluate itshover.com/icons as an icon enhancement option. Exploratory/spike.
* [#1661](https://github.com/davidsneighbour/kollitsch.dev/issues/1661) — feat(content): replace `<color-grid>` web component with an MDX component.
* [#1662](https://github.com/davidsneighbour/kollitsch.dev/issues/1662) — feat(content): replace raw Spotify `<iframe>` embed with a `SpotifyAlbum` MDX component.

## Testing

* [#1680](https://github.com/davidsneighbour/kollitsch.dev/issues/1680) — test(utils): add co-located unit tests for 13 untested utility modules.
* [#1699](https://github.com/davidsneighbour/kollitsch.dev/issues/1699) — feat(tests): extend Playwright e2e suite with live site smoke tests.
* [#1761](https://github.com/davidsneighbour/kollitsch.dev/issues/1761) — chore(tests): evaluate Playwright v1.62 component testing feature.

## Tooling / DX / chores

* [#1678](https://github.com/davidsneighbour/kollitsch.dev/issues/1678) — refactor(utils): replace `@ts-ignore` with type-safe alternatives in `content.ts` and `Giscus.astro`.
* [#1698](https://github.com/davidsneighbour/kollitsch.dev/issues/1698) — chore(vscode): add `excludeAgent` frontmatter to `.vscode/instructions/` files.
* [#1689](https://github.com/davidsneighbour/kollitsch.dev/issues/1689) — chore(ai): adopt `ai/review/` structured action registry when available. Blocked — registry doesn't exist upstream yet.

## Suggested order of work

1. **Dependency cleanup**: #1750–#1756 are blocked on upstream, but worth a periodic check; #1676 should be closed or explicitly scoped once those resolve.
2. **New bugs from this pass**: #1769 (caption link contrast) and #1772 (doc-server frontmatter leak) are small, self-contained fixes; #1771 (CTRL+C shutdown) needs a bit more investigation into `run-p` signal handling.
3. **#1688** (DESIGN.md backlog) — scope concretely, check overlap with #1697.
4. Content authoring (#1770, #1773) can proceed independently — both are investigation-first.
5. Remaining UX/feature work (#1700, #1661, #1662) and tooling (#1678, #1698, #1699, #1680, #1761) can proceed independently, in any order.
6. Deferred/blocked: **#1701** (upstream Lightning CSS support), **#1689** (upstream `ai/review/` registry) — check periodically, don't schedule work yet.

## Open clarification questions

* #1770 (definition lists): confirm whether a blank line between consecutive `Term`/`: Definition` pairs should always merge into one list, given the assumption that back-to-back separate definition lists won't occur in practice.

## Recently completed

* [#1682](https://github.com/davidsneighbour/kollitsch.dev/issues/1682), [#1691](https://github.com/davidsneighbour/kollitsch.dev/issues/1691), [#1695](https://github.com/davidsneighbour/kollitsch.dev/issues/1695), [#1696](https://github.com/davidsneighbour/kollitsch.dev/issues/1696), [#1704](https://github.com/davidsneighbour/kollitsch.dev/issues/1704) — confirmed closed on GitHub; removed from active sections (the prior roadmap snapshot had been stale).
* [#1760](https://github.com/davidsneighbour/kollitsch.dev/issues/1760) — direct-to-main, no-PR, issue-linked commit policy now documented in `CLAUDE.md` and `.agents/instructions/issue-handling.instructions.md`.
* [#1763](https://github.com/davidsneighbour/kollitsch.dev/issues/1763) — TypeDoc output moved from `docs/` to `documentation/api/`.
* [#1759](https://github.com/davidsneighbour/kollitsch.dev/issues/1759) — `documentation/` markdown dev server added (`npm run dev:docs`, `src/scripts/documentation-server.ts`).
* [#1758](https://github.com/davidsneighbour/kollitsch.dev/issues/1758) — `npm run dev:open` browser-tab launcher added (`src/scripts/dev-open.ts`).
* [#1762](https://github.com/davidsneighbour/kollitsch.dev/issues/1762) — Vite dev-server watcher (`astro.config.ts`) now ignores `scratch/`, `.vscode/`, `.agents/`, and root-level uppercase docs.
* [#1764](https://github.com/davidsneighbour/kollitsch.dev/issues/1764) — `npm run dev` now runs the Astro dev server and documentation server in parallel (`run-p dev:site dev:docs`); Astro-only script preserved as `dev:site`.
