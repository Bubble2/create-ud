import { useState, useEffect, useMemo } from 'react';
import detectEthereumProvider from '@metamask/detect-provider'
import { SUPPORTED_CHAIN_IDS, DEFAULT_CHAIN_ID } from '@constants/index'
import { useNetwork } from 'wagmi';
import { SUPPORTED_CHAINS } from '@constants/index'

export function useChainId (isUnSupportedSetFallback = true) {
    const { chain } = useNetwork()
    //CoinHub等小众钱包window.ethereum.chainId返回的是十进制数字
    let initChainId = useMemo(() => {
        let initChainId = DEFAULT_CHAIN_ID;
        if (window.ethereum && window.ethereum.chainId) {
            if (String(window.ethereum.chainId).indexOf('0x') > -1) {
                initChainId = parseInt(window.ethereum.chainId, 16)
            } else {
                initChainId = window.ethereum.chainId
            }
        } else {
            initChainId = DEFAULT_CHAIN_ID
        }
        return initChainId;
    }, [window.ethereum && window.ethereum.chainId]);

    if (isUnSupportedSetFallback && SUPPORTED_CHAIN_IDS.indexOf(initChainId) === -1) {
        initChainId = DEFAULT_CHAIN_ID;
    }

    const [chainId, setChainId] = useState(initChainId)

    useEffect(() => {
        //如果连接了钱包同时是支持的网络则直接用wagmi的，否则就通过etherum检测
        if (chain?.id) {
            if(chain?.unsupported && isUnSupportedSetFallback){
                setChainId(DEFAULT_CHAIN_ID)
            }else{
                setChainId(chain.id)
            }
        } else {
            (async () => {
                let provider = await detectEthereumProvider()
                if (provider) {
                    console.log('Ethereum successfully detected!')

                    // From now on, this should always be true:
                    // provider === window.ethereum

                    // Access the decentralized web!

                    // Legacy providers may only have ethereum.sendAsync
                    const chainId = await provider.request({
                        method: 'eth_chainId'
                    })
                    if (chainId) {
                        if (isUnSupportedSetFallback && SUPPORTED_CHAIN_IDS.indexOf(parseInt(chainId, 16)) === -1) {
                            setChainId(DEFAULT_CHAIN_ID)
                        } else {
                            setChainId(parseInt(chainId, 16))
                        }
                    }

                } else {
                    // if the provider is not detected, detectEthereumProvider resolves to null
                    // console.error('Please install MetaMask!')
                }
            })()
        }

    }, [window.ethereum, chain?.id, isUnSupportedSetFallback])
    return chainId;
}

export const useConnectedChain = ()=>{
    const chainId = useChainId();
    console.log('SUPPORTED_CHAINS',SUPPORTED_CHAINS)
    const connectedChain = SUPPORTED_CHAINS.find(item=>item.id === chainId)
    console.log('connectedChain',connectedChain)
    return connectedChain
}