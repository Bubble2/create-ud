import React, { useContext, useMemo } from 'react'
import { Modal, Button, Spin, App } from 'antd'
import { useCallback } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import Icon from '@components/widgets/icon'
import { useChainId } from '@hooks/useChainId';
import { formatStrMiddleEllipsis } from '@utils/format'
import { useTranslation } from 'react-i18next';
import { useNetwork } from 'wagmi'


export function useNotification () {
    const chainId = useChainId();
    const { chain, chains } = useNetwork()
    const { notification } = App.useApp();
    console.log('useNetwork', chain?.blockExplorers?.default?.url)
    const explorerTxUrlPrefix = chain?.blockExplorers?.default?.url + '/tx/'
    const { t } = useTranslation();
    const showWarning = useCallback((obj) => {
        notification['warning']({
            placement: 'bottomRight',
            ...obj
        })
    }, [])

    const showSuccess = useCallback((obj) => {
        notification['success']({
            placement: 'bottomRight',
            ...obj
        })
    }, [])

    const showError = useCallback((obj) => {
        notification['error']({
            placement: 'bottomRight',
            ...obj
        })
    }, [])

    const showInfo = useCallback((obj) => {
        notification['info']({
            placement: 'bottomRight',
            ...obj
        })
    }, [])

    const showApiSuccess = useCallback((message) => {
        showSuccess({
            message: message || "Success"
        })
    }, [])

    const showApiError = useCallback((message) => {
        showError({
            message: message || "Failed"
        })
    }, [t])

    const showAwaiting = useCallback((obj) => {
        notification.open({
            icon: <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />,
            duration: null,
            placement: 'bottomRight',
            ...obj
        })
    }, [])

    const showPendingTransaction = useCallback((transactionHash, message) => {
        showAwaiting({
            message: message || t("Toast.Pending_transaction"),
            key: transactionHash,
            description: <a href={explorerTxUrlPrefix + '' + transactionHash} target="_blank">{formatStrMiddleEllipsis(transactionHash)}<Icon type="icon-select" /></a>
        })
    }, [t])

    const showConfirmedTransaction = useCallback((transactionHash, message) => {
        transactionHash && notification.destroy(transactionHash);
        showSuccess({
            message: message || t("Toast.Transaction_Confirmed"),
            description: <a href={explorerTxUrlPrefix + '' + transactionHash} target="_blank">{formatStrMiddleEllipsis(transactionHash)}<Icon type="icon-select" /></a>
        })
    }, [t])

    const showTransactionReject = useCallback((message) => {
        showWarning({ message: message || t("Toast.Transaction_rejected") });
    }, [t])

    const showFailedTransaction = useCallback((transactionHash, message, description) => {
        transactionHash && notification.destroy(transactionHash);
        showError({ message: message || t("Toast.Transaction_Failed"), description });
    }, [t])

    const showLoggedIn = useCallback((obj) => {
        // const { t } = useTranslation();
        notification.open({
            icon: <Icon type="icon-link" style={{ color: '#1890FF' }} />,
            message: t("Toast.connected"),
            placement: 'bottomRight',
            ...obj
        })
    }, [t])

    const showLoggedOut = useCallback((obj) => {
        // const { t } = useTranslation();
        notification.open({
            icon: <Icon type="icon-disconnect" style={{ color: '#E73838' }} />,
            message: t("Toast.Disconnected"),
            placement: 'bottomRight',
            ...obj
        })
    }, [t])

    return {
        showWarning,
        showSuccess,
        showError,
        showInfo,
        showAwaiting,
        showPendingTransaction,
        showConfirmedTransaction,
        showTransactionReject,
        showFailedTransaction,
        showLoggedIn,
        showLoggedOut,
        showApiSuccess,
        showApiError
    }
}