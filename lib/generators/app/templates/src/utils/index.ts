import { AccountType, ObservationObject, ProductStatus, RiskLevel, KnockInOutStatus, ProductTypes, OBSERVATION_OBJECT, KnockFrequency, DemandStatus, DemandType, PERCENTAGE_RETENTION_PRECISION_FOR_WITHOUT_SYMBOL, PERCENTAGE_RETENTION_PRECISION_DELTA_FOR_WITHOUT_SYMBOL, OBSERVATION_PRICE_DECIMAL } from "@constants/index"
import dayjs from 'dayjs';
import { formatUnits } from '@ethersproject/units';
import { BigNumber } from "ethers";

export const getRiskLevel = (value: number | string): RiskLevel => {
    let val = Number(value)
    val = val * 100;
    if (val == 0) {
        return RiskLevel.None;
    } else if (val <= 60) {
        return RiskLevel.Safety
    } else if (val > 60 && val <= 80) {
        return RiskLevel.Nervous
    } else if (val > 80 && val < 100) {
        return RiskLevel.HighRisk
    } else {
        return RiskLevel.Liquidation
    }
}

/**
 * 生成产品名称
 * @param observationObject {ObservationObject} 观察标的
 * @param productId {string} 产品id
 * @return {string} 产品名称
 * **/
export const getProductName = (observationObject: ObservationObject, productId: string): string => {
    let slicedProductId;
    const productIdLen = productId?.length
    if (productIdLen > 6) {
        slicedProductId = productId?.slice(productIdLen - 6, productIdLen)
    } else {
        slicedProductId = productId;
    }
    return `${OBSERVATION_OBJECT[observationObject]}-${slicedProductId}`;
}


export const getInterestCalculationDays = (observeInitialDate: string | number) => {
    const observeInitialSt = dayjs(Number(observeInitialDate) * 1000)
    const res = Number(observeInitialDate) ? dayjs().diff(observeInitialSt, 'day') : 0; //计息时长,向下取整
    return res;
}

export interface ProductBaseData {
    id: string,  //产品id
    prodType: ProductTypes, //产品类型
    observationObject: ObservationObject, //观察标的
    totalAmount: number,  //募集总量
    minAmount: number,  //最小申购
    subscribedAmount: number, //已募集总量
    raisingEndTime: string, //募集到期时间=基准日
    productStatus: ProductStatus, //产品状态
    prodTerm: number, //产品期限
    lockupPeriod: number //锁定期
    investPeriod: number, //募集结束时长
    apr: number //apr
    knockinLevel: number  //敲入障碍价
    knockoutLevel: number //敲出障碍价
    outObserveFrequency: KnockFrequency //敲出观察频率
    inObserveFrequency: KnockFrequency//敲入观察频率
    issuerAddress: string //产品发行方地址
    breakevenRatio: number //保本比例
}
/**
 * 返回产品所需要的的所有数据
 * @param productId {string} 产品id
 * @param productDetails {[IssueParam, ProductStatus, issuerAddress, availAmount, investDeadline]} [新增产品的一堆字段，产品状态，发行方地址，剩余可用的募集数量，募集到期时间] getProductDetail获取的数据
*/
// struct IssueParam {
//     uint32 issueAmount; //募集总量
//     uint32 minInvestAmount; //最小申购数量
//     uint16 maxPrincipalLoss; //保本比例（合约要最大亏损）
//     uint16 apr; // apr  
//     uint16 knockinLevel; //敲入障碍价
//     uint16 knockoutLevel;  //敲出障碍价
//     uint16 maturity; //产品期限
//     uint16 lockupPeriod; //锁定期
//     uint8  investPeriod; //募集结束时长
//     uint8 outObserveFrequency; //敲出观察频率
//     uint8 inObserveFrequency;  //敲入观察频率
//     uint8 underlying; //观察标的 (1-BTC,2-ETH) 
// }
export const transformProductBaseData = (productId?: string, productDetails?: any[]): ProductBaseData | {} => {
    if (!productId || !productDetails) return {};
    const issueParam = productDetails?.[0] || [];  //新增产品的一堆字段见 struct IssueParam
    const productStatus = productDetails?.[1]; //产品状态
    const issuerAddress = productDetails?.[2].toString(); //发行方地址
    const availAmount = Number(formatUnits(productDetails?.[3], 6)); //剩余可用的募集数量
    const investDeadline = productDetails?.[4].toString(); //募集到期时间

    const totalAmount = issueParam[0]
    const minAmount = issueParam[1]
    const breakevenRatio = (PERCENTAGE_RETENTION_PRECISION_DELTA_FOR_WITHOUT_SYMBOL - issueParam[2]) / PERCENTAGE_RETENTION_PRECISION_DELTA_FOR_WITHOUT_SYMBOL //保本比例=（1-最大亏损）
    const apr = issueParam[3] / PERCENTAGE_RETENTION_PRECISION_DELTA_FOR_WITHOUT_SYMBOL || 0; //apr
    const knockinLevel = issueParam[4] / PERCENTAGE_RETENTION_PRECISION_DELTA_FOR_WITHOUT_SYMBOL || 0; //knockinLevel
    const knockoutLevel = issueParam[5] / PERCENTAGE_RETENTION_PRECISION_DELTA_FOR_WITHOUT_SYMBOL || 0; //knockoutLevel
    const prodTerm = issueParam[6]; //产品期限
    const lockupPeriod = issueParam[7]; //锁定期
    const investPeriod = issueParam[8]; //募集结束时长
    const outObserveFrequency = issueParam[9]; //敲出观察频率
    const inObserveFrequency = issueParam[10];  //敲入观察频率
    const observationObject = issueParam[11]; //观察标的
    const subscribedAmount = totalAmount - availAmount; //已经募集的数量（卖了多少产品）
    return {
        availAmount,
        id: productId,
        prodType: ProductTypes.SnowBall,
        observationObject,
        minAmount,
        totalAmount,
        subscribedAmount,
        raisingEndTime: investDeadline,
        productStatus,
        prodTerm,
        lockupPeriod,
        investPeriod,
        apr,
        knockinLevel,
        knockoutLevel,
        outObserveFrequency,
        inObserveFrequency,
        issuerAddress,
        breakevenRatio
    }
}

export interface ProductObserveData {
    knockInOutStatus: KnockInOutStatus //敲入敲出状态
    observeInitialDate: number //观察期基准日,起始日期
    expirationTime: string //到期时间
    interestCalculationDays: number, //计息时长
    interestAmount: number //计息
}
// struct ObserveParam{
//     uint64  initialDate;         
//     uint64  knockinDate;         
//     uint64  knockOutDate;  
//     uint64  settleDate; 
//     bool    knockIn;              
//     bool    knockOut;   
//     uint256 initialPrice;        
//     uint256 settlementPrice;  
//     uint256 knockInPrice; 
// }
/**
 * 返回产品所需要的的所有数据
 * @param productBaseData {ProductBaseData} 产品基础数据
 * @param productObeserveData {ObserveParam} getObeserveDetail获取的数据
 * @return {ProductObserveData} 产品所有数据
*/

export const transformProductObserveData = (productBaseData?: ProductBaseData, productObeserveData?: any[]): ProductObserveData | {} => {
    if (!productBaseData || !productObeserveData) return {};
    const observeInitialDate = productObeserveData?.[0].toString() //基准日
    const knockStatus = productObeserveData?.[5] ? KnockInOutStatus.TapOut : productObeserveData?.[4] ? KnockInOutStatus.TapIn : KnockInOutStatus.TapNot; //敲出 || 敲入 || -
    const expirationTime = Number(observeInitialDate)?dayjs.unix(Number(observeInitialDate)).add(productBaseData.prodTerm, 'day').format('YYYY-MM-DD HH:mm:ss'):'';  //到期日期=基准日+产品期限
    const interestCalculationDays = getInterestCalculationDays(observeInitialDate); //计息时长
    //计息
    const interestAmount = productBaseData.totalAmount * productBaseData.apr * interestCalculationDays / 365 //计息

    return {
        knockInOutStatus: knockStatus, //敲入敲出状态
        expirationTime,
        observeInitialDate,
        interestCalculationDays, //计息时长
        interestAmount
    }
}


export interface ProductPosDataForSeller {
    profitLoss: number //持仓盈亏
    accountType: AccountType //账户类型
    pos: number //持仓数量
    openingMargin: number //开仓保证金
    maintenanceMargin: number, //维持保证金
    cancelledCompensation: number //撤销补偿
    liquidatedCompensation: number//清算补偿
    transactionFee: number //交易撮合费
    matched: boolean //是否是需求撮合
}

// struct ProductSummary{
//     uint64   pos;                 // 持仓
//     uint64   refundAmount;        // 买家撤销手续费总额
//     uint64   fineAmount;          // 买家清算罚金
//     uint64   issueMargin;         // 发布保证金
//     uint64   maintain;
//     bool     byWallet;            // 钱包账户发布
//     uint256  profitRate;          // 结算盈利利率 --卖家
//     uint256  lossRate;            // 结算亏损利率 --卖家
//     uint256  feeRate;             // 结算撮合利率 --卖家
//     bool      matched             //是否是需求撮合
// } 
/**
 * 返回产品所需要的的所有数据
 * @param productBaseData {ProductBaseData} 产品基础数据
 * @param productObeserveData {ObserveParam} getObeserveDetail获取的数据
 * @param productPosData {ProductSummary} getPos获取的数据
 * @return {ProductPosDataForSeller}
*/
export const transformProductPosDataForSeller = (productBaseData?: ProductBaseData, productObeserveData?: any[], productPosData?: any[]): ProductPosDataForSeller | {} => {
    if (!productBaseData || !productObeserveData || !productPosData) return {}
    const pos = Number(formatUnits(productPosData?.[0], 6)) //持仓（实际募集到的总额）
    const cancelledCompensation = Number(formatUnits(productPosData?.[1], 6)) //撤销补偿
    const liquidatedCompensation = Number(formatUnits(productPosData?.[2], 6)) //清算补偿
    const openingMargin = Number(formatUnits(productPosData?.[3], 6)) //开仓保证金
    const maintenanceMargin = Number(formatUnits(productPosData?.[4], 6)) //维持保证金
    const byWallet = productPosData?.[5] //是否用钱包支付
    const profitRate = Number(formatUnits(productPosData?.[6], 18))  //盈利率
    const lossRate = Number(formatUnits(productPosData?.[7], 18)) //亏利率
    const feeRate = Number(formatUnits(productPosData?.[8], 18)) //结算撮合利率
    const matched = productPosData?.[9] //是否是需求撮合

    const transactionFee = -(pos * feeRate) //交易撮合费 = 持仓*结算撮合利率
    const profitLossRate = profitRate || -lossRate || 0; //盈亏率
    const accountType = byWallet ? AccountType.WalletAccount : AccountType.PledgeAccount

    const observeInitialDate = productObeserveData?.[0].toString() //基准日

    const interestCalculationDays = getInterestCalculationDays(observeInitialDate); //计息时长

    //观察期：盈亏= - 募集总量 * APR *（当前时间-基准日）/365
    //其他状态：盈亏=接口获取
    let profitLoss = 0;
    if (productBaseData.productStatus === ProductStatus.Observation) {
        profitLoss = -(productBaseData.totalAmount * productBaseData.apr * interestCalculationDays / 365)
    } else {
        profitLoss = pos * profitLossRate; //持仓*盈亏率
    }

    return {
        profitLoss, //盈亏,累计计息
        accountType, //账户类型
        pos, //持仓
        openingMargin, //开仓保证金
        maintenanceMargin, //维持保证金
        cancelledCompensation, //撤销补偿
        liquidatedCompensation,//清算补偿
        transactionFee, //交易撮合费
        matched, //是否是需求撮合
    }
}


