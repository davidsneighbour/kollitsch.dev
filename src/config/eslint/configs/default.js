import fs from 'node:fs';
import globals from 'globals';
import stylisticJs from '@stylistic/eslint-plugin';

const INDENT_SIZE = 2,
  path = './tsconfig.eslint.json';

let projectPath = '';
if (fs.existsSync(path)) {
  projectPath = path;
}

export default [
  {
    name: 'dnb/default',
    languageOptions: {
      globals: Object.fromEntries(
        Object.entries(globals.browser).map(([key, value]) => [
          key.trim(),
          value,
        ]),
      ),
      parserOptions: {
        extraFileExtensions: ['json'],
        impliedStrict: true,
        project: projectPath,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/indent': ['error', INDENT_SIZE],
    },
  },
];
