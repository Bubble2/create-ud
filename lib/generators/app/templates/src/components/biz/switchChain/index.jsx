import React, { useMemo, useState, useEffect } from 'react';
import {
    useSwitchNetwork,
} from 'wagmi'
import { Button, Select, Modal, Spin } from 'antd';
import { useChainId } from '@hooks/useChainId'
import styles from './styles/index.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
import { SUPPORTED_CHAINS } from '@constants/index'

export default () => {
    const chainId = useChainId(false);
    const [currentChainId, setCurrentChainId] = useState();

    const { switchNetworkAsync } =
        useSwitchNetwork({
            onSuccess (data) {
                console.log('Success', data)
                window.location.reload();
            }
        })

    const switchChain = async (selectedChainId) => {
        if (selectedChainId === chainId) return;
        try {
            //连接钱包可以走wagmi这个切换网络
            if (switchNetworkAsync) {
                await switchNetworkAsync(selectedChainId)
            } else {
                await ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0x" + selectedChainId.toString(16) }],
                });
            }
            setCurrentChainId(selectedChainId);
        } catch (switchError) {
            console.log('switchError', switchError)
            if (switchError.code === 4902) {
                //构造添加网络的参数
                console.log('SUPPORTED_CHAINS', SUPPORTED_CHAINS)
                const targetChain = SUPPORTED_CHAINS.find(item => item.id === selectedChainId)
                console.log('targetChain', targetChain)
                const rpcUrls = [...new Set(Object.values(targetChain.rpcUrls).map(item => item.http).flat())];
                const blockExplorerUrls = [...new Set(Object.values(targetChain.blockExplorers).map(item => item.url))]

                const addEthereumChainParameter = [{
                    chainId: '0x' + (targetChain.id).toString(16), // A 0x-prefixed hexadecimal string
                    chainName: targetChain.name,
                    nativeCurrency: targetChain.nativeCurrency,
                    rpcUrls: rpcUrls,
                    blockExplorerUrls: blockExplorerUrls
                }]

                console.log('addEthereumChainParameter', addEthereumChainParameter)

                try {
                    await ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: addEthereumChainParameter
                    });
                    window.location.reload();
                } catch (addError) {
                    console.log(addError);
                }
            }
        }
    };

    const selectedChainId = useMemo(() => {
        const resolvedChainId = currentChainId || chainId
        //检测切换的chainId我们是否支持
        const supportChain = SUPPORTED_CHAINS.find(item => item.id === resolvedChainId)
        if (supportChain) {
            return resolvedChainId
        } else {
            return 'Network Error';
        }
    }, [currentChainId, chainId])

    return (
        <>
            <Select
                defaultValue={1}
                onChange={switchChain}
                value={selectedChainId}
                options={[
                    { value: 1, label: 'Mainnet' },
                    { value: 5, label: 'Goerli' },
                ]}
            />
        </>
    )
}