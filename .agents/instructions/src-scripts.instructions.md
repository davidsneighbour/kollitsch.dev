---
applyTo: "src/scripts/**"
---

# Scripts

Scripts are ESM TypeScript run directly with `node <file>.ts` (native type stripping, see `engines` in `package.json`). `src/scripts/` is excluded from `tsconfig.json`, so it is not type-checked by `astro check`.

CLI scripts should:

- expose configurable options rather than hard-coding values;
- validate their input;
- report errors clearly;
- exit non-zero on failure;
- avoid silent failure;
- avoid destructive behaviour unless explicitly requested.
