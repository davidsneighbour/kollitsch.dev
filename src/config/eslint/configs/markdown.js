import markdown from '@eslint/markdown'

export default [
  // @ts-ignore
  ...markdown.configs.recommended,
  {
    files: ['**/*.md'],
    language: 'markdown/commonmark',
    name: 'dnb/markdown',
    plugins: {
      markdown,
    },
    rules: {
      'markdown/no-html': 'error',
    },
  },
]