export interface ProductPosDataFoBuyer {
    productId: string //产品id
    accountType: AccountType //账户类型
    pos: number //持仓数量
    openingMargin: number //开仓保证金
    maintenanceMargin: number, //维持保证金
    transactionFee: number //交易撮合费
}


// struct InvestPos{
//     bytes32  productId;         
//     uint256  wpos;  
//     bool     byWallet;
//     uint256  open;
//     uint256  maintain;
//     uint256  profitRate;
//     uint256  lossRate;
//     uint256  feeRate;    
// }
/**
 * 返回产品所需要的的所有数据
 * @param productPosData {ProductSummary} getInvestorPos获取的数据
 * @return {ProductPosDataFoBuyer}
*/
export const transformProductPosDataForBuyer = (productPosData?: any[]): ProductPosDataFoBuyer | {} => {
    if (!productPosData) return {};
    const productId = productPosData?.[0].toString()
    const pos = Number(formatUnits(productPosData?.[1], 6)) //持仓（实际募集到的总额）
    const byWallet = productPosData?.[2] //是否用钱包支付
    const openingMargin = Number(formatUnits(productPosData?.[3], 6)) //开仓保证金
    const maintenanceMargin = Number(formatUnits(productPosData?.[4], 6)) //维持保证金
    const feeRate = Number(formatUnits(productPosData?.[7], 18)) //结算撮合利率

    const transactionFee = -(pos * feeRate) //交易撮合费 = 持仓*结算撮合利率

    const accountType = byWallet ? AccountType.WalletAccount : AccountType.PledgeAccount


    return {
        productId,
        accountType, //账户类型
        pos, //持仓面值
        openingMargin, //开仓保证金
        maintenanceMargin, //维持保证金
        transactionFee, //交易撮合费
    }
}


export interface ProductOtherDataForBuyer {
    profitLoss: number //持仓盈亏
    cancelledCompensation: number //撤销补偿
    liquidatedCompensation: number//清算补偿
}
/**
 * 返回产品所需要的的所有数据
 * @param productBaseData {ProductBaseData} 产品基础数据
 * @param productObeserveData {ObserveParam} getObeserveDetail获取的数据
 * @param productPosData {ProductSummary} getInvestorPos获取的数据
 * @return {ProductOtherDataForBuyer}
*/
export const transformProductOtherDataForBuyer = (productBaseData?: ProductBaseData, productObeserveData?: any[], productPosData?: any[]): ProductOtherDataForBuyer | {} => {
    if (!productBaseData || !productObeserveData || !productPosData) return {};
    const pos = Number(formatUnits(productPosData?.[1], 6)) //持仓（实际募集到的总额）
    const profitRate = Number(formatUnits(productPosData?.[5], 18))  //盈利率
    const lossRate = Number(formatUnits(productPosData?.[6], 18)) //亏利率

    const observeInitialDate = Number(productObeserveData?.[0].toString()) //基准日

    const interestCalculationDays = getInterestCalculationDays(observeInitialDate); //计息时长
    const profitLossRate = profitRate || -lossRate || 0; //盈亏率

    //观察期：盈亏= - 募集总量 * APR *（当前时间-基准日）/365
    //其他状态：盈亏=接口获取
    let profitLoss = 0;
    if (productBaseData.productStatus === ProductStatus.Observation) {
        profitLoss = (productBaseData.totalAmount * productBaseData.apr * interestCalculationDays / 365)
    } else {
        profitLoss = pos * profitLossRate; //持仓*盈亏率
    }

    let liquidatedCompensation = 0 //清算补偿 = 持仓盈亏 * 7% * 50%(对手清算状态下)
    if (productBaseData.productStatus === ProductStatus.CounterpartyClearing) {
        liquidatedCompensation = profitLoss * 0.07 * 0.5;
    }
    let cancelledCompensation = 0 //撤销补偿=面值* 0.1%(已撤销状态下)
    if (productBaseData.productStatus === ProductStatus.Rescinded) {
        cancelledCompensation = pos * 0.001
    }

    return {
        profitLoss, //盈亏
        cancelledCompensation, //撤销补偿
        liquidatedCompensation,//清算补偿
    }
}




