/** @type {import('tailwindcss').Config} */
export default {
    content: ['./components/**/*.{js,vue,ts}', './layouts/**/*.vue', './pages/**/*.vue', './plugins/**/*.{js,ts}', './app.vue', './error.vue'],
    theme: {
        extend: {
            colors: {
                binance: 'var(--main-bg)',
                primary: '#FCD535',
                'primary-hover': '#CFAF35',
                'primary-active': ' #C5991A',
                'gray-hover': '#5E6673',
                'main-gray': '#2B3139',
                'focused-input': '#F0B90B',
                'dark-gray': '#1E2329',
                'input-border': '#474D57',
            },
        },
    },
    plugins: [],
}
