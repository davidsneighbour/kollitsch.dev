module.exports = {
	root: true,
	plugins: [
		'@typescript-eslint',
		'anti-trojan-source',
		'html',
		'no-loops',
		'sonarjs',
		// https://github.com/sindresorhus/eslint-plugin-unicorn
		'unicorn',
		'github',
	],
	ignorePatterns: ['**/node_modules/*', '**/vendor/*', '**/.git/*', '**/package.json'],
	settings: {
		'html/html-extensions': ['.html', '.htm'],
		'html/xml-extensions': ['.xml'],
		'html/indent': '0',
		'html/report-bad-indent': 'error',
	},
	// https://eslint.org/docs/user-guide/configuring/language-options
	env: {
		browser: true,
		es2022: true,
	},
	extends: [
		'airbnb-base',
		'plugin:compat/recommended',
		'plugin:markdown/recommended',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:sonarjs/recommended',
		'plugin:github/internal',
		'plugin:github/browser',
		'plugin:github/recommended',
		'plugin:github/typescript',
	],
	rules: {
		'anti-trojan-source/no-bidi': 'error',
		'no-loops/no-loops': 'error',
		'@typescript-eslint/indent': ['error', 2],
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/no-explicit-any': 'error',
		'@typescript-eslint/ban-ts-comment': 0,
		'import/no-unresolved': 'off',
		'@typescript-eslint/no-var-requires': 'off',
	},
	overrides: [
		{
			files: ['**/*.md'],
			processor: 'markdown/markdown',
		},
		{
			// configuration for ```js fenced code blocks inside .md files.
			files: ['**/*.md/*.js'],
			rules: {
				'no-console': 'off',
				'import/no-unresolved': 'off',
			},
		},
	],
};
