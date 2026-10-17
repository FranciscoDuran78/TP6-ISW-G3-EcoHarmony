module.exports = {
  root: true,
  extends: ['airbnb'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: {
    browser: true,
    es2022: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['apps/backend/**/*.js'],
      excludedFiles: ['**/tests/**'],
      extends: ['airbnb-base'],
      env: {
        node: true,
      },
      rules: {
        'import/extensions': ['error', 'ignorePackages', { js: 'always' }],
        'no-console': 'off',
      },
    },
    {
      files: ['apps/backend/tests/**/*.js'],
      extends: ['airbnb-base'],
      env: {
        node: true,
        jest: true,
      },
    },
    {
      files: ['apps/frontend/**/*.jsx'],
      rules: {
        'import/extensions': 'off',
        'react/react-in-jsx-scope': 'off',
      },
    },
    {
      files: ['apps/frontend/vite.config.js'],
      rules: {
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        'import/no-unresolved': 'off',
      },
    },
  ],
};
