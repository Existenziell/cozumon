module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:import/recommended',
    'standard',
    'next',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'comma-dangle': 'off',
    'quotes': 'off',
    'space-before-function-paren': 'off',
    'operator-linebreak': ['off'],
    'camelcase': 'off',
  },
  ignorePatterns: ['coverage.json', '/coverage/*', '/test/*'],
}
