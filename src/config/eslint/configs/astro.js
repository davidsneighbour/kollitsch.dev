import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import astro from 'eslint-plugin-astro';
import { defineConfig } from 'eslint/config';

export default [
  {
    files: ['**/*.astro'],
    plugins: {
      astro,
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: astro.parser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro'],
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    rules: {
      'astro/no-unused-vars': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'never',
          objectLiteralTypeAssertions: 'never',
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "VariableDeclarator > TSAsExpression[right.object.name='Astro'][right.property.name='props']",
          message:
            'Use `: Props` type annotation instead of `as Props` on Astro.props.',
        },
        {
          selector:
            "VariableDeclarator[init.object.name='Astro'][init.property.name='props']:not(:has(:matches(:has(TypeAnnotation), TSAsExpression)))",
          message:
            'Destructured Astro.props must include a type annotation like `: Props`.',
        },
      ],
    },
  },
];
