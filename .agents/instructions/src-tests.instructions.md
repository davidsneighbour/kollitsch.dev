---
applyTo: "src/**/*.test.ts,src/test/**,vitest.config.js"
---

# Tests

- Unit tests live next to the file they test (`Component.test.ts` beside `Component.astro`).
- Component tests under `src/components/` MUST use a PascalCase basename, for example `ShareIntentClient.test.ts`, as required by `.ls-lint.yml`. Keep the test beside its source; check the effective filename rules before naming a new file.
- Secretlint scans test fixtures too (`.lintstagedrc.ts`). Keep security rejection cases intact and construct clearly synthetic credential-shaped inputs programmatically so the fixtures comply with the secret-scanning rules.
- Every unit test file MUST start with `// @vitest-environment node`.
- Browser tests are `src/test/browser/**/*.browser.test.ts` and run only with `VITEST_BROWSER=true`.
- Run one file with `npx vitest run src/path/to/file.test.ts`.
- When a new file is picked up by an existing suite (for example `src/test/browser/components-props.test.ts` checks every component under `src/components/`), fix the source, not the test.
