import json from '@eslint/json'

export default [
  {
    plugins: {
      json,
    },
  },
  {
    files: ['**/*.json'],
    ignores: ['package-lock.json'],
    language: 'json/json',
    name: 'dnb/json',
    ...json.configs.recommended,
  },
  {
    files: ['**/*.jsonc', '.vscode/*.json'],
    language: 'json/jsonc',
    name: 'dnb/jsonc',
    ...json.configs.recommended,
  },
  {
    files: ['**/*.json5'],
    language: 'json/json5',
    name: 'dnb/json5',
    ...json.configs.recommended,
  },
]
