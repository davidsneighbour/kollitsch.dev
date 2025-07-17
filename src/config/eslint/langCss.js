import css from '@eslint/css';

export default [
  {
    files: ['**/*.css'],
    language: 'css/css',
    languageOptions: {
      //customSyntax: tailwindSyntax,
      tolerant: true,
    },
    name: 'dnb/css',
    plugins: {
      css,
    },
    rules: {
      'css/no-empty-blocks': 'error',
    },
  },
];
