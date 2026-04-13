# ToDo

## Needs review

- [ ] src/components/README.md: potential stale documentation references to "TODO-heavy" component areas.
  - Reason: wording indicates known caveats but does not map to tracked implementation tasks.
  - Risk: documentation may still be intentional guidance rather than obsolete notes.
  - Suggested next step: cross-check each listed component against active issue tracking before editing.

- [ ] src/test/TODO.md: evaluate whether listed e2e coverage gaps are still accurate.
  - Reason: this task did not validate each TODO item against current test coverage.
  - Risk: removing or rewriting items without verification could hide genuine gaps.
  - Suggested next step: map TODO entries to current Playwright suites and close only confirmed completed items.

## Deprecated or legacy candidates

- [ ] src/utils/tags.ts: deprecated `GetTagsOptions.sortBy` compatibility path remains in public API.
  - Reason: `sortBy` is marked deprecated and retained for backwards compatibility.
  - Suggested action: remove `sortBy` after confirming there are no external consumers.
  - Blocker: repository may rely on string-based or external calls not visible in local imports.
