import { useState, useCallback, useContext, useEffect } from 'react'
import { MaxUint256 } from '@ethersproject/constants'
import { useContractWriteWithNotification, useWaitForTransactionWithNotification } from '@hooks/useContractWithNotification';
import { useContractRead, usePrepareContractWrite, erc20ABI, useAccount } from 'wagmi';
import useTokenAllowance from './useTokenAllowance';
import { useBlockNumber } from 'wagmi'

export interface ApproveProps {
    tokenAddress: `0x${string}`
    spenderAddress: `0x${string}`,
    spendAmount: number
}

export function useApprove({ tokenAddress, spenderAddress, spendAmount }: ApproveProps, { onSuccess }: { onSuccess?: (data?:any) => void }) {
    const { address: account } = useAccount();
    const { data: blockNumber } = useBlockNumber()
    const { getAllowanceByAddress, fetchAllowance, isFetching: isAllowanceLoading } = useTokenAllowance([{
        address: tokenAddress,
        spenderAddress
    }])

    //获取allowance
    const allowance = getAllowanceByAddress(tokenAddress, spenderAddress)

    useEffect(() => {
        fetchAllowance()
    }, [account, blockNumber])

    console.log('allowance-spendAmount', allowance, Number(spendAmount))
    const isNeedApprove = allowance < Number(spendAmount);
    console.log('isNeedApprove', isNeedApprove)

    //授权方法
    const { config } = usePrepareContractWrite({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'approve',
        args: [spenderAddress, MaxUint256],
        enabled: !!spenderAddress && isNeedApprove
    })
    const { data, isLoading, isSuccess, write } = useContractWriteWithNotification({
        ...config
    })
    const waitForTransaction = useWaitForTransactionWithNotification({
        hash: data?.hash,
        onSuccess(data: any) {
            //授权成功，重新获取allowance
            fetchAllowance && fetchAllowance();
            onSuccess && onSuccess(data)
        }
    })

    console.log('allowance', allowance, isAllowanceLoading)


    return {
        approveHandle: write,
        approvePending: isLoading || waitForTransaction.isLoading,
        allowance,
        isNeedApprove
    }

}
