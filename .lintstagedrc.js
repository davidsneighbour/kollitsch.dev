// @see https://github.com/lint-staged/lint-staged
export default {
	"*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": [
		"biome check --write --no-errors-on-unmatched",
	],

	"*.{scss,css}": ["stylelint --fix", "prettier --write"],

	// 'layouts/**/*.*': [
	//   './bin/hugo/refactor layouts'
	// ],

	// '*.jsonnet': ['jsonnetfmt --in-place'],

	"!(CHANGELOG)**/*.{md,markdown}": [
		'markdownlint-cli2 --config "src/config/.markdownlint.json"',
		'vale --config="src/config/vale/vale.ini" --no-exit',
		"lychee --no-progress --config src/config/lychee.toml --require-https --format detailed --mode color -vv",
		"typos --config src/config/typos.toml",
	],

	// "*": ["secretlint --secretlintrc src/config/.secretlintrc.json"],
};
