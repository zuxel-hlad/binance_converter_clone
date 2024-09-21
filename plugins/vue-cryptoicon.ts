import IconCrypto from 'vue-cryptocurrency-icons/src/components/IconCrypto'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('IconCrypto', IconCrypto)
})
