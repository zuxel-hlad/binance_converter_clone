<template>
    <div class="size-full overflow-hidden rounded-xl border border-input-border bg-dark-gray pb-6 md:h-[512px] md:w-[520px]" @click.stop>
        <div class="flex items-end justify-between gap-3 px-6 py-[18px]">
            <h3 class="text-xl font-semibold text-white">Select token</h3>
            <button type="button"><x-mark-icon class="size-6 text-white" @click="emit('close-dialog')" /></button>
        </div>
        <div class="relative h-14 px-6 py-2">
            <magnifying-glass-icon class="absolute left-9 top-1/2 size-5 -translate-y-1/2 text-gray-hover" />
            <input
                v-model="searchValue"
                type="text"
                class="size-full rounded-lg border border-input-border bg-transparent pl-9 pr-3 text-sm font-medium text-white caret-focused-input outline-none transition-colors placeholder:text-gray-hover hover:border-focused-input"
                placeholder="Search"
                tabindex="0"
            />
        </div>
        <perfect-scrollbar>
            <div class="ml-[-12px] overflow-y-auto px-6 py-2">
                <span v-if="searchValue.length && !searchedAssets.length" class="block w-full text-center text-gray-hover">Assets not found.</span>
                <span v-if="!searchValue.length && !searchedAssets.length" class="block w-full text-center text-gray-hover">No assets now.</span>
                <div
                    v-for="(asset, idx) in searchedAssets"
                    :key="idx"
                    class="flex cursor-pointer items-center rounded-lg px-3 py-2 transition-colors hover:bg-black"
                    @click="emit('on-asset-selected', asset.assetName)"
                >
                    <div
                        v-if="binanceCryptoIcons.has(asset.assetName.toLocaleLowerCase())"
                        class="mr-[10px] shrink-0 [&>svg]:size-5"
                        v-html="binanceCryptoIcons.get(asset.assetName.toLocaleLowerCase())"
                    />
                    <div v-else class="mr-[10px] size-5 shrink-0 rounded-full bg-gray-200">
                        <img src="~/assets/icons/binance_icon.svg" :alt="asset.assetFullName" />
                    </div>
                    <div class="mr-[10px] flex grow flex-col">
                        <span class="text-sm font-medium uppercase text-white">{{ asset.assetName }}</span>
                        <span class="text-gray-hover">{{ asset.assetFullName }}</span>
                    </div>
                    <star-icon class="size-5 text-sm font-normal text-gray-hover" />
                </div>
            </div>
        </perfect-scrollbar>
    </div>
</template>
<script setup lang="ts">
import { XMarkIcon, MagnifyingGlassIcon, StarIcon } from '@heroicons/vue/24/solid'
import { binanceCryptoIcons } from 'binance-icons'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

import type { IAssetsDialogProps } from './assets-dialog.props'
import type { IAsset } from '~/types/assets'

const props = defineProps<IAssetsDialogProps>()
const emit = defineEmits<{ (e: 'close-dialog'): void; (e: 'on-asset-selected', value: string): void }>()

const searchValue = ref<string>('')

const searchedAssets = computed<IAsset[]>(() => {
    const assets = [...props.assets]
    if (assets && assets.length) {
        return assets.filter(
            ({ assetName, assetFullName }) => assetName.toLowerCase().includes(searchValue.value.toLowerCase()) || assetFullName.toLowerCase().includes(searchValue.value),
        )
    }
    return []
})
</script>
<style lang="css">
.ps {
    max-height: calc(100% - 118px);
}

.ps__thumb-y {
    min-height: 14px;
}

.ps .ps__rail-y {
    background-color: transparent;
}

.ps .ps__rail-y.ps--clicking {
    background-color: transparent;
}

.ps .ps__rail-y:hover {
    background-color: transparent;
}
</style>
