import { fileURLToPath } from 'node:url';
import path from 'path';
import conartiFeatureSliced from '@conarti/eslint-plugin-feature-sliced';
import { FlatCompat } from '@eslint/eslintrc';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  ...compat.extends('plugin:@conarti/feature-sliced/recommended'),

  {
    ignores: ['dist', 'reports', 'vite.config.ts', 'eslint.config.js', '*.test.ts', '*.test.tsx'],
  },
  {
    settings: {
      react: { version: 'detect' },
      storybook: { version: 'detect' },
    },
  },
  {
    extends: [...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react': react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@conarti/feature-sliced': conartiFeatureSliced,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/prop-types': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'all',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'warn',
      'prefer-const': 'warn',
      'eqeqeq': 'error',
      'react/display-name': 'off',
      //FSD
      'import/order': 'warn',
      '@conarti/feature-sliced/layers-slices': 'error',
      '@conarti/feature-sliced/absolute-relative': 'error',
    },
  },
  {
    files: ['**/styled*.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  }
);
