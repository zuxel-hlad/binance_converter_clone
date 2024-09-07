<template>
    <div class="size-full overflow-hidden rounded-xl border border-input-border bg-dark-gray pb-6 md:h-[512px] md:w-[520px]" @click.stop>
        <div class="flex items-end justify-between gap-3 px-6 py-[18px]">
            <h3 class="text-xl font-semibold text-white">Select token</h3>
            <button type="button"><x-mark-icon class="size-6 text-white" @click="$emit('close-dialog', false)" /></button>
        </div>
        <div class="relative h-14 px-6 py-2" tabindex="0">
            <magnifying-glass-icon class="absolute left-9 top-1/2 size-5 -translate-y-1/2 text-gray-hover" />
            <input
                type="text"
                class="size-full rounded-lg border border-input-border bg-transparent pl-9 pr-3 text-sm font-medium text-white caret-focused-input outline-none transition-colors placeholder:text-gray-hover hover:border-focused-input"
                placeholder="Search"
            />
        </div>
        <perfect-scrollbar>
            <div class="ml-[-12px] overflow-y-auto px-6 py-2">
                <div v-for="item in 1222" :key="item" class="flex cursor-pointer items-center rounded-lg px-3 py-2 transition-colors hover:bg-black">
                    <crypto-icon symbol="usdc" size="24" class="mr-[10px]" />
                    <div class="mr-[10px] flex grow flex-col">
                        <span class="text-sm font-medium uppercase text-white">usdc</span>
                        <span class="text-gray-hover">Cool Token</span>
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
defineEmits<{ (e: 'close-dialog', value: boolean): void }>()
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
