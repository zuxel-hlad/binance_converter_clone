import type { IAsset, IConvertPair, IConvertPairPrice } from '@/types/assets.ts'

export const getAllAssets = async (): Promise<IAsset[] | null> => {
    return await $fetch(`${process.env.API_URL}/sapi/v1/margin/allAssets`, {
        method: 'GET',
        headers: {
            'X-MBX-APIKEY': process.env.API_KEY as string,
        },
    })
}

export const getConvertPairs = async (): Promise<IConvertPair[] | null> => {
    return await $fetch(`${process.env.API_URL}/sapi/v1/convert/exchangeInfo?`)
}

export const getConvertPairsPrice = async (): Promise<IConvertPairPrice[] | null> => {
    return await $fetch(`${process.env.API_URL}/api/v3/ticker/price`)
}
