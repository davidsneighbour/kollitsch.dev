# Release validation

`npm run release` runs unit tests, Playwright end-to-end tests, and Astro checks before creating a version, tag, and GitHub release.

Playwright owns a foreground Astro process at `https://127.0.0.1:4400`. Its `--ignore-lock` option prevents Astro's automatic background mode and keeps the test server separate from the interactive dev server's lock file and port. Playwright stops this process when the test run ends. The test server does not use the development supervisor, which manages port `4321`.

Use `npm run release:tests` to run the release checks without publishing. Use `npx release-it --ci --dry-run --config .release-it.ts` to preview versioning and release operations without writing or publishing them.
