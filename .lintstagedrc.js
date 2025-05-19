// @see https://github.com/lint-staged/lint-staged
export default {
  'package-lock.json': [
    'lockfile-lint --path package-lock.json --validate-https --allowed-hosts npm',
  ],

  '*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}': [
    'biome check --write --no-errors-on-unmatched',
  ],

  '*.{scss,css}': ['stylelint --fix', 'prettier --write'],

  // 'layouts/**/*.*': [
  //   './bin/hugo/refactor layouts'
  // ],

  // '*.jsonnet': ['jsonnetfmt --in-place'],

  '!(CHANGELOG)**/*.{md,markdown}': [
    'markdownlint-cli2 --config "ci/.markdownlint.json"',
    'vale --config="ci/vale/vale.ini" --no-exit',
    'lychee --no-progress --config ci/lychee/lychee.toml --require-https --format detailed --mode color -vv',
    'typos --config ci/typos.toml',
  ],

  '*': ['secretlint --secretlintrc ci/.secretlintrc.json'],
};
