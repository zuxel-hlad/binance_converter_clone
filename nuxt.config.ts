export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },
    modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss', '@nuxt/fonts', 'vue3-perfect-scrollbar/nuxt'],
    plugins: ['~/plugins/vue-cryptoicon.ts'],
    vite: {
        vue: {
            template: {
                compilerOptions: {
                    isCustomElement: (tag: string) => ['IconCrypto'].includes(tag),
                },
            },
        },
    },
    css: ['~/assets/css/global.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    fonts: {
        families: [{ name: 'IBM Plex Sans', provider: 'google', weights: [400, 500, 600] }],
    },
})
