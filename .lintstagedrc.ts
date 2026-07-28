/**
 * @see https://github.com/lint-staged/lint-staged
 * @type {import('lint-staged').Configuration}
 */
const shellQuote = (value: string) => JSON.stringify(value);

const lychee = (files: string[]) => {
  const contentFiles = files.filter((file) => file.includes('/src/content/'));

  if (contentFiles.length === 0) return [];

  return [
    '/home/linuxbrew/.linuxbrew/bin/lychee --no-progress',
    ...contentFiles.map(shellQuote),
  ].join(' ');
};

export default {
  // Audit when settings.json is staged (VS Code or an extension wrote to it
  // directly). Exit 3 if the file has keys/values not in base or local — the
  // developer must carry those back to the right source file before committing.
  '.vscode/settings.json': () =>
    'node src/scripts/maintenance/vscode/merge-vscode-config.ts --audit',

  // Audit when either source file is staged: catches "source edited but
  // vscode:sync not re-run" — settings.json would be out of date.
  '.vscode/settings.{base,local}.jsonc': () =>
    'node src/scripts/maintenance/vscode/merge-vscode-config.ts --audit',

  '!(CHANGELOG)**/*.{md,markdown}': [
    'markdownlint-cli2 --config "src/config/.markdownlint.jsonc"',
    'vale --config src/config/.vale.ini --no-exit --minAlertLevel=error',
    lychee,
    'typos --config src/config/typos.toml',
  ],

  // Fetches (and stages) local poster images for any YouTube video ids
  // referenced in staged blog content, so a new/edited post never ships
  // without a local thumbnail. Already-downloaded thumbnails are skipped —
  // see src/scripts/content/fetch-youtube-thumbnails.ts.
  'src/content/blog/**/*.{md,mdx}': () => [
    'node src/scripts/content/fetch-youtube-thumbnails.ts',
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
