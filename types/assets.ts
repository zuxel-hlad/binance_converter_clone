export interface IAsset {
    assetFullName: string
    assetName: string
    isBorrowable: boolean
    isMortgageable: boolean
    userMinBorrow: string
    userMinRepay: string
}

export interface IConvertPair {
    fromAsset: string
    toAsset: string
    fromAssetMinAmount: string
    fromAssetMaxAmount: string
    toAssetMinAmount: string
    toAssetMaxAmount: string
}

export interface IConvertPairPrice {
    symbol: string
    price: string
}

export enum FieldType {
    FROM = 'From',
    TO = 'To',
}
