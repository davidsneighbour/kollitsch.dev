export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      'class-methods-use-this': 'error',
      'default-param-last': 'error',
      'no-useless-constructor': 'error',
    },
  },
];