export interface ProductDataForDetail {
    initialPrice: number //基准价
    knockoutLevelPrice: number //敲出障碍价
    knockinLevelPrice: number//敲入障碍价
    knockInStatus: KnockInOutStatus //敲入状态
    knockOutStatus: KnockInOutStatus //敲出状态
    knockinPrice: number //敲出价
    knockoutPrice: number//敲入价
    knockinDate: string //敲入日期
    knockoutDate: string //敲出日期
    nextObservationDateForKnockin: string, //敲入下次观察日期
    nextObservationDateForKnockOut: string //敲出下次观察日期
}

/**
 * 返回产品详情页特有数据
 * @param productBaseData {ProductBaseData} 产品基础数据
 * @param productObeserveData {ObserveParam} getObeserveDetail获取的数据
 * @param productPosData {ProductSummary} getPos获取的数据
 * @return {ProductDataForDetail} 详情页产品数据
*/
// struct ObserveParam{
//     uint64  initialDate;         
//     uint64  knockinDate;         
//     uint64  knockOutDate;  
//     uint64  settleDate; 
//     bool    knockIn;              
//     bool    knockOut;   
//     uint256 initialPrice;        
//     uint256 settlementPrice;  
//     uint256 knockInPrice; 
// }
export const transformProductDataForDetail = (productBaseData?: ProductBaseData, productObeserveData?: any[], productPosData?: any[]): ProductDataForDetail | {} => {
    if (!productBaseData || !productObeserveData || !productPosData) return {};
    const initialPrice = Number(formatUnits(productObeserveData?.[6], OBSERVATION_PRICE_DECIMAL))
    const knockoutLevelPrice = productBaseData.knockoutLevel * initialPrice;
    const knockinLevelPrice = productBaseData.knockinLevel * initialPrice;
    const knockinDateOrigin = productObeserveData?.[1].toString()
    const knockoutDateOrigin = productObeserveData?.[2].toString()
    const knockInStatus = productObeserveData?.[4] ? KnockInOutStatus.TapIn : KnockInOutStatus.TapNot
    const knockOutStatus = productObeserveData?.[5] ? KnockInOutStatus.TapOut : KnockInOutStatus.TapNot
    const knockoutPrice = Number(formatUnits(productObeserveData?.[7], OBSERVATION_PRICE_DECIMAL));
    const knockinPrice = Number(formatUnits(productObeserveData?.[8], OBSERVATION_PRICE_DECIMAL));
    let knockinDate = '';
    let knockoutDate = '';
    let nextObservationDateForKnockin = ''
    let nextObservationDateForKnockOut = ''
    //已敲入
    if (knockInStatus === KnockInOutStatus.TapIn) {
        knockinDate = knockinDateOrigin
    } else {
        nextObservationDateForKnockin = knockinDateOrigin
    }

    //已敲出
    if (knockOutStatus === KnockInOutStatus.TapOut) {
        knockoutDate = knockoutDateOrigin
    } else {
        nextObservationDateForKnockOut = knockoutDateOrigin;
    }

    return {
        initialPrice,
        knockoutLevelPrice,
        knockinLevelPrice,
        knockInStatus,
        knockOutStatus,
        knockinPrice,
        knockoutPrice,
        knockinDate,
        knockoutDate,
        nextObservationDateForKnockin,
        nextObservationDateForKnockOut
    }
}


