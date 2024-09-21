import type { IAsset } from '@/types/assets.ts'

import { API_URL, API_KEY } from '@/constants'

export const getAllAssets = async (): Promise<IAsset[]> => {
    return await $fetch(`${API_URL}/sapi/v1/margin/allAssets`, {
        method: 'GET',
        headers: {
            'X-MBX-APIKEY': API_KEY,
        },
    })
}
