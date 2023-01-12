module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['svelte3', '@typescript-eslint', 'prettier'],
  ignorePatterns: ['*.cjs', '**/*.css', '**/*.scss'],
  overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
  settings: {
    'svelte3/typescript': true,
  },
  rules: {
    quotes: [2, 'single', { avoidEscape: true }],
    indent: ['error', 2],
    'max-len': [2, { code: 80, ignorePattern: '^import\\W.*' }],
    // 'max-len': ['error', { code: 80 }],
    'no-console': 0,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  env: {
    browser: true,
    node: true,
  },
};
