<template>
    <div class="w-full max-w-[432px]">
        <app-input
            :badge="FieldType.FROM"
            :asset-name="pairObj.fromAsset"
            :is-error="isInvalidConvertPair"
            :placeholder="`${pairObj.fromAssetMinAmount} - ${pairObj.fromAssetMaxAmount}`"
            :price-in-usd="assetPrice"
            :model-value="fromAssetValue"
            :max-amount="pairObj.fromAssetMaxAmount"
            :min-amount="pairObj.fromAssetMinAmount"
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
            :is-error="isInvalidConvertPair"
            :placeholder="`${pairObj.toAssetMinAmount} - ${pairObj.toAssetMaxAmount}`"
            class="mb-6"
            :price-in-usd="assetPrice"
            :max-amount="pairObj.toAssetMaxAmount"
            :min-amount="pairObj.toAssetMinAmount"
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
const fromAssetValue = ref<string>('')
const toAssetValue = ref<string>('')
const pairObj = ref<IConvertPair>({
    fromAsset: fromAsset.value,
    toAsset: toAsset.value,
    fromAssetMinAmount: '0',
    fromAssetMaxAmount: '0',
    toAssetMinAmount: '0',
    toAssetMaxAmount: '0',
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
    const inputValue = (e.target as HTMLInputElement).value
    fromAssetValue.value = inputValue

    if (assetPrice.value && fromAssetValue.value && fromAssetValue.value <= pairObj.value.fromAssetMaxAmount) {
        if (pairObj.value.fromIsBase) {
            toAssetValue.value = (Number(fromAssetValue.value) * Number(assetPrice.value)).toFixed(8)
        } else {
            toAssetValue.value = (Number(fromAssetValue.value) / Number(assetPrice.value)).toFixed(8)
        }
    } else {
        toAssetValue.value = ''
    }
}

// set and calc value to To field
const onToAssetChange = (e: Event): void => {
    const inputValue = (e.target as HTMLInputElement).value
    toAssetValue.value = inputValue

    if (assetPrice.value && toAssetValue.value && toAssetValue.value <= pairObj.value.toAssetMaxAmount) {
        if (pairObj.value.fromIsBase) {
            fromAssetValue.value = (Number(toAssetValue.value) / Number(assetPrice.value)).toFixed(8)
        } else {
            fromAssetValue.value = (Number(toAssetValue.value) * Number(assetPrice.value)).toFixed(8)
        }
    } else {
        fromAssetValue.value = ''
    }
}

// call setInitialConvertPair
setInitialConvertPair()

// clear convert params when page close
onBeforeUnmount(() => {
    route.query = {}
})

// convert pair price
const assetPrice = computed<string>(() => {
    const priceItem = convertPairsPrice.value?.find(
        (priceItem) => priceItem.symbol === `${fromAsset.value}${toAsset.value}` || priceItem.symbol === `${toAsset.value}${fromAsset.value}`,
    )

    return priceItem ? priceItem.price : 'N/A'
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

watch(
    pairObj,
    () => {
        if (fromAssetValue.value || toAssetValue.value) {
            fromAssetValue.value = ''
            toAssetValue.value = ''
        }
    },
    { deep: true },
)
</script>
