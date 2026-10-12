# Dependency updates

Use `ncu -u` to update compatible npm package versions, then run `npm install` to resolve and install the dependency graph. Update Vitest and all installed `@vitest/*` companion packages together because their peer dependencies require matching exact versions.

The repository's `.ncurc.json` excludes `typescript` from automatic updates. Keep TypeScript on major version 6: `@astrojs/check@0.9.10` accepts TypeScript 5 or 6, and does not accept TypeScript 7. Check the Astro checker's peer dependencies before changing this exclusion.

Vitest resolves TypeScript path aliases through Vite's native `resolve.tsconfigPaths` setting. This avoids the extra `vite-tsconfig-paths` plugin and its TypeScript 5-only `tsconfck` peer dependency.

After changing `package.json`, run `npx nanny update-package` to synchronise dependency versions into `src/packages/**/*.jsonc`, then run `npx nanny check` to check scripts, Wireit configuration, and dependency versions. The fragments are the source of truth for package generation.

Run `npm test`, `npx astro check`, and `npm run check:scripts` before committing. Keep unfixable security findings tracked in open GitHub issues labelled `prio:high`.
