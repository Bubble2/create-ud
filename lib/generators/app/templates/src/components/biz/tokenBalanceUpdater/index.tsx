import React, { useEffect, useMemo, useRef } from 'react';
import useTokenBalance from '@hooks/useTokenBalance';
import { useAccount, useBlockNumber } from 'wagmi';

export default () => {
    const { fetchBalance } = useTokenBalance()
    const { data: blockNumber } = useBlockNumber({
        watch: true,
    })
    const { address: account } = useAccount()

    useEffect(() => {
        fetchBalance()
    }, [blockNumber, account])

    return null
}