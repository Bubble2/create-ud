import { TFunction } from 'react-i18next'


/**
 * 判断字符串是否是空值 ex:0x0000000000000

 */
export function isZero(hexNumberString: string) {
    return /^0x0*$/.test(hexNumberString)
}
/**
 * 金额格式化
 *
 * @param x 要格式化的金额
 * @param precision 保留几位小数。默认为2
 * @param noZero 小数位是否要补0 true：不需要补0  false：需要补0
 * @param delta 偏移量 默认为1不做偏移
 * @returns {*}
 */
export const formatCurrency = (num: string | number, precision: number = 2, noZero: boolean = false, delta: number = 1) => {
    // num = num || 4;
    if (num === undefined || num === "") return "";
    noZero = noZero || false;
    let x: number | string = Number(num) * delta;
    let f: string | number = parseFloat(x.toString());
    if (isNaN(f)) {
        return;
    }

    x = scientificNotationToString(x);

    var parts = x.toString().split('.');
    var integerPart = parts[0];
    var decimalPart = parts[1];
    if (decimalPart) {
        decimalPart = decimalPart.slice(0, precision);
    }
    var resolvedParts = parseFloat(decimalPart) ? integerPart + '.' + decimalPart : integerPart;
    f = resolvedParts;
    // var powNum = Math.pow(10, precision);
    // f = Math.floor(x * powNum) / powNum;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    if (!noZero) {
        while (s.length <= rs + precision) {
            s += '0';
        }
    }

    var ableAmountSplit = s.split('.');
    var ableAmountInteger = ableAmountSplit[0];
    var ableAmountDecimals = ableAmountSplit[1];
    for (var i = 0; i < Math.floor((ableAmountInteger.length - (1 + i)) / 3); i++) {
        ableAmountInteger =
            ableAmountInteger.substring(0, ableAmountInteger.length - (4 * i + 3)) +
            ',' +
            ableAmountInteger.substring(ableAmountInteger.length - (4 * i + 3));
    }
    if (ableAmountInteger.indexOf('-,') > -1) {
        ableAmountInteger = ableAmountInteger.replace('-,', '-');
    }
    if (ableAmountDecimals && ableAmountDecimals.length > 0) {
        return ableAmountInteger + '.' + ableAmountDecimals;
    } else {
        return ableAmountInteger;
    }
};

export const formatToUsd = (value: string | number, decimal: number = 2, noZero?: boolean, delta?: number) => {
    return (value !== undefined && value !== "") ? '$' + formatCurrency(value || 0, decimal, noZero, delta) : "";
};

export const formatToPercent = (value: string | number, decimal: number = 2, delta: number = 100) => {
    return (value !== undefined && value !== "") ? parseFloat((Number(value) * delta).toString()).toFixed(decimal) + '%' : "";
};

/**
 * 文字中间设置省略号
 */
export const formatStrMiddleEllipsis = (
    text = '',
    firstLen = 6,
    lastLen = 4
) => {
    if (text.length > lastLen + firstLen) {
        let all = text.length;
        let last = text.substring(all - lastLen);
        let first = text.substring(0, firstLen);
        return first + '...' + last;
    } else {
        return text;
    }
};

export const formatDate = (
    datetime: number | string,
    dateJoinSymbol = '/',
    accurateToSeconds = false,
    timeJoinSymbol = ':'
) => {
    if (!datetime) return;
    const date = new Date(Number(datetime)); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const year = date.getFullYear(),
        month = ('0' + (date.getMonth() + 1)).slice(-2),
        sdate = ('0' + date.getDate()).slice(-2),
        hour = ('0' + date.getHours()).slice(-2),
        minute = ('0' + date.getMinutes()).slice(-2),
        second = ('0' + date.getSeconds()).slice(-2);
    // 拼接
    let result = `${year}${dateJoinSymbol}${month}${dateJoinSymbol}${sdate}`;
    if (accurateToSeconds) {
        result = `${result} ${hour}${timeJoinSymbol}${minute}${timeJoinSymbol}${second}`;
    }
    // 返回
    return result;
};

