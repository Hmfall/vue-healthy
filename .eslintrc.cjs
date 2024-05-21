module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:eslint-plugin-import/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    curly: ['error', 'all'],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn',
    'prettier/prettier': 'warn',
    'import/order': [
      'error',
      {
        pathGroups: [
          { pattern: 'vue', group: 'builtin' },
          { pattern: 'vite', group: 'builtin', position: 'after' },
          { pattern: '@/plugins/**', group: 'internal', position: 'after' },
          { pattern: '@/store/**', group: 'internal', position: 'after' },
          { pattern: '@/pages/**', group: 'internal', position: 'after' },
          { pattern: '@/components/**', group: 'internal', position: 'after' },
          { pattern: '@/shared/**', group: 'internal', position: 'after' },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
        'newlines-between': 'never',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
  overrides: [
    {
      files: ['./src/**/*.ts', './src/**/*.vue'],
      extends: ['plugin:vue/vue3-recommended'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
        project: './tsconfig.json',
        extraFileExtensions: ['.vue'],
      },
      plugins: ['@typescript-eslint/eslint-plugin', 'vue'],
      rules: {
        'vue/attributes-order': 'error',
        'vue/valid-template-root': 'warn',
        'vue/prefer-true-attribute-shorthand': 'error',
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'vue/html-indent': ['warn', 2],
        'vue/v-slot-style': 'off',
        'vue/no-unused-vars': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/no-reserved-component-names': 'off',
        'vue/singleline-html-element-content-newline': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
