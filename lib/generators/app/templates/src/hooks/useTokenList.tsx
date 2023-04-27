import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useChainId } from '@hooks/useChainId';
import { DEFAULT_CHAIN_ID, NATIVE_TOKEN_ADDRESS } from '@constants/index'
import { AllTokenList } from "@constants/tokenList/index"
import { TOKEN_LIST as ETHERUM_TOKEN_LIST } from '@constants/tokenList/etherum';
import { TOKEN_LIST as BINANCE_TOKEN_LIST } from '@constants/tokenList/binance';
import { TOKEN_LIST as GOERLI_TOKEN_LIST } from '@constants/tokenList/goerli';
import { erc20ABI, useContractReads, useAccount, useBalance } from 'wagmi'
import tokenSlice, { updateTokenList, updateCustomTokenList } from '@state/tokenSlice'
import { useDispatch, useSelector } from 'react-redux';
import { formatUnits } from '@ethersproject/units';
import { BigNumber } from 'ethers';
import { AppState } from '@src/configStore'
import { BaseTokenList } from '@constants/tokenList'

export default (baseTokenList?: BaseTokenList[]) => {
    const chainId = useChainId();
    const { address: account } = useAccount()
    let functionArrLenRef = useRef(0);
    const chainMap = {
        1: ETHERUM_TOKEN_LIST,
        56: BINANCE_TOKEN_LIST,
        5: GOERLI_TOKEN_LIST
    }

    const dispatch = useDispatch()
    const tokenListResolved: AllTokenList[] = useSelector<AppState, AppState['tokenSlice']['tokenList']>(state => state.tokenSlice.tokenList)
    const customTokenListResolved: AllTokenList[] = useSelector<AppState, AppState['tokenSlice']['customTokenList']>(state => state.tokenSlice.customTokenList)

    const tokenList = useMemo(() => {
        if (baseTokenList) {
            return baseTokenList
        } else {
            return chainMap[chainId] || chainMap[DEFAULT_CHAIN_ID];
        }
    }, [baseTokenList, chainId])

    const tokenListWithoutNative = tokenList.filter(item => {
        return item.address?.toUpperCase() !== NATIVE_TOKEN_ADDRESS?.toUpperCase()
    })

    const tokenListFromState = useMemo(() => {
        if (baseTokenList) {
            return customTokenListResolved
        } else {
            return tokenListResolved
        }
    }, [baseTokenList, tokenListResolved, customTokenListResolved])


    //获取主币余额
    const { refetch: reFetchNativeToken } = useBalance({
        address: account,
        watch: false
    })

    const contracts = useMemo(() => {
        const contracts = tokenListWithoutNative.map((item: AllTokenList) => {
            const subList = [
                {
                    address: item.address,
                    abi: erc20ABI,
                    functionName: 'name',
                    chainId
                },
                {
                    address: item.address,
                    abi: erc20ABI,
                    functionName: 'symbol',
                    chainId
                },
                {
                    address: item.address,
                    abi: erc20ABI,
                    functionName: 'decimals',
                    chainId
                }
            ]
            functionArrLenRef.current = subList.length;
            return subList
        })
        return contracts
    }, [tokenList, chainId, account, tokenListWithoutNative])

    const { refetch } = useContractReads({
        contracts: contracts.flat(),
        enabled: false
    })

    const resolveNativeData = (data: any) => {
        const decimals = data?.decimals
        const symbol = data?.symbol
        const nativeToken = tokenList.find(item => item.address?.toUpperCase() === NATIVE_TOKEN_ADDRESS?.toUpperCase()) || {}
        return {
            ...nativeToken,
            decimals,
            symbol,
        }
    }

    const resolveData = (data: any, tokenListWithoutNative: AllTokenList[]) => {
        const resolvedData = data && tokenListWithoutNative.map((item: AllTokenList, index: number) => {
            const functionArr = new Array(functionArrLenRef.current).fill(0)
            const functionObj: AllTokenList = {};

            functionArr.forEach((item, i) => {
                functionObj[contracts[index][i].functionName] = data[index * functionArrLenRef.current + i]
            })
            return {
                ...functionObj,
                ...item
            }
        })
        return resolvedData;
    }

    const fetchTokenList = useCallback(async () => {
        const p1 = reFetchNativeToken()
        const p2 = refetch()
        return Promise.all([p1, p2]).then(([resNative, res]) => {
            let resTokenLists = [];
            resTokenLists.push(resolveNativeData(resNative.data))
            resTokenLists = resTokenLists.concat(resolveData(res.data, tokenListWithoutNative));
            dispatch(updateTokenList(resTokenLists))
            return resTokenLists
        })
    }, [refetch, tokenListWithoutNative])

    const finalTokenList = tokenListFromState.length ? tokenListFromState : tokenList

    const getSymbolByAddress = useCallback((address) => {
        return tokenListFromState.find(item => item.address === address)?.symbol
    }, [tokenListFromState])

    const getDecimalByName = useCallback((name) => {
        return tokenListFromState.find(item => item.displayName === name)?.decimals
    }, [tokenListFromState])

    const getTokenByName = useCallback((name) => {
        return finalTokenList.find(item => item.displayName === name) || {}
    }, [finalTokenList])

    const getTokenByAddress = useCallback((address) => {
        return finalTokenList.find(item => item.address === address) || {}
    }, [finalTokenList])

    return {
        fetchTokenList,
        tokenList: finalTokenList,
        getSymbolByAddress,
        getDecimalByName,
        getTokenByAddress,
        getTokenByName
    };
}