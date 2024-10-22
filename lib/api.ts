import type { IAsset, IConvertPair, IConvertPairPrice } from '@/types/assets.ts'

import { API_URL, API_KEY } from '@/constants'

export const getAllAssets = async (): Promise<IAsset[] | null> => {
    return await $fetch(`${API_URL}/sapi/v1/margin/allAssets`, {
        method: 'GET',
        headers: {
            'X-MBX-APIKEY': API_KEY,
        },
    })
}

export const getAllConvertPairs = async (): Promise<IConvertPair[] | null> => {
    return await $fetch(`${API_URL}/sapi/v1/convert/exchangeInfo`)
}

export const getConvertPairsPrice = async (): Promise<IConvertPairPrice[] | null> => {
    return await $fetch(`${API_URL}/api/v3/ticker/price`)
}

// https://api.binance.com
// NDvcdHve3wbb3n9jX9X11lUjvx7zIknMTFpLpIVZjebIRM67arI8S0hPs107MHcg