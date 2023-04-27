import React from 'react'
import { useContractWrite, UseContractWriteConfig, useWaitForTransaction } from 'wagmi'
import { useNotification } from '@hooks/useNotification'
import { addTransaction, finalizeTransaction, failedTransaction } from '@state/transactionSlice'
import { useDispatch } from 'react-redux'

// export interface UseContractWriteWithNotificationConfig extends UseContractWriteConfig{

// }

export const useContractWriteWithNotification = function (config: UseContractWriteConfig) {
    const { onSuccess, onError, ...restConfig } = config;
    const dispatch = useDispatch();
    const { showPendingTransaction, showTransactionReject, showFailedTransaction } = useNotification();
    return useContractWrite({
        onSuccess(data, ...restArgs) {
            console.log('Success', data)
            dispatch(addTransaction({ hash: data?.hash }));
            showPendingTransaction(data?.hash)
            onSuccess && onSuccess(data, ...restArgs);
        },
        onError(error: any, ...restArgs) {
            const code = error?.code;
            if (code === 4001 || code === -32000) {
                console.log('useContractWrite Error', error)
                showTransactionReject()
            } else {
                showFailedTransaction(undefined, undefined, error?.message)
            }
            onError && onError(error, ...restArgs);
        },
        ...restConfig,
    })
}


export const useWaitForTransactionWithNotification = function (config: any): any {
    const { onSuccess, onError, ...restConfig } = config;
    const dispatch = useDispatch();
    const { showConfirmedTransaction, showFailedTransaction } = useNotification();
    return useWaitForTransaction({
        onSuccess(data) {
            console.log('Success', data)
            onSuccess && onSuccess(data);
        },
        onError(error: Error) {
            onError && onError(error);
        },
        ...restConfig
    })
}



