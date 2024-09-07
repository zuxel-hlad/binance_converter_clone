<template>
    <div class="flex flex-col gap-4 rounded-xl border border-main-gray p-4 outline-none transition-colors hover:border-gray-hover focus:border-focused-input" tabindex="0">
        <div class="flex items-center justify-between gap-3">
            <span class="text-white">From</span>
            <span class="text-white">Balance:&nbsp;--&nbsp;USDT</span>
        </div>
        <div class="flex items-center justify-between">
            <div class="flex w-1/2 flex-col">
                <input
                    v-model="inputValue"
                    type="number"
                    autocomplete="off"
                    placeholder="0.01 - 2500000"
                    class="border-none bg-transparent text-xl font-medium text-white outline-none placeholder:text-gray-hover"
                    tabindex="-1"
                />
                <span class="text-xs font-normal text-gray-hover">${{ inputValue ? inputValue : '0.00' }}</span>
            </div>
            <button type="button" class="flex w-1/2 items-center justify-end [&>svg]:hover:text-white" tabindex="-1" @click="$emit('select-token')">
                <crypto-icon symbol="usdc" size="24" class="mr-[6px]" />
                <span class="text-base font-medium text-white">USDT</span>
                <chevron-down-icon class="ml-2 size-5 shrink-0 text-gray-hover transition-colors" />
            </button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
const inputValue = defineModel<string | number>()
defineEmits<{ (e: 'select-token'): void }>()
</script>
