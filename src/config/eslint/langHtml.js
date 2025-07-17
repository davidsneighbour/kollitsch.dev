import html from '@html-eslint/eslint-plugin';

export default [
  {
    files: ['**/*.html'],
    language: 'html/html',
    languageOptions: {
      templateEngineSyntax: {
        '{{': '}}',
        '{{-': '-}}',
      },
    },
    name: 'dnb/html',
    plugins: {
      html,
    },
    // see https://html-eslint.org/docs/rules
    rules: {
      'html/no-duplicate-class': 'error',
    },
  },
  {
    files: ['**/*.js', '**/*.ts'],
    name: 'dnb/html-js',
    plugins: {
      html,
    },
    rules: {
      'html/require-img-alt': 'error',
    },
  },
];
