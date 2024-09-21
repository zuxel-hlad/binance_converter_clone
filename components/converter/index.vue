<template>
    <div class="w-full max-w-[432px]">
        <app-input v-model.number="token" badge="from" @select-token="isSelectTokenModalShow = true" />
        <button type="button" class="flex w-full items-center justify-center bg-transparent py-4 text-gray-hover transition-colors hover:text-white" tabindex="-1">
            <svg class="size-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 3h3v18.5l-7-7h4V3zM16.5 21h-3V2.5l7 7h-4V21z" fill="currentColor" />
            </svg>
        </button>
        <app-input v-model.number="token" class="mb-6" badge="to" @select-token="isSelectTokenModalShow = true" />
        <app-button disabled type="button" class="h-12 w-full truncate" tabindex="-1">Enter Amount</app-button>
    </div>
    <app-modal v-model="isSelectTokenModalShow">
        <assets-dialog :assets="marginAssets ?? []" @close-dialog="isSelectTokenModalShow = false" />
    </app-modal>
</template>

<script setup lang="ts">
import assetsDialog from '~/components/assets-dialog/index.vue'
import { appButton, appInput, appModal } from '~/components/UI'
import { getAllAssets } from '~/lib/api'

const isSelectTokenModalShow = ref<boolean>(false)
const token = ref<number | undefined>()

const { data: marginAssets } = await useAsyncData('margin-assets', getAllAssets)
</script>
