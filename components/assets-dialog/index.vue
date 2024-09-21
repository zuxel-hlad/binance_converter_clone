<template>
    <div class="size-full overflow-hidden rounded-xl border border-input-border bg-dark-gray pb-6 md:h-[512px] md:w-[520px]" @click.stop>
        <div class="flex items-end justify-between gap-3 px-6 py-[18px]">
            <h3 class="text-xl font-semibold text-white">Select token</h3>
            <button type="button"><x-mark-icon class="size-6 text-white" @click="$emit('close-dialog', false)" /></button>
        </div>
        <div class="relative h-14 px-6 py-2" tabindex="0">
            <magnifying-glass-icon class="absolute left-9 top-1/2 size-5 -translate-y-1/2 text-gray-hover" />
            <input
                :value="searchValue"
                type="text"
                class="size-full rounded-lg border border-input-border bg-transparent pl-9 pr-3 text-sm font-medium text-white caret-focused-input outline-none transition-colors placeholder:text-gray-hover hover:border-focused-input"
                placeholder="Search"
                @input="onSearch"
            />
        </div>
        <perfect-scrollbar>
            <div class="ml-[-12px] overflow-y-auto px-6 py-2">
                <span v-if="searchValue.length && !searchedAssets.length" class="block w-full text-center text-gray-hover">Assets not found</span>
                <span v-if="!searchValue.length && !searchedAssets.length" class="block w-full text-center text-gray-hover">No assets now.</span>
                <div v-for="(asset, idx) in searchedAssets" :key="idx" class="flex cursor-pointer items-center rounded-lg px-3 py-2 transition-colors hover:bg-black">
                    <icon-crypto :coinname="asset.assetName" format="svg" class="mr-[10px] size-5 shrink-0" />
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
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

import type { IAssetsDialogProps } from './assets-dialog.props'
import type { IAsset } from '~/types/assets'
const props = defineProps<IAssetsDialogProps>()
defineEmits<{ (e: 'close-dialog', value: boolean): void }>()

const searchValue = ref<string>('')

const onSearch = (e: Event): void => {
    const eventTargetValue = (e.target as HTMLInputElement).value
    setTimeout(() => (searchValue.value = eventTargetValue), 100)
}

const searchedAssets = computed<IAsset[]>(() =>
    props.assets.filter(
        ({ assetName, assetFullName }) => assetName.toLowerCase().includes(searchValue.value.toLowerCase()) || assetFullName.toLowerCase().includes(searchValue.value),
    ),
)
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
