module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  ignorePatterns: ['dist', 'node_modules'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
    // Additional recommended rules
    'no-console': 'warn',
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'react-hooks/exhaustive-deps': 'warn',
    'no-debugger': 'warn',
    'no-alert': 'warn',
    // Enforce consistent code style
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-trailing-spaces': 'error',
    // Catch common mistakes
    eqeqeq: ['error', 'always'],
    'no-var': 'error',
    'prefer-const': 'warn',
  },
  overrides: [
    {
      files: ['src/context/*.jsx'],
      rules: {
        'react-refresh/only-export-components': 'off',
      },
    },
    // Additional overrides for test files if you have any
    {
      files: ['**/*.test.js', '**/*.test.jsx'],
      env: {
        jest: true,
      },
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
