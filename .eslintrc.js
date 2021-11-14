// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn'
  },
  reportUnusedDisableDirectives: true
}
