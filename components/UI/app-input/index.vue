<template>
    <div class="flex w-full flex-col items-start justify-start">
        <div
            class="flex w-full flex-col gap-4 rounded-xl border border-main-gray p-4 caret-focused-input transition-colors hover:border-gray-hover"
            :class="{ '!border-focused-input': isInputFocused, '!border-red-500': isError || isMinAmountValid }"
        >
            <div class="flex items-center justify-between gap-3">
                <span class="capitalize text-white">{{ badge ?? '-' }}</span>
                <span class="text-white">Balance:&nbsp;--&nbsp;{{ assetName ?? '-' }}</span>
            </div>
            <div class="flex w-full items-center justify-between">
                <div class="relative flex w-full flex-col">
                    <input
                        :value="modelValue"
                        autocomplete="off"
                        :placeholder="placeholder ?? '0.00 - 00000'"
                        class="h-7 w-full border-none bg-transparent text-xl font-medium text-white outline-none placeholder:text-gray-hover"
                        @input="onInput"
                        @keypress="onInvalidKey"
                        @focus="isInputFocused = true"
                        @blur="isInputFocused = false"
                    />
                    <span v-if="assetName !== BASE_FROM_ASSET" class="text-xs font-normal text-gray-hover"
                        >&#8776;&nbsp;${{ modelValue.length && !isNaN(parseFloat(priceInUsd)) ? parseFloat((Number(priceInUsd) * Number(modelValue)).toFixed(8)) : '0.00' }}</span
                    >
                    <span v-else class="text-xs font-normal text-gray-hover">&#8776;&nbsp;${{ modelValue.length ? parseFloat(Number(modelValue).toFixed(8)) : '0.00' }}</span>
                </div>
                <button type="button" class="flex w-max shrink-0 items-center justify-end [&>svg]:hover:text-white" tabindex="-1" @click="emit('change-asset')">
                    <div
                        v-if="binanceCryptoIcons.has(assetName.toLocaleLowerCase())"
                        class="mr-[10px] shrink-0 [&>svg]:size-5"
                        v-html="binanceCryptoIcons.get(assetName.toLocaleLowerCase())"
                    />
                    <div v-else class="mr-[10px] size-5 shrink-0 rounded-full bg-gray-200">
                        <img src="~/assets/icons/binance_icon.svg" :alt="assetName + 'token'" />
                    </div>
                    <span class="text-base font-medium text-white">{{ assetName.toUpperCase() }}</span>
                    <chevron-down-icon class="ml-2 size-5 shrink-0 text-gray-hover transition-colors" />
                </button>
            </div>
        </div>
        <span v-if="isMinAmountValid" class="block font-light text-red-500">Amount is less than the minimum amount ({{ minAmount }} {{ assetName }}).</span>
    </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { binanceCryptoIcons } from 'binance-icons'

import type { IAppInputProps } from './app-input.props'

import { BASE_FROM_ASSET } from '~/constants'

const isInputFocused = ref<boolean>(false)
const props = defineProps<IAppInputProps>()
const emit = defineEmits<{ (e: 'change-asset'): void; (e: 'update:modelValue', value: string): void }>()

// on input event
const onInput = (e: Event) => {
    const eventTargetValue = (e.target as HTMLInputElement).value
    emit('update:modelValue', eventTargetValue)
}

//validate input values
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

//validate min-value
const isMinAmountValid = computed<boolean>(() => {
    if (props.modelValue.length && props.minAmount && props.modelValue < props.minAmount) {
        return true
    }
    return false
})
</script>
