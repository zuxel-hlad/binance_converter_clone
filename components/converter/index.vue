<template>
    <div class="w-full max-w-[432px]">
        <span class="block text-center text-white">{{ pairObj.fromIsBase }} - {{ isReversed }}</span>
        <app-input
            :badge="FieldType.FROM"
            :asset-name="pairObj.fromAsset"
            :is-error="isInvalidConvertPair || Boolean(isFromAssetMinAmountValid)"
            :placeholder="`${pairObj.fromAssetMinAmount} - ${pairObj.fromAssetMaxAmount}`"
            :error-message="isFromAssetMinAmountValid"
            :price-in-usd="assetPrice"
            :model-value="fromAssetValue"
            @input="onFromAssetChange"
            @change-asset="onAssetChange(FieldType.FROM)"
        />
        <button
            type="button"
            class="flex w-full items-center justify-center bg-transparent py-4 text-gray-hover transition-colors hover:text-white"
            tabindex="-1"
            @click="onReverseAssets"
        >
            <svg class="size-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 3h3v18.5l-7-7h4V3zM16.5 21h-3V2.5l7 7h-4V21z" fill="currentColor" />
            </svg>
        </button>
        <app-input
            :model-value="toAssetValue"
            :badge="FieldType.TO"
            :asset-name="pairObj.toAsset"
            :is-error="isInvalidConvertPair || Boolean(isToAssetMinAmountValid)"
            :placeholder="`${pairObj.toAssetMinAmount} - ${pairObj.toAssetMaxAmount}`"
            :error-message="isToAssetMinAmountValid"
            class="mb-6"
            :price-in-usd="assetPrice"
            @change-asset="onAssetChange(FieldType.TO)"
            @input="onToAssetChange"
        />
        <div v-if="!isInvalidConvertPair" class="mb-6 flex w-full items-center justify-between gap-2 text-sm font-normal text-white">
            <span>Price:</span>
            <span class="text-right">{{ assetPriceMessage }}</span>
        </div>
        <app-button disabled type="button" class="h-12 w-full truncate" tabindex="-1">Enter Amount</app-button>
        <span v-if="isInvalidConvertPair" class="block text-center text-red-500">Invalid convert pair.</span>
    </div>

    <app-modal v-model="assetDialog">
        <assets-dialog :assets="marginAssets ?? []" @on-asset-selected="onAssetSelected" @close-dialog="assetDialog = false" />
    </app-modal>
</template>

<script setup lang="ts">
import assetsDialog from '~/components/assets-dialog/index.vue'
import { appButton, appInput, appModal } from '~/components/UI'
import { BASE_FROM_ASSET, BASE_TO_ASSET } from '~/constants'
import { getAllAssets, getConvertPairs, getConvertPairsPrice } from '~/lib/api'
import { FieldType, type IConvertPair } from '~/types/assets'

//used variables
const fromAsset = ref<string>(BASE_FROM_ASSET)
const toAsset = ref<string>(BASE_TO_ASSET)
const assetSource = ref<FieldType | null>(null)
const assetDialog = ref<boolean>(false)
const isInvalidConvertPair = ref<boolean>(false)
const isReversed = ref<boolean>(false)
const fromAssetValue = ref<number | undefined>()
const toAssetValue = ref<number | undefined>()
const pairObj = ref<IConvertPair>({
    fromAsset: fromAsset.value,
    toAsset: toAsset.value,
    fromAssetMinAmount: '0 - 0',
    fromAssetMaxAmount: '0 - ',
    toAssetMinAmount: '0 - 0',
    toAssetMaxAmount: '0 - 0',
    fromIsBase: false,
})

// router
const router = useRouter()
const route = useRoute()

// get data from api
const { data: marginAssets } = await useAsyncData('margin-assets', getAllAssets)
const { data: convertPairs } = await useAsyncData('convert-pair', getConvertPairs)

const { data: convertPairsPrice } = await useAsyncData('convert-pairs-price', getConvertPairsPrice)

// set asset name depends on source - FROM or TO
const onAssetSelected = (assetName: string): void => {
    switch (assetSource.value) {
        case FieldType.FROM:
            fromAsset.value = assetName
            assetDialog.value = false
            assetSource.value = null
            break
        case FieldType.TO:
            toAsset.value = assetName
            assetDialog.value = false
            assetSource.value = null
            break
        default:
            throw new Error('Unexpected error.')
    }
}

// set asset source. FROM or TO
const onAssetChange = (source: FieldType): void => {
    assetSource.value = source
    assetDialog.value = true
}

// reverse assets. USDT => BTS to BTC => USDT
const onReverseAssets = (): void => {
    const fromValue = fromAssetValue.value
    const toAsValue = toAssetValue.value
    nextTick(() => {
        fromAssetValue.value = toAsValue
        toAssetValue.value = fromValue
    })

    isReversed.value = !isReversed.value
}

