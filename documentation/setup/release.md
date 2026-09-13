# Release scripts

The release workflow uses `release-it` with the shared DNB release configuration in `.release-it.ts`.

Use `npm run release` for the normal conventional-commit release. It runs the release test gate first, then lets `release-it` choose the version increment from commit history.

Use an explicit increment script when the release type must be selected manually:

- `npm run release:patch`
- `npm run release:minor`
- `npm run release:major`

`npm run release:forced` remains available as the older patch-release alias. All release scripts depend on `release:tests`, which runs unit tests, Playwright end-to-end tests, and `npx astro check` before `release-it` starts.
