module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
    browser: true
  },
  extends: [
    'sanity',
    'sanity/typescript',
    'sanity/react',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    'no-use-before-define': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'import/no-extraneous-dependencies': 'off', // because of parts
    'sort-imports': 'off', // prefer import/order,
    'react/require-default-props': 'off',
    'react/prop-types': 'off',
    'react/jsx-no-bind': 'off',
    'react/forbid-prop-types': [0]
  },
  plugins: ['prettier', 'react'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off'
      }
    }
  ]
}
