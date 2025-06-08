import { defineConfig } from 'eslint/config';
import html from '@html-eslint/eslint-plugin';

export default [
  {
    files: ['**/*.html'],
    plugins: {
      html,
    },
    language: 'html/html',
    languageOptions: {
      templateEngineSyntax: {
        '{{': '}}',
        '{{-': '-}}',
      },
    },
    // see https://html-eslint.org/docs/rules
    rules: {
      'html/no-duplicate-class': 'error',
    },
  },
  {
    files: ['**/*.js', '**/*.ts'],
    plugins: {
      html,
    },
    rules: {
      'html/require-img-alt': 'error',
    },
  },
];
