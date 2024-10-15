import tailwind from 'eslint-plugin-tailwindcss'

// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
export default withNuxt([
    ...tailwind.configs['flat/recommended'],
    {
        rules: {
            'no-console': 'error',
            'tailwindcss/classnames-order': 'warn',
            'import/no-default-export': 'off',
            'import/named': 'off',
            'import/no-cycle': 'off',
            'vue/no-multiple-template-root': 'off',
            'vue/no-v-html': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
            '@typescript-eslint/no-empty-interface': [
                'error',
                {
                    allowSingleExtends: true,
                },
            ],
            'vue/html-self-closing': [
                'warn',
                {
                    html: {
                        void: 'always',
                        normal: 'always',
                        component: 'always',
                    },
                    svg: 'always',
                    math: 'always',
                },
            ],
            'import/order': [
                'warn',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],
        },
    },
])
