// @see https://github.com/okonet/lint-staged

import { ESLint } from 'eslint'

const removeIgnoredFiles = async (files) => {
	const eslint = new ESLint()
	const isIgnored = await Promise.all(
		files.map((file) => {
			return eslint.isPathIgnored(file)
		})
	)
	const filteredFiles = files.filter((_, i) => !isIgnored[i])
	return filteredFiles.join(' ')
}

export default {
	'package-lock.json': "lockfile-lint --path package-lock.json --validate-https",
	'*.{ts,tsx,(m|c)js,jsx}': async (files) => {
		const filesToLint = await removeIgnoredFiles(files)
		return [`eslint --max-warnings=0 ${filesToLint}`]
	},
	"*.{scss,css}": "stylelint --fix",
	"*.{png,jpeg,jpg,gif,svg}": "imagemin-lint-staged",
	"*.{js,jsx}": "flow focus-check",
	"!(CHANGELOG)**/*.{md,markdown}": ["vale"],
	'**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit',
	//'**/*.js?(x)': (filenames) => filenames.map((filename) => `prettier --write '${filename}'`),
}