// if query param have value to and value from, fromAsset - route.query.from, toAsset - route.query.to
const setInitialConvertPair = (): void => {
    if (route.query?.from && route.query?.to) {
        fromAsset.value = String(route.query.from)
        toAsset.value = String(route.query.to)
    }
}

// set and calc value to From field
const onFromAssetChange = (e: Event): void => {
    const eventTargetValue = (e.target as HTMLInputElement).value
    fromAssetValue.value = Number(eventTargetValue)
    if (assetPrice.value && fromAssetValue.value) {
        if (pairObj.value.fromIsBase) {
            toAssetValue.value = fromAssetValue.value * assetPrice.value
        } else {
            toAssetValue.value = fromAssetValue.value / assetPrice.value
        }
    } else {
        toAssetValue.value = undefined
    }
}

// set and calc value to To field
const onToAssetChange = (e: Event): void => {
    const eventTargetValue = (e.target as HTMLInputElement).value
    toAssetValue.value = Number(eventTargetValue)
    if (assetPrice.value && toAssetValue.value) {
        if (pairObj.value.fromIsBase) {
            fromAssetValue.value = toAssetValue.value / assetPrice.value
        } else {
            fromAssetValue.value = toAssetValue.value * assetPrice.value
        }
    } else {
        fromAssetValue.value = undefined
    }
}

// call setInitialConvertPair
setInitialConvertPair()

// clear convert params when page close
onBeforeUnmount(() => {
    route.query = {}
})

//validate fromAssetMaxValue
const isFromAssetMaxAmountValid = computed<boolean>(() => {
    return fromAssetValue.value && fromAssetValue.value <= Number(pairObj.value.fromAssetMaxAmount) ? true : false
})

//validate toAssetMaxValue
const isToAssetMaxAmountValid = computed<boolean>(() => {
    return toAssetValue.value && toAssetValue.value <= Number(pairObj.value.toAssetMaxAmount) ? true : false
})

//validate fromAssetMinValue
const isFromAssetMinAmountValid = computed<string>(() => {
    if (fromAssetValue.value && fromAssetValue.value < Number(pairObj.value.fromAssetMinAmount)) {
        return `value is less than the minimum limit (${pairObj.value.fromAssetMinAmount})`
    }
    return ''
})

//validate toAssetMinValue
const isToAssetMinAmountValid = computed<string>(() => {
    if (toAssetValue.value && toAssetValue.value < Number(pairObj.value.toAssetMinAmount)) {
        return `value is less than the minimum limit (${pairObj.value.toAssetMinAmount})`
    }
    return ''
})

// convert pair price
const assetPrice = computed<number | undefined>(() => {
    const priceItem = convertPairsPrice.value?.find(
        (priceItem) => priceItem.symbol === `${fromAsset.value}${toAsset.value}` || priceItem.symbol === `${toAsset.value}${fromAsset.value}`,
    )

    return priceItem ? Number(priceItem.price) : undefined
})

// convert pair price message
const assetPriceMessage = computed<string>(() => {
    const baseAsset = pairObj.value.fromIsBase ? pairObj.value.fromAsset : pairObj.value.toAsset
    const targetAsset = pairObj.value.fromIsBase ? pairObj.value.toAsset : pairObj.value.fromAsset

    return `1 ${baseAsset} ≈ ${assetPrice.value} ${targetAsset}`
})

// set convert object pair depends on fromAsset value, and toAsset value
watchEffect(() => {
    if (convertPairs.value) {
        const pair: IConvertPair | undefined = convertPairs.value.find((asset) => {
            if (isReversed.value) {
                return asset.fromAsset === toAsset.value && asset.toAsset === fromAsset.value
            }

            return asset.fromAsset === fromAsset.value && asset.toAsset === toAsset.value
        })

        if (pair) {
            isInvalidConvertPair.value = false
            pairObj.value = {
                ...pair,
            }
        } else {
            isInvalidConvertPair.value = true
        }
    }
})

// set selected assets to query
watch(
    [pairObj, isReversed],
    () => {
        if (isReversed.value) {
            router.replace({ query: { from: toAsset.value, to: fromAsset.value } })
        } else {
            router.replace({ query: { from: fromAsset.value, to: toAsset.value } })
        }
    },
    { deep: true },
)

// reset fromAssetValue and toAssetValue if their value is not valid
watch([fromAssetValue, toAssetValue], () => {
    if (!isFromAssetMaxAmountValid.value) {
        fromAssetValue.value = undefined
    }

    if (!isToAssetMaxAmountValid.value) {
        toAssetValue.value = undefined
    }
})
</script>
