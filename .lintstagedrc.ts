/**
 * @see https://github.com/lint-staged/lint-staged
 * @type {import('lint-staged').Configuration}
 */
export default {
  '!(CHANGELOG)**/*.{md,markdown}': [
    'markdownlint-cli2 --config "src/config/.markdownlint.jsonc"',
    'vale --no-exit --minAlertLevel=error',
    'lychee --no-progress --config src/config/lychee.toml --require-https --format detailed --mode color -vv',
    'typos --config src/config/typos.toml',
  ],

  '*': [
    'secretlint --secretlintrc src/config/secretlint/.secretlintrc.json --secretlintignore src/config/secretlint/.secretlintignore',
    'npm run lint:filenames',
  ],

  '*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}': [
    'biome check --write --no-errors-on-unmatched',
  ],

  '*.{scss,css}': [
    'stylelint --fix --config src/config/stylelint/index.js --color --report-descriptionless-disables --report-invalid-scope-disables --report-needless-disables --ignore-path src/config/stylelint/.stylelintignore ',
  ],

  '*.astro': [
    'npx astro check --minimumFailingSeverity=error --minimumSeverity=error',
  ],

  '*.jsonnet': ['jsonnetfmt --in-place'],

  '*.y(aml|ml)': ['yamllint --config-file ./src/config/yamllint.yaml'],
};
