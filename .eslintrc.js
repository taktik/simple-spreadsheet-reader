module.exports = {
    env: {
        node: true,
        es6: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
    },
    plugins: [
        '@typescript-eslint'
    ],
    rules: {
        'no-var': 'error',
        'no-console': [
            'warn',
            {
                allow: ['warn', 'error', 'time', 'timeEnd'],
            },
        ],
        'no-duplicate-imports': 'warn',
        eqeqeq: 'error',
        'no-shadow': 'warn',
        'prefer-const': 'warn',
        '@typescript-eslint/no-useless-constructor': 'warn',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/member-delimiter-style': 'off',
        // Disabling the below rules improves performance
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#eslint-plugin-import
        'import/named': 'off',
        'import/namespace': 'off',
        'import/default': 'off',
        'import/no-named-as-default-member': 'off',
    },
    reportUnusedDisableDirectives: true,
}
