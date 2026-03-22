# ToDo

## 3) Repair Markdown lint workflow

* **Issue:** `lint:markdown` invokes `markdownlint-cli2` without globs, and the config file does not provide `globs`.
* **Why this matters:** Documentation/content quality checks are effectively disabled.
* **Code references:**
  * `package.json` lines 162-163
  * `src/config/.markdownlint.jsonc` lines 1-40
* **Recommended action:** Add explicit globs to script or config, and make markdown lint part of CI.

## 4) Stabilise E2E and accessibility gating

* **Issue A:** Playwright uses preview mode, which requires `dist/`; failed build blocks E2E execution.
* **Issue B:** Accessibility spec uses `test.fail()` in both tests, making this suite expected-fail scaffolding rather than a stable gate.
* **Why this matters:** End-to-end confidence and accessibility assurances are not dependable.
* **Code references:**
  * `playwright.config.ts` lines 73-78
  * `package.json` lines 137 and 185
  * `src/test/test-2.spec.ts` lines 20-21 and 36-39
* **Recommended action:** Enforce successful build before E2E, remove expected-fail markers, and convert to deterministic pass/fail assertions.

## 5) Align CI with release risk

* **Issue:** Main PR workflow runs Vitest only; it does not run production build.
* **Why this matters:** A PR can pass checks while still being non-deployable.
* **Code references:**
  * `.github/workflows/tests.yml` lines 3-7 and 31-32
  * `.github/workflows/tests-e2e.yml` lines 3-8 and 70-75
* **Recommended action:** Add required build and check jobs to push/PR workflows; keep scheduled E2E as supplemental coverage.

## 6) Reduce global runtime overhead and broad UX intrusion

* **Issue:** Base layout injects an always-visible “under construction” banner and global runtime scripts on all pages.
* **Why this matters:** This affects perceived quality, can distract users, and adds client-side overhead site-wide.
* **Code references:**
  * `src/layouts/Site.astro` lines 45-47
  * `src/layouts/Site.astro` lines 51-71
  * `src/layouts/Site.astro` lines 89-162
* **Recommended action:** Feature-flag non-essential UX chrome and defer non-critical scripts by route or environment.

## 7) Standardise JSON import attributes

* **Issue:** `setup.json` is imported with mixed styles (with and without `with { type: "json" }`), causing build warnings.
* **Why this matters:** Inconsistent module semantics increase build noise and can hide actionable warnings.
* **Code references:**
  * `src/pages/llms.txt.ts` line 2
  * `src/pages/llms-full.txt.ts` line 3
  * `src/pages/llms/[...slug].txt.ts` line 2
  * `src/pages/blog/[page].astro` line 15
  * `src/pages/index.astro` line 5
* **Recommended action:** Adopt one JSON import convention repository-wide and enforce it via linting.

## Validation checklist (must pass for all changes)

* `npx astro check` passes.
* `npm run test` passes.