export interface DemandData {
    demandId: string //需求id
    demandType: DemandType //需求类型
    faceValue: number //需求金额
    term: number // 需求期限
    offerEndTime: number // 需求发布时长
    retfee: number //撤销手续费
    demandStatus: DemandStatus // 理财需求状态
    publisherAddress: string // 发布者
    accountType: AccountType //账户类型
    productId: string | boolean, //产品id
    knockInLevel: number //敲入障碍价
    knockOutLevel: number //敲出障碍价
    knockOutTerm: KnockFrequency // 敲出观察周期
    knockInTerm: KnockFrequency // 敲入观察周期
    minApy: number // 最小apy
    maxApy: number //最大apy
    breakevenRatio: number //保本比例
    observationObject: ObservationObject //观察标的
}
// struct SnowBallNeed {
//            uint256 needID;// 需求ID
//             uint256 value;// 需求金额
//             uint256 term; // 需求期限
//             uint256 duration; // 需求发布时长
//             uint256 retfee  // 撤销手续费
//             SnowBalLNeedState state; // 理财需求状态
//             address publisher; // 发布者
//             bool isWalLetAccount; // 是否是钱包账户
//             bytes32 productId;
// }
// struct SnowBallNeedParam {
//     uint256 knockInPrice; // 敲入障碍价
//     uint256 knockOutPrice; // 敲出障碍价
//     uint256 knockOutTerm; // 敲出观察周期
//     uint256 knockInTerm; // 敲入观察周期
//     uint256 minApy; // 最小apy
//     uint256 maxApy; // 最大apy
//     uint256 percentPrincipal; // 保本比例
//     uint256 target; // 观察标的(1-BTC 2-ETH)
// }
/**
 * 返回需求所需要的的数据
 * @param demandData {SnowBallNeed} 需求数据
 * @param demandParamData {SnowBallNeedParam} 需求基础数据
 * @return {DemandData}
*/
export const transformDemandData = (demandData?: any[], demandParamData?: any[]): DemandData | {} => {
    if (!demandData || !demandParamData) return {};
    const demandId = demandData?.[0].toString();
    const faceValue = Number(formatUnits(demandData?.[1].toString(), 6));
    const term = Number(demandData?.[2].toString());
    const offerEndTime = demandData?.[3].toString();
    const retfee = Number(formatUnits(demandData?.[4].toString(), 6));
    const demandStatus = demandData?.[5];
    const publisherAddress = demandData?.[6];
    const accountType = demandData?.[7] ? AccountType.WalletAccount : AccountType.PledgeAccount;
    const productId = BigNumber.from(demandData?.[8]).isZero() ? false : demandData?.[8]

    const knockInLevel = Number(formatUnits(demandParamData?.[0], PERCENTAGE_RETENTION_PRECISION_FOR_WITHOUT_SYMBOL))
    const knockOutLevel = Number(formatUnits(demandParamData?.[1], PERCENTAGE_RETENTION_PRECISION_FOR_WITHOUT_SYMBOL))
    const knockOutTerm = Number(demandParamData?.[2].toString())
    const knockInTerm = Number(demandParamData?.[3].toString())
    const minApy = Number(formatUnits(demandParamData?.[4], PERCENTAGE_RETENTION_PRECISION_FOR_WITHOUT_SYMBOL))
    const maxApy = Number(formatUnits(demandParamData?.[5], PERCENTAGE_RETENTION_PRECISION_FOR_WITHOUT_SYMBOL))
    const breakevenRatio = Number(demandParamData?.[6].toString())
    const observationObject = Number(demandParamData?.[7].toString())

    return {
        demandId,
        demandType: DemandType.SnowBall,
        faceValue,
        term,
        offerEndTime,
        retfee,
        demandStatus,
        publisherAddress,
        accountType,
        productId,
        knockInLevel,
        knockOutLevel,
        knockOutTerm,
        knockInTerm,
        minApy,
        maxApy,
        breakevenRatio,
        observationObject,
    }
}