// @see https://github.com/lint-staged/lint-staged

export default {

  "package-lock.json": [
    "lockfile-lint --path package-lock.json --validate-https --allowed-hosts npm",
  ],

  "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": [
    "biome check --files-ignore-unknown=true", // Check formatting and lint
    "biome check --write --no-errors-on-unmatched", // Format, sort imports, lint, and apply safe fixes
    "biome check --write --organize-imports-enabled=false --no-errors-on-unmatched", // format and apply safe fixes
    "biome check --write --unsafe --no-errors-on-unmatched", // Format, sort imports, lints, apply safe/unsafe fixes
    "biome format --write --no-errors-on-unmatched", // Format
    "biome lint --write --no-errors-on-unmatched", // Lint and apply safe fixes
  ],

  "*.{scss,css}": [
    "stylelint --fix",
    "prettier --write",
  ],

  // '*.{png,jpeg,jpg,gif,svg}': [
  //   'imagemin-lint-staged' // @davidsneighbour/imagemin-lint-staged
  // ],

  "!(CHANGELOG)**/*.{md,markdown}": [
    "markdownlint-cli2",
    "npm run lint:vale",
  ],

  "layouts/**/*.*": [
    "./bin/hugo/refactor layouts",
  ],

  "*": [
    "secretlint",
  ],

};
