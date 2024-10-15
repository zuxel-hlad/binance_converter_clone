import type { IAsset, IConvertPair } from '@/types/assets.ts'

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