export const getBase64 = (file: Blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

/*
    秒转天
    @params {number} 秒
    @return {number} 天
*/
export const secondToDay = (second: number) => {
    return second / 60 / 60 / 24;
};

export const monthDayDiff = (startTime: string | number | Date, endTime: string | number | Date) => {
    // this指针
    let flag = [1, 3, 5, 7, 8, 10, 12, 4, 6, 9, 11, 2];
    let start = new Date(startTime);
    let end = new Date(endTime);
    let year = end.getFullYear() - start.getFullYear();
    let month = end.getMonth() - start.getMonth();
    let day = end.getDate() - start.getDate();
    if (month < 0) {
        year--;
        month = end.getMonth() + (12 - start.getMonth());
    }
    if (day < 0) {
        month--;
        let index = flag.findIndex(temp => {
            return temp === start.getMonth() + 1;
        });
        let monthLength;
        if (index <= 6) {
            monthLength = 31;
        } else if (index > 6 && index <= 10) {
            monthLength = 30;
        } else {
            monthLength = 28;
        }
        day = end.getDate() + (monthLength - start.getDate());
    }
    const dateResult = [year, month, day];
    return dateResult;
};

export function getWeek(timeStampMs: string | number | Date, t: TFunction) {
    let week;
    const weeks = [
        t('common.Sun'),
        t('common.Mon'),
        t('common.Tue'),
        t('common.Wed'),
        t('common.Thu'),
        t('common.Fri'),
        t('common.Sat')
    ];
    const date = new Date(timeStampMs);
    week = weeks[date.getDay()];
    return week;
}

//e+8=>'100000000'
export function scientificNotationToString(param: number): string {
    let strParam = String(param);
    let flag = /e/.test(strParam);
    if (!flag) return param.toString();

    // 指数符号 true: 正，false: 负
    let sysbol = true;
    if (/e-/.test(strParam)) {
        sysbol = false;
    }
    // 指数
    let index = Number(strParam.match(/\d+$/)?.[0]);
    // 基数
    let basis = strParam.match(/^[\d.]+/)?.[0].replace(/\./, '');

    let result;
    if (sysbol) {
        result = basis?.padEnd(index + 1, '0');
    } else {
        result = basis?.padStart(index + basis.length, '0').replace(/^0/, '0.');
    }
    return result || "";
}

function valueToPeriod(value: number) {
    let denominator, unit;
    if (value < 1000) {
        denominator = 1;
        unit = '';
    } else if (value < 1000000) {
        denominator = 1000;
        unit = 'K';
    } else if (value < 100000000) {
        denominator = 1000000;
        unit = 'M';
    } else {
        denominator = 100000000;
        unit = 'B';
    }
    return {
        denominator,
        unit
    };
}

/*纵坐标单位规律：
大于3位单位为k；
大于6位单位为M；
大于8位单位位B*/
export function formatMoney(value: number, maxValue?: number) {
    const { denominator, unit } = valueToPeriod(maxValue || value);
    return formatCurrency(value / denominator, 2) + '' + (value > 0 ? unit : '');
}

/**
 * 毫秒转成固定的日期文案
 * @params {number} millisecond 毫秒
 * @params {function} t 国际化
 * @params {number} minUnit 最小单位
 * @params {number} maxUnit 最大单位
 * minUnit或minUnit ：second: 0
 *                    minute: 1
 *                    hour:   2
 *                    day:    3
 *                    month:  4
 * @return {string} 小于1小时=> xx minutes， 小24小时=> xx hours，小30天=> xx days，否则 xx months
 */
export function formatTimeToDays(millisecond: number, t: TFunction, minUnit: number = 1, maxUnit: number = 4) {
    const Hour1 = 1000 * 60 * 60; //一小时
    const Hour24 = Hour1 * 24; //24小时
    const Day30 = Hour24 * 30;
    let returnStr = '';
    if ((minUnit <= 1 && millisecond < Hour1) || (maxUnit === 1 && millisecond >= Hour1)) {
        //显示到分钟
        returnStr = `${Math.ceil(millisecond / 1000 / 60)} ${t('common.minutes')}`;
    } else if ((minUnit <= 2 && millisecond < Hour24) || (maxUnit === 2 && millisecond >= Hour1)) {
        //显示到小时
        returnStr = `${Math.ceil(millisecond / 1000 / 60 / 60)} ${t('common.hours')}`;
    } else if ((minUnit <= 3 && millisecond < Day30) || (maxUnit === 3 && millisecond >= Day30)) {
        //显示到天
        returnStr = `${Math.ceil(millisecond / 1000 / 60 / 60 / 24)} ${t('common.days')}`;
    } else if (minUnit <= 4 || maxUnit >= 4) {
        //显示到月
        returnStr = `${Math.ceil(millisecond / 1000 / 60 / 60 / 24 / 30)} ${t('common.months')}`;
    }
    return returnStr;
}

/**
 * //去掉日期数据中的T 和Z
 */
export function dateUtc2Local(date_time: string | number | Date) {
    // const date = new Date(+new Date(date_time)).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    const date = new Date(date_time);
    return date;
}

export function parseFromMillion(num: number) {
    return num / 100;
}


/* 
* url 目标url 
* arg 需要替换的参数名称 
* arg_val 替换后的参数的值 
* return url 参数替换后的url 
*/
export function changeURLArg(url: string, arg: string, arg_val: string) {
    var pattern = arg + '=([^&]*)';
    var replaceText = arg + '=' + arg_val;
    if (url.match(pattern)) {
        var tmp = '/(' + arg + '=)([^&]*)/gi';
        tmp = url.replace(eval(tmp), replaceText);
        return tmp;
    } else {
        if (url.match('[\?]')) {
            return url + '&' + replaceText;
        } else {
            return url + '?' + replaceText;
        }
    }
}

/**
 * 保留小数
 * @param val {string | number} 数值
 * @param decimals 保留的位数
*/
export const fixedDecimals = (val: string | number, decimals: number): string => {
    if (!val || !decimals) return String(val);
    const splitVal = String(val).split('.')
    const intVal = splitVal[0];
    let decimalVal = splitVal[1];
    let res;
    if (decimalVal && decimalVal.length > decimals) { //超出精度，截取
        res = Number(val).toFixed(decimals)
    } else if (decimalVal || splitVal.length > 1) { //有小数位，或者只有一个点合并
        res = intVal + '.' + decimalVal
    } else { //整数
        res = intVal
    }
    return res;
}