/**
 * @see https://prettier.io/docs/configuration
 */
/**
 * The vscode extension for prettier does not support typescript config files.
 *
 * @type {import("prettier").Config}
 */
const config = {
	printWidth: 100,
	tabWidth: 2,
	useTabs: false,
	semi: true,
	singleQuote: true,
	quoteProps: "as-needed",
	trailingComma: "es5",
	bracketSpacing: true,
	arrowParens: "avoid",
	endOfLine: "lf",
	plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
	overrides: [
		{
			files: "*.html",
			options: {
				singleQuote: false,
			},
		},
		{
			files: "*.astro",
			options: {
				parser: "astro",
			},
		},
	],
};

export default config;
