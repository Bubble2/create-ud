import { mainnet, goerli } from 'wagmi'
export default {
    [mainnet.id]: {
        valult: "0xa5165F162eD4d5c288DE0E137eaf62f462EDee36"
    },
    [goerli.id]: {
        valult: "0xa5165F162eD4d5c288DE0E137eaf62f462EDee36"
    },
    [`${goerli.id}test`]: {//
        valult: "0xa5165F162eD4d5c288DE0E137eaf62f462EDee36"
    }
}

