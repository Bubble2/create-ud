import { NATIVE_TOKEN_ADDRESS } from "../index"
import { AllTokenList } from "./index"

export const TOKEN_LIST: AllTokenList[] = [
    {
        displayName: "ETH",
        address: NATIVE_TOKEN_ADDRESS,
        priceName: "ethereum",
    },
    {
        displayName: 'USDC',
        address: '0x65aFADD39029741B3b8f0756952C74678c9cEC93',
        priceName: "usd-coin",
    },
    {
        address: '0xDeAf1689e035A402D77EA05d753ee9793d6f1fe5',
        displayName: 'USDT',
        priceName: "tether",
    },
    {
        address: '0xBa8DCeD3512925e52FE67b1b5329187589072A55',
        displayName: 'DAI',
        priceName: "dai",
    },
    {
        address: '0x45AC379F019E48ca5dAC02E54F406F99F5088099',
        displayName: 'WBTC',
        priceName: "wrapped-bitcoin",
    },
    {
        address: '0xCCB14936C2E000ED8393A571D15A2672537838Ad',
        displayName: 'WETH',
        priceName: "weth",
    }
]

