import { BigNumber } from 'ethers';


export interface BaseTokenList {
    address?: `0x${string}` | undefined,
    displayName?: string,
    spenderAddress?: string,
    contractAddress?: string,
    priceName?: string
}

export interface AllTokenList extends BaseTokenList {
    name?: string,
    symbol?: string,
    decimals?: number,
    balanceOf?: BigNumber,
    balance?: string
}