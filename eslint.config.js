import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        Buffer: 'readonly',
        NodeJS: 'readonly'
      }
    },
    rules: {
      // The codebase interfaces with untyped JSON APIs and discord.js' dynamic
      // builder methods, where `any` is deliberate rather than accidental.
      '@typescript-eslint/no-explicit-any': 'off',
      // Abstract methods declare their full signature for subclasses to override.
      '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
      'quotes': [
        'error',
        'single'
      ],
      'indent': [
        'error',
        2,
        {
          'SwitchCase': 1
        }
      ],
      'no-var': 'error',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-new-object': 'error',
      'no-whitespace-before-property': 'error',
      'no-trailing-spaces': 'error',
      'no-constructor-return': 'error',
      'no-new-func': 'error',
      'no-return-assign': ['error', 'always'],
      'one-var-declaration-per-line': ['error', 'always'],
      'wrap-iife': ['error', 'inside'],
      'eqeqeq': ['error', 'always'],
      'yoda': ['error', 'never'],
      'default-case-last': 'error',
      'default-param-last': 'error',
      'new-parens': 'error',
      'comma-style': ['error', 'last'],
      'spaced-comment': ['error', 'always'],
      'no-self-compare': 'error',
      'no-new-wrappers': 'error',
      'no-caller': 'error',
      'func-call-spacing': ['error', 'never'],
      'comma-dangle': ['error', 'never'],
      'prefer-rest-params': 'error',
      'prefer-const': 'error',
      'dot-location': ['error', 'property'],
      'space-in-parens': ['error', 'never'],
      'keyword-spacing': 'error',
      'arrow-spacing': [
        'error',
        {
          'before': true,
          'after': true
        }
      ],
      'key-spacing': [
        'error',
        {
          'afterColon': true,
          'beforeColon': false,
          'mode': 'minimum'
        }
      ],
      'space-before-function-paren': [
        'error',
        {
          'anonymous': 'always',
          'asyncArrow': 'always',
          'named': 'never'
        }
      ],
      'brace-style': [
        'error',
        '1tbs',
        {
          'allowSingleLine': true
        }
      ],
      'switch-colon-spacing': [
        'error',
        {
          'before': false,
          'after': true
        }
      ],
      'comma-spacing': [
        'error',
        {
          'before': false,
          'after': true
        }
      ],
      'object-curly-spacing': [
        'error',
        'always',
        {
          'arraysInObjects': true,
          'objectsInObjects': true
        }
      ],
      'linebreak-style': ['error', 'unix'],
      'semi-style': ['error', 'last'],
      'semi': ['error', 'always']
    }
  },
  {
    // Declaration merging requires repeating type parameters that are not used here.
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off'
    }
  },
  {
    // These imports exist so that eval'd code can reach them in module scope.
    files: ['src/commands/owner/eval.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off'
    }
  }
);
