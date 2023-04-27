import React, { useEffect, useMemo, useRef } from 'react';
import { useAccount, useBlockNumber, useWaitForTransaction } from 'wagmi';
import { useDispatch, useSelector } from 'react-redux';
import { failedTransaction, finalizeTransaction } from '@state/transactionSlice';
import { useNotification } from '@hooks/useNotification';
import { AppState } from '@src/configStore';
import { TransactionStatus } from '@constants/index';


export default () => {
    const dispatch = useDispatch()
    const { showConfirmedTransaction, showFailedTransaction } = useNotification()
    const transactions = useSelector<AppState, AppState['transactionSlice']>(state => state.transactionSlice)
    const pendingTransactions = Object.values(transactions).filter(item => {
        return item.status === TransactionStatus.Pending
    }).sort((a, b) => b.addedTime - a.addedTime)

    const watchTransaction = pendingTransactions[0]

    useWaitForTransaction({
        hash: watchTransaction?.hash,
        onSuccess(data) {
            console.log('Success', data)
            dispatch(finalizeTransaction({ hash: data?.transactionHash, transactionReceipt: data }));
            showConfirmedTransaction(data?.transactionHash);
        },
        onError(error: Error) {
            dispatch(failedTransaction({ hash: watchTransaction?.hash }));
            showFailedTransaction(watchTransaction?.hash)
        },
    })

    return null
}