<template>
    <div class="flex flex-col gap-4 rounded-xl border border-main-gray p-4 transition-colors hover:border-gray-hover" :class="{ '!border-focused-input': isInputFocused }">
        <div class="flex items-center justify-between gap-3">
            <span class="capitalize text-white">{{ badge ?? '-' }}</span>
            <span class="text-white">Balance:&nbsp;--&nbsp;USDT</span>
        </div>
        <div class="flex w-full items-center justify-between">
            <div class="relative flex w-full flex-col">
                <input
                    :value="modelValue"
                    autocomplete="off"
                    placeholder="0.01 - 2500000"
                    class="h-7 w-full border-none bg-transparent text-xl font-medium text-white outline-none placeholder:text-gray-hover"
                    @input="onInput"
                    @keypress="onInvalidKey"
                    @focus="isInputFocused = true"
                    @blur="isInputFocused = false"
                />
                <span class="text-xs font-normal text-gray-hover">&#8776;&nbsp;${{ modelValue ? modelValue : '0.00' }}</span>
            </div>
            <button type="button" class="flex w-max shrink-0 items-center justify-end [&>svg]:hover:text-white" tabindex="-1" @click="emit('select-token')">
                <icon-crypto coinname="ETH" format="svg" class="mr-[10px] size-5 shrink-0" />
                <span class="text-base font-medium text-white">USDT</span>
                <chevron-down-icon class="ml-2 size-5 shrink-0 text-gray-hover transition-colors" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

import type { IAppInputProps } from './app-input.props'

const isInputFocused = ref<boolean>(false)
defineProps<IAppInputProps>()
const emit = defineEmits<{ (e: 'select-token'): void; (e: 'update:modelValue', value: number): void }>()

const onInput = (e: Event) => {
    const eventTargetValue = (e.target as HTMLInputElement).value
    emit('update:modelValue', Number(eventTargetValue))
}

const onInvalidKey = (e: Event) => {
    const pattern = /[^0-9.]/
    const eventKey = (e as KeyboardEvent).key
    const eventTargetValue = (e.target as HTMLInputElement).value

    if (pattern.test(eventKey)) {
        e.preventDefault()
    }

    if (eventKey === '.' && eventTargetValue.includes('.')) {
        e.preventDefault()
    }

    if (eventKey === '.' && eventTargetValue === '') {
        e.preventDefault()
    }
}
</script>
<!-- https://api.binance.com/sapi/v1/convert/exchangeInfo -->
