# Biome migration notes

## Outstanding TODOs
- [ ] Reformat `.commitlintrc.ts` with Biome to align quotes and object ordering that differ from the previous Prettier output.
- [ ] Normalize `.frontmatter/config/taxonomy/default.json` and `.frontmatter/config/taxonomy/fieldgroups/resources.json` using Biome's formatter.
- [ ] Reformat `.frontmatter/database/mediaDb.json` via Biome to match the new formatter expectations.
- [ ] Decide whether to adopt Biome's `assist/source/useSortedKeys` suggestions in `src/utils/logger.ts` (multiple color maps currently violate the rule).

## Non-migrated usage
- `@astrojs/check` still bundles Prettier and related plugins transitively (e.g., `prettier-plugin-astro`, `volar-service-prettier`) for language-server support; those packages remain present in `package-lock.json`.
- Existing content and generated JSON under `.frontmatter/` currently rely on their historical formatting and have not been rewritten by Biome yet.

## Potential pitfalls and open issues
- Biome does not consume TypeScript configuration directly, so the new `scripts/sync-biome-config.ts` must be run (automatically via `npm run biome:config:sync`) to generate the temporary `biome.json` before invoking any Biome command.
- Enabling Biome's assist actions (sorted keys and import organization) may introduce large diffs in configuration-heavy files; teams should agree on applying those fixes incrementally.
- `lint-staged` now triggers the config sync script before running Biome; ensure local environments allow executing `tsx` during commits.
