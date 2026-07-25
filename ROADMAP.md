# Roadmap

Generated cache of open GitHub issues. **GitHub Issues are the source of truth** — this file is a quick index, not a place to track new decisions.

## Project state summary

- 23 open issues (as of 2026-07-25).
- 3 recently closed via triage: [#1772](https://github.com/davidsneighbour/kollitsch.dev/issues/1772), [#1773](https://github.com/davidsneighbour/kollitsch.dev/issues/1773), [#1769](https://github.com/davidsneighbour/kollitsch.dev/issues/1769) — all fixed by recent commits but left open in tracking.
- `npm test`: 268 passed, 2 skipped, 0 failed (82 files passed, 1 skipped).
- `npm run biome:check`: **148 errors, 2 infos** — pre-existing lint debt, not caused by uncommitted changes; worth a dedicated cleanup pass.
- 5 npm-audit-driven dependency issues are all `status:blocked` (transitive vulns with no fix available yet upstream): #1756, #1755, #1754, #1753, #1752, #1751, #1750.

## Bugs / fixes

- [#1775](https://github.com/davidsneighbour/kollitsch.dev/issues/1775) — `npm install` fails fresh without `allow-git=all` (npm 12 default). Workaround (`.npmrc` override) already applied in `a4746494e04b`; issue stays open until `remark-lint-frontmatter-schema` is published to npm and `remark-config` stops depending on it via git+ssh. **prio:high**, cross-repo dependency.
- [#1676](https://github.com/davidsneighbour/kollitsch.dev/issues/1676) — npm audit shows 45 transitive vulnerabilities in dev toolchain. Likely overlaps with the blocked GHSA issues below; check before duplicating remediation work.

## Dependencies (security, blocked on upstream)

- [#1754](https://github.com/davidsneighbour/kollitsch.dev/issues/1754) — GHSA-v245-v573-v5vm in linkify-it. **prio:high**
- [#1753](https://github.com/davidsneighbour/kollitsch.dev/issues/1753) — GHSA-22p9-wv53-3rq4 in linkify-it. **prio:high**
- [#1756](https://github.com/davidsneighbour/kollitsch.dev/issues/1756) — GHSA-6v5v-wf23-fmfq in markdown-it. prio:medium
- [#1755](https://github.com/davidsneighbour/kollitsch.dev/issues/1755) — GHSA-38c4-r59v-3vqw in markdown-it. prio:medium
- [#1751](https://github.com/davidsneighbour/kollitsch.dev/issues/1751) — GHSA-8988-4f7v-96qf in @opentelemetry/core. prio:medium
- [#1750](https://github.com/davidsneighbour/kollitsch.dev/issues/1750) — GHSA-frvp-7c67-39w9 in @hono/node-server. prio:medium
- [#1752](https://github.com/davidsneighbour/kollitsch.dev/issues/1752) — GHSA-848j-6mx2-7j84 in elliptic. prio:low

All six are `status:blocked` — re-check periodically via `dnb-osv-scan` for upstream fixes rather than working around them manually.

## Refactoring / tech debt

- [#1678](https://github.com/davidsneighbour/kollitsch.dev/issues/1678) — replace `@ts-ignore` with type-safe alternatives in `content.ts` and `Giscus.astro`. prio:medium.
- [#1689](https://github.com/davidsneighbour/kollitsch.dev/issues/1689) — adopt `ai/review/` structured action registry when available. Blocked on that registry existing.

## Tests

- [#1699](https://github.com/davidsneighbour/kollitsch.dev/issues/1699) — extend Playwright e2e suite with live-site smoke tests. prio:medium.
- [#1680](https://github.com/davidsneighbour/kollitsch.dev/issues/1680) — add co-located unit tests for 13 untested utility modules. prio:low.
- [#1761](https://github.com/davidsneighbour/kollitsch.dev/issues/1761) — evaluate Playwright v1.62 component testing feature. prio:low, exploratory.

## New features / content

- [#1771](https://github.com/davidsneighbour/kollitsch.dev/issues/1771) — port typographic replacement rules from samui-samui.de. prio:low.
- [#1770](https://github.com/davidsneighbour/kollitsch.dev/issues/1770) — support Markdown definition lists (dl/dt/dd). prio:low.
- [#1701](https://github.com/davidsneighbour/kollitsch.dev/issues/1701) — restore `::search-text` CSS Highlight API rules once Lightning CSS supports them. Blocked on tooling support.
- [#1700](https://github.com/davidsneighbour/kollitsch.dev/issues/1700) — evaluate itshover.com/icons as icon enhancement option. prio:low, exploratory.
- [#1697](https://github.com/davidsneighbour/kollitsch.dev/issues/1697) — 90% opacity page background to reveal body background colour. prio:low.
- [#1688](https://github.com/davidsneighbour/kollitsch.dev/issues/1688) — carry forward DESIGN.md backlog items. prio:low.
- [#1662](https://github.com/davidsneighbour/kollitsch.dev/issues/1662) — replace raw Spotify `<iframe>` embed with a `SpotifyAlbum` MDX component. prio:low.
- [#1661](https://github.com/davidsneighbour/kollitsch.dev/issues/1661) — replace `<color-grid>` web component with a proper MDX component. prio:low.

## Maintenance

- [#1698](https://github.com/davidsneighbour/kollitsch.dev/issues/1698) — add `excludeAgent` frontmatter to `.vscode/instructions/` files. prio:low.

## Dependency notes

- #1676 should be triaged against the six blocked GHSA issues (#1750–#1756) before doing separate remediation — likely the same root vulnerabilities.
- #1689 depends on the `ai/review/` registry existing upstream (not yet available).
- #1701 depends on Lightning CSS adding `::search-text` support upstream.

## Suggested order of work

1. #1775 — cross-repo publish work to fully close out the npm-install workaround (currently only mitigated).
2. #1678 — type-safety refactor, self-contained and medium priority.
3. #1699 / #1680 — test coverage work, no blockers.
4. Batch through the low-priority content/feature issues (#1770, #1771, #1662, #1661, #1697, #1688) opportunistically.
5. Re-run `dnb-osv-scan` periodically to check if the six blocked GHSA issues have unblocked.

## Open clarification questions

None outstanding — all open issues have clear acceptance criteria or are explicitly blocked/exploratory.

## Health indicators

- Unit tests: 268 passed, 2 skipped, 0 failed.
- Lint (`biome:check`): 148 errors, 2 infos — not addressed in this triage pass (out of scope per triage skill boundaries).
- Build/typecheck: not run this pass (`npm run check` recommended before next release).
