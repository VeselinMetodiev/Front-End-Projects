// eslint-disable-next-line no-undef
module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    rules:{
        "@typescript-eslint/no-non-null-assertion": "off"
    }
  };