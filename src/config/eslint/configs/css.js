import css from '@eslint/css'

export default [
  {
    files: ['**/*.css'],
    language: 'css/css',
    languageOptions: {
      //customSyntax: tailwindSyntax,
      tolerant: true,
    },
    plugins: {
      css,
    },
    rules: {
      'css/no-empty-blocks': 'error',
    },
  },
]
