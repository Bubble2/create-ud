import React, { useEffect, useMemo, useCallback } from 'react';
import { useChainId } from '@hooks/useChainId';
import { erc20ABI, useAccount, useContractReads, useBalance } from 'wagmi'
import { useDispatch, useSelector } from 'react-redux';
import { formatUnits } from '@ethersproject/units';
import useTokenList from './useTokenList';
import { updateTokenBalance } from '@state/tokenSlice'
import { AppState } from '@src/configStore'
import { BigNumber } from 'ethers';
import { AllTokenList } from '@constants/tokenList'
import { NATIVE_TOKEN_ADDRESS } from '@constants/index';

export default (customTokenList?: AllTokenList[]) => {
    const chainId = useChainId();
    const dispatch = useDispatch()
    const { address: account } = useAccount()
    const { tokenList: defaultTokenList } = useTokenList()

    const tokenList = customTokenList || defaultTokenList;
    const tokenListWithoutNative = tokenList.filter(item => {
        return item.address?.toUpperCase() !== NATIVE_TOKEN_ADDRESS?.toUpperCase()
    })

    const tokenBalance = useSelector<AppState, AppState['tokenSlice']['tokenBalance']>(state => state.tokenSlice.tokenBalance)

    const contractsArr = useMemo(() => {
        if (tokenList?.length > 0) {
            return tokenListWithoutNative.map(item => {
                return [
                    {
                        address: item.address,
                        abi: erc20ABI,
                        functionName: 'balanceOf',
                        chainId,
                        args: [account]
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
    }, [tokenList, account, tokenListWithoutNative])

    //获取主币余额
    const { refetch: reFetchNativeToken } = useBalance({
        address: account,
        watch: false
    })

    const {refetch } = useContractReads({
        contracts: contractsArr.flat(),
        enabled: false
    })

    const resolveNativeData = (data: any) => {
        const balanceBn = data?.value
        const decimals = data?.decimals
        return {
            [NATIVE_TOKEN_ADDRESS]: balanceBn ? Number(formatUnits(balanceBn as BigNumber, decimals as number)) : 0
        }
    }

    const resolveData = useCallback((data: any, tokenListWithoutNative: AllTokenList[]) => {
        const tokenBalance = {}
        tokenListWithoutNative.forEach((item, index) => {
            const balanceBn = data[index * 2]
            const decimals = data[index * 2 + 1]
            tokenBalance[`${item.address}`] = balanceBn ? Number(formatUnits(balanceBn as BigNumber, decimals as number)) : 0
        })
        return tokenBalance;
    }, [tokenList])

    const fetchBalance = useCallback(async () => {
        const p1 = reFetchNativeToken()
        const p2 = refetch()

        return Promise.all([p1, p2]).then(([resNative, res]) => {
            const resTokenLists = {
                ...resolveNativeData(resNative.data),
                ...resolveData(res.data, tokenListWithoutNative)
            }
            dispatch(updateTokenBalance(resTokenLists))
            return resTokenLists
        })
    }, [refetch, tokenListWithoutNative])

    const getBalanceByAddress = useCallback((address) => {
        return tokenBalance[`${address}`]
    }, [tokenBalance])

    const getBalanceByName = useCallback((name) => {
        const curToken = tokenList.find(item => item.displayName === name);
        return curToken ? getBalanceByAddress(curToken.address) : 0
    }, [tokenList, getBalanceByAddress])

    return {
        fetchBalance,
        tokenBalance,
        getBalanceByAddress,
        getBalanceByName
    };
}