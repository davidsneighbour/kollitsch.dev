// @see https://github.com/lint-staged/lint-staged

export default {
  "package-lock.json": [
    "lockfile-lint --path package-lock.json --validate-https --allowed-hosts npm",
  ],

  "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": [
    "biome check --write --no-errors-on-unmatched",
  ],

  "*.{scss,css}": ["stylelint --fix", "prettier --write"],

  // '*.{png,jpeg,jpg,gif,svg}': [
  //   'imagemin-lint-staged' // @davidsneighbour/imagemin-lint-staged
  // ],

  "!(CHANGELOG)**/*.{md,markdown}": ["markdownlint-cli2", "npm run lint:vale"],

  "layouts/**/*.*": ["./bin/hugo/refactor layouts"],

  "*": ["secretlint"],
};
