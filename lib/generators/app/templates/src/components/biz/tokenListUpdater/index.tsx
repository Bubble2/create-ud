import React, { useEffect, useMemo, useRef } from 'react';
import useTokenList from '@hooks/useTokenList';
import { useAccount, useBlockNumber } from 'wagmi';


export default () => {
    const { fetchTokenList } = useTokenList()
    const { data: blockNumber } = useBlockNumber({
        watch: true,
    })
    const { address: account } = useAccount()
    console.log('blockNumber', blockNumber)
    
    useEffect(() => {
        fetchTokenList()
    }, [blockNumber, account])

    return null
}