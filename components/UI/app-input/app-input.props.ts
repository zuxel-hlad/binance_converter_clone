export interface IAppInputProps {
    badge?: string
    modelValue: number | undefined
    assetName: string
    priceInUsd: number | undefined
    isError?: boolean
    placeholder?: string
    errorMessage?: string
    maxAmount: string
    minAmount: string
}
