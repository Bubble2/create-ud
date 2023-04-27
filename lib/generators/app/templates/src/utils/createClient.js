import { createClient, configureChains, } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { SUPPORTED_CHAINS } from '@constants/index'
import walletConnectLogo from '@images/walletConnect.png';
import metaMaskLogo from '@images/metaMask.png';

const { chains, provider, webSocketProvider } = configureChains(
    SUPPORTED_CHAINS,
    [
        alchemyProvider({ apiKey: 'Mz3L5P0RaClqKS2RFrxSF2y9IxOSkec-' }),
        infuraProvider({ apiKey: '7cc6d03a3f7b431cb319dcf7c2da9ab1' }),
        publicProvider()
    ],
    { targetQuorum: 1 }
)

export const metaMaskConnector = new MetaMaskConnector({
    chains
})

export const coinbaseWalletConnector = new CoinbaseWalletConnector({
    chains,
    options: {
        appName: 'wagmi',
    },
})

export const walletConnectConnector = new WalletConnectConnector({
    chains,
    options: {
        qrcode: true,
        // version: '2'
    },
})

export const injectedConnector = new InjectedConnector({
    chains,
    options: {
        name: (detectedName) =>
            `Injected (${typeof detectedName === 'string'
                ? detectedName
                : detectedName.join(', ')
            })`,
        shimDisconnect: true,
    },
})

export const SUPPORTED_WALLETS = [
    {
        connector: metaMaskConnector,
        id: 'metaMask',
        name: 'MetaMask',
        visible: true,
        installUrl: 'https://metamask.io/',
        description: 'Easy-to-use Brower Extension',
        logo: metaMaskLogo
    },
    {
        connector: coinbaseWalletConnector,
        id: 'coinbaseWallet',
        name: 'CoinbaseWallet',
        visible: false
    },
    {
        connector: walletConnectConnector,
        id: 'walletConnect',
        name: 'WalletConnect',
        visible: true,
        description: 'Scan with WalletConnect to connect',
        logo: walletConnectLogo
    },
    {
        connector: injectedConnector,
        id: 'injected',
        name: 'Injected',
        visible: false
    }
]

const connectors = SUPPORTED_WALLETS.map(item => item.connector);

const client = createClient({
    autoConnect: true,
    connectors,
    provider,
    webSocketProvider,
})

export default client;

