import React, { useState, useMemo, useEffect, useContext } from "react";
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById } from '@state/indexSlice'
import { useAccount, useBalance } from 'wagmi'
import useTokenList from '@hooks/useTokenList';
import useTokenBalance from '@hooks/useTokenBalance';
import { useChainId } from '@hooks/useChainId';
import { useTranslation } from 'react-i18next';
import styles from './index.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
import WalletModal from '@components/biz/walletModal'
import { usePrepareContractWrite } from 'wagmi'
import valultAbi from '@constants/abi/vault-abi.json'
import { parseUnits } from '@ethersproject/units';
import ApproveBtn from '@components/biz/approveBtn';
import { useContractWriteWithNotification, useWaitForTransactionWithNotification } from '@hooks/useContractWithNotification'
import ConnectWallet from '@components/biz/connectWallet';
import useContractAddress from '@hooks/useContractAddress';

export default () => {
    const dispatch = useDispatch();
    const [walletModalOpen, setWalletModalOpen] = useState(false)
    const { address } = useAccount();

    const { tokenList, getTokenByName } = useTokenList()
    const { getBalanceByAddress } = useTokenBalance()
    const tokenObj = getTokenByName('USDT')

    const valultContractAddress = useContractAddress('valult')

    const amount = 2
    const amountBn = parseUnits(String(amount), tokenObj?.decimals)
    const { config, error } = usePrepareContractWrite({
        address: valultContractAddress,
        abi: valultAbi,
        functionName: 'deposit',
        args: [amountBn, address],
        onError (error) {
            console.log('Error', error)
        }
    })
    const { data, isLoading, write } = useContractWriteWithNotification({
        ...config
    })

    const waitForTransaction = useWaitForTransactionWithNotification({
        hash: data?.hash
    })


    return (<>
        {/* 连接钱包 */}
        <ConnectWallet />

        {/* token列表示例 */}
        <div>
            {tokenList.map(item => {
                return <p key={item.displayName}>{item.displayName}:{getBalanceByAddress(item.address)}</p>
            })}
        </div>

        {/* 交易示例 */}
        <div>
            <ApproveBtn tokenAddress={tokenObj?.address} spenderAddress={valultContractAddress} spendAmount={amount}>
                <Button type="primary" onClick={() => write?.()} loading={isLoading || waitForTransaction.isLoading}>fund</Button>
            </ApproveBtn>
        </div>
    </>
    );
};
