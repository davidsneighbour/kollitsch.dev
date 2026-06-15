/**
 * @see https://github.com/lint-staged/lint-staged
 * @type {import('lint-staged').Configuration}
 */
export default {
  // Audit when settings.json is staged (VS Code or an extension wrote to it
  // directly). Exit 3 if the file has keys/values not in base or local — the
  // developer must carry those back to the right source file before committing.
  '.vscode/settings.json': () =>
    'node src/scripts/vscode/merge-vscode-config.ts --audit',

  // Audit when either source file is staged: catches "source edited but
  // vscode:sync not re-run" — settings.json would be out of date.
  '.vscode/settings.{base,local}.jsonc': () =>
    'node src/scripts/vscode/merge-vscode-config.ts --audit',

  '!(CHANGELOG)**/*.{md,markdown}': [
    'markdownlint-cli2 --config "src/config/.markdownlint.jsonc"',
    'vale --config src/config/.vale.ini --no-exit --minAlertLevel=error',
    'lychee --no-progress',
    'typos --config src/config/typos.toml',
  ],

  '*': [
    'secretlint --no-glob --secretlintrc src/config/secretlint/.secretlintrc.json --secretlintignore src/config/secretlint/.secretlintignore',
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

  "*.{png,jpeg,jpg,gif,svg}": ["imagemin-lint-staged"]

};
