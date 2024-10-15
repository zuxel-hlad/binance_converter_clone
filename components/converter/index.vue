<template>
    <div class="w-full max-w-[432px]">
        <app-input
            v-model.number.trim="fromAssetValue"
            :badge="FieldType.FROM"
            :asset-name="pairObj.fromAsset"
            :is-error="isInvalidConvertPair"
            :placeholder="`${pairObj.fromAssetMinAmount} - ${pairObj.fromAssetMaxAmount}`"
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
            v-model.number.trim="toAssetValue"
            :badge="FieldType.TO"
            :asset-name="pairObj.toAsset"
            :is-error="isInvalidConvertPair"
            :placeholder="`${pairObj.toAssetMinAmount} - ${pairObj.toAssetMaxAmount}`"
            @change-asset="onAssetChange(FieldType.TO)"
        />
        <app-button disabled type="button" class="mt-6 h-12 w-full truncate" tabindex="-1">Enter Amount</app-button>
        <span v-if="isInvalidConvertPair" class="block text-center text-red-500">Invalid convert pair.</span>
    </div>
    <app-modal v-model="assetDialog">
        <assets-dialog :assets="marginAssets ?? []" @on-asset-selected="onAssetSelected" @close-dialog="assetDialog = false" />
    </app-modal>
</template>

<script setup lang="ts">
import assetsDialog from '~/components/assets-dialog/index.vue'
import { appButton, appInput, appModal } from '~/components/UI'
import { getAllAssets, getAllConvertPairs } from '~/lib/api'
import { FieldType, type IConvertPair } from '~/types/assets'

const fromAsset = ref<string>('USDT')
const toAsset = ref<string>('BTC')
const assetSource = ref<FieldType | null>(null)
const assetDialog = ref<boolean>(false)
const isInvalidConvertPair = ref<boolean>(false)
const isReversed = ref<boolean>(false)
const fromAssetValue = ref<number | undefined>()
const toAssetValue = ref<number | undefined>()
const pairObj = ref<IConvertPair>({
    fromAsset: fromAsset.value,
    toAsset: toAsset.value,
    fromAssetMinAmount: '0',
    fromAssetMaxAmount: '0',
    toAssetMinAmount: '0',
    toAssetMaxAmount: '0',
})
const router = useRouter()
const route = useRoute()
const { data: marginAssets } = await useAsyncData('margin-assets', getAllAssets)
const { data: convertPairs } = await useAsyncData('convert-pairs', getAllConvertPairs)

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

const onAssetChange = (source: FieldType): void => {
    assetSource.value = source
    assetDialog.value = true
}

const onReverseAssets = (): void => {
    isReversed.value = !isReversed.value
}

const setInitialConvertPair = (): void => {
    if (route.query?.from && route.query?.to) {
        fromAsset.value = String(route.query.from)
        toAsset.value = String(route.query.to)
    }
}

onBeforeMount(() => {
    setInitialConvertPair()
})

onBeforeUnmount(() => {
    route.query = {}
})

watchEffect(() => {
    if (convertPairs && convertPairs.value) {
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

watch(
    [pairObj, isReversed],
    () => {
        router.replace({ query: { from: isReversed.value ? toAsset.value : fromAsset.value, to: isReversed.value ? fromAsset.value : toAsset.value } })
    },
    { deep: true },
)
</script>
