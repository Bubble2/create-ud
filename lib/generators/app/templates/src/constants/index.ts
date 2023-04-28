<%if (fnFeatures.includes('web3')){%>
import { avalanche, bsc, mainnet, goerli } from 'wagmi/chains'

//支持的链
export const SUPPORTED_CHAINS_PRODUCTION = [goerli]
export const SUPPORTED_CHAINS_DEV = [goerli]
export const SUPPORTED_CHAINS =
    process.env.NODE_ENV === 'production' ? SUPPORTED_CHAINS_PRODUCTION : SUPPORTED_CHAINS_DEV;

//支持的链id
export const SUPPORTED_CHAIN_IDS_PRODUCTION = SUPPORTED_CHAINS_PRODUCTION.map(item => item.id);
export const SUPPORTED_CHAIN_IDS_DEV = SUPPORTED_CHAINS_DEV.map(item => item.id);
export const SUPPORTED_CHAIN_IDS =
    process.env.NODE_ENV === 'production' ? SUPPORTED_CHAIN_IDS_PRODUCTION : SUPPORTED_CHAIN_IDS_DEV;

//当没有检测到任何钱包注入对象，或者连接错误网络时显示默认链
export const DEFAULT_CHAIN_ID = goerli.id;

//交易状态
export enum TransactionStatus{
    Pending,
    Success,
    Failure
} 

//主币地址
export const NATIVE_TOKEN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
<%}%>