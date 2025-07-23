import importPlugin from 'eslint-plugin-import';

export default [
  importPlugin.flatConfigs.recommended,
  {
    name: 'dnb/import-rules',
    rules: {
      // Optional: disallow importing utils deeply if barrel import exists
      'import/no-internal-modules': [
        'warn',
        {
          allow: ['@utils/**'],
        },
      ],
      // Disallow deep relative imports when alias is available
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '../utils/*',
            '../../utils/*',
            {
              group: ['./src/utils/*'],
              message: 'Use @utils/* alias instead of relative path.',
            },
          ],
        },
      ],
      // Warn unused imports
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];
