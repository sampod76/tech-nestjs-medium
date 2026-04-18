import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  {
    ignores: [
      'dist',
      'eslint.config.mjs',
      'jest.config.js',
      'prisma.config.ts',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettier,

  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      // '@typescript-eslint/no-unsafe-argument': 'warn',
      // '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'off', // ✅ OFF
      '@typescript-eslint/no-unsafe-member-access': 'off', // ✅ OFF
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',

      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
]);
