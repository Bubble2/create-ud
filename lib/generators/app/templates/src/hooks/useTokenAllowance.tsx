import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useChainId } from '@hooks/useChainId';
import { erc20ABI, useAccount, useContractReads } from 'wagmi'
import { useDispatch, useSelector } from 'react-redux';
import { formatUnits } from '@ethersproject/units';
import useTokenList from './useTokenList';
import { updateTokenAllowance } from '@state/tokenSlice'
import { AppState } from '@src/configStore'
import { BigNumber } from 'ethers';
import { AllTokenList } from '@constants/tokenList'


export default (customTokenList: AllTokenList[]) => {
    const chainId = useChainId();
    const dispatch = useDispatch()
    const { address: account } = useAccount()
    const { tokenList: defaultTokenList } = useTokenList()

    const tokenList = customTokenList || defaultTokenList;

    const tokenAllowance = useSelector<AppState, AppState['tokenSlice']['tokenAllowance']>(state => state.tokenSlice.tokenAllowance)

    const contractsArr = useMemo(() => {
        if (tokenList.length > 0) {
            return tokenList.map(item => {
                return [
                    {
                        address: item.address,
                        abi: erc20ABI,
                        functionName: 'allowance',
                        chainId,
                        args: [account, item.spenderAddress]
                    },
                    {
                        address: item.address,
                        abi: erc20ABI,
                        functionName: 'decimals',
                        chainId
                    }
                ]
            })
        }
        return []
    }, [tokenList, account])

    const { isLoading, isFetching, isRefetching, refetch } = useContractReads({
        contracts: contractsArr.flat(),
        select: (data) => {
            const tokenAllowance = {}
            tokenList.forEach((item, index) => {
                const allowanceBn = data[index * 2]
                const decimals = data[index * 2 + 1]
                tokenAllowance[`${item.address}_${item.spenderAddress}`] = allowanceBn ? Number(formatUnits(allowanceBn as BigNumber, decimals as number)) : 0
            })
            return tokenAllowance;
        },
        enabled: false
    })

    console.log('isLoading', isLoading, isFetching, isRefetching)

    const fetchAllowance = useCallback(async () => {
        return refetch().then((res) => {
            dispatch(updateTokenAllowance(res.data))
            return res;
        })
    }, [refetch])

    const getAllowanceByAddress = useCallback((address, spenderAddress) => {
        return tokenAllowance[`${address}_${spenderAddress}`]
    }, [tokenAllowance])

    return {
        fetchAllowance,
        tokenAllowance,
        getAllowanceByAddress,
        isFetching
    };
}