import React, { useMemo, useState, useEffect } from 'react';
import {
    useAccount,
    useDisconnect
} from 'wagmi'
import WalletModal from '@components/biz/walletModal'
import { Button, Select, Modal, Spin } from 'antd';
import { useChainId } from '@hooks/useChainId'
import { SUPPORTED_CHAIN_IDS } from '@constants/index';
import styles from './index.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import {
    CaretDownOutlined,
    LoadingOutlined
} from "@ant-design/icons";
import { SUPPORTED_CHAINS } from '@constants/index'
import { formatStrMiddleEllipsis } from '@utils/format'

/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency
 */
export function isTransactionRecent (tx) {
    return new Date().getTime() - tx.addedTime < 86_400_000
}

// we want the latest one to come first, so return negative if a is after b
export function newTransactionsFirst (a, b) {
    return b.addedTime - a.addedTime
}


export default () => {
    const { address, isConnected } = useAccount()
    const { disconnect } = useDisconnect()
    const [walletModalOpen, setWalletModalOpen] = useState(false)
    const chainId = useChainId(false);
    const { t, i18n } = useTranslation();

    const transaction = useSelector(state => state.transactionSlice)

    const sortedRecentTransactions = useMemo(() => {
        const txs = Object.values(transaction);
        return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
    }, [transaction]);

    const pending = sortedRecentTransactions
        .filter((tx) => !tx.receipt && !tx.failedTime)
        .map((tx) => tx.hash);

    const hasPendingTransactions = !!pending.length;

    let connectStr = null;
    if (!SUPPORTED_CHAIN_IDS.includes(chainId)) {
        connectStr = <Button type='primary' danger>Network Error</Button>
    } else if (!isConnected) {
        connectStr = <Button type='primary' onClick={setWalletModalOpen.bind(null, true)}>connect wallet</Button>
    } else if (hasPendingTransactions) {
        connectStr = <Button type='primary' className={styles["pending-btn"]}>
            <span className={styles.txt}>{pending.length}&nbsp;Pending</span>
            <Spin
                className={cx("icon-loading")}
                indicator={<LoadingOutlined spin />}
            /></Button>
    } else {
        connectStr = (
            <Button type='primary'>
                {formatStrMiddleEllipsis(address)}
            </Button>
        )
    }


    return (
        <>
            <div className={styles["connect-wrap"]}>
                {connectStr}
                {isConnected && <Button onClick={disconnect}>disconnect</Button>}
            </div>
            <WalletModal open={walletModalOpen} onOpen={setWalletModalOpen.bind(null, true)} onCancel={setWalletModalOpen.bind(null, false)} />
        </>
    )
}