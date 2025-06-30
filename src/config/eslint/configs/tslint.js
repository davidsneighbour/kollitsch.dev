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
      // https://eslint.org/docs/latest/rules/no-duplicate-imports#allowseparatetypeimports
      'no-duplicate-imports': ['error', { allowSeparateTypeImports: true }],
    },
  },
];
