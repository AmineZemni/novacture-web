module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    // Disable the rule requiring descriptions for @ts-expect-error
    '@typescript-eslint/ban-ts-comment': 'off',
    // Allow the use of `any` type
    '@typescript-eslint/no-explicit-any': 'off',
    // Set no-unused-vars to warn instead of error
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn', // Use this if you are using TypeScript

    'prettier/prettier': 'error' // Prettier errors as ESLint errors
  }
}
