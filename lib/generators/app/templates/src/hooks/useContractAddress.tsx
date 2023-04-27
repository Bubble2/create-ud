import React from 'react';
import contractAddress from '@constants/contractAddress';
import { useChainId } from './useChainId';

export default (contractName: string) => {
    const chainId = useChainId();
    console.log('TEST1', TEST)
    if (TEST) {
        console.log('TEST2', TEST)
        return contractAddress?.[`${chainId}test`]?.[contractName]
    }
    return contractAddress?.[chainId]?.[contractName]
}