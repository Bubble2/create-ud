import React, { useState, useEffect, useMemo, useCallback } from 'react'
import styles from './index.scss'
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
import { Input, InputProps as AntdInputProps } from 'antd';
import { parseUnits, formatUnits } from '@ethersproject/units';
import { fixedDecimals } from '@utils/format';


type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;
type InputNumberProps = Merge<
    AntdInputProps,
    {
        onSetMax?: boolean | ((value: number) => void);
        onChange?: (value: number | string) => void;
        value?: string;
        min?: number | string;
        max?: number | string;
        precision?: number;
    }
>;

const numberValid = (val: string) => {
    const reg = /^\d*(\.\d*)?$/;
    return reg.test(val)
}

const precisionValid = (val: string, precision: number) => {
    const reg = new RegExp(`^[0-9]*(\\.[0-9]{0,${precision}})?$`)
    return reg.test(val)
}

//最小值校验
const minValid = (val: string, min: number | string, decimals: number) => {
    const valBn = parseUnits(val, decimals)
    const minBn = parseUnits(min.toString(), decimals)
    if (valBn.gte(minBn)) {
        return true
    }
    return false;
}

//最大值校验
const maxValid = (val: string, max: number | string, decimals: number) => {
    const valBn = parseUnits(val, decimals)
    const minBn = parseUnits(max.toString(), decimals)
    if (valBn.lte(minBn)) {
        return true
    }
    return false;
}

//值不为空
const valNotEmpty = (val: string) => {
    return val !== undefined && val !== ''
}

export default (props: InputNumberProps) => {
    const { onSetMax = false, onChange, value, min, max, precision, ...restProps } = props;
    const [innerValue, setInnerValue] = useState<string | number>();
    let minStr = min?.toString();
    let maxStr = max?.toString();
    const decimals = precision ?? 18;
    //防止传入的是小数点后很多位的截取掉
    minStr = minStr ? fixedDecimals(minStr, decimals) : minStr;
    maxStr = maxStr ? fixedDecimals(maxStr, decimals) : maxStr;
    minStr = maxStr ? String(Math.min(Number(minStr), Number(maxStr))) : minStr; //最小值肯定是最大值和最小值中最小的（此处防止最大值小于最小值情况）


    const changeHandleInner = (value: number | string)=>{
        if ("onChange" in props && onChange) {
            onChange(value);
        }
        if(!('value' in props)) {
            setInnerValue(value)
        }
    }

    const changeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value: inputValue } = e.target;
        let newValue = inputValue;

        //去除精度后面得数字
        newValue = Number(newValue) ? fixedDecimals(newValue, decimals) : newValue
        
        //输入超过最大值自动变成最大值
        if (maxStr && valNotEmpty(newValue)) {
            if (parseUnits(newValue, decimals).gt(parseUnits(maxStr, decimals))) {
                newValue = maxStr;
            }
        }

        if (validateHandle(newValue)) {
            //字符串转成数字后（有值&&最后一位不为点）=》转数字，否则字符串
            const numberedValue = Number(newValue) && (!/\.$/.test(newValue)) ? Number(newValue) : newValue;
            changeHandleInner(numberedValue)
        }
    }


    const blurHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('e', e.target.value)
        const { value: inputValue } = e.target;
        const reg = /^\d*(\.)$/;
        let trimDotValue = inputValue;

        // //输入小于最小值自动变成最小值
        if (minStr && valNotEmpty(trimDotValue)) {
            if (parseUnits(trimDotValue, decimals).lt(parseUnits(minStr, decimals))) {
                trimDotValue = minStr;
            }
        }

        //将后缀只有一个点去除，eg 3.=>3
        if (reg.test(trimDotValue)) {
            trimDotValue = trimDotValue.replace('.', '')
        }

        //转数字
        const numberedValue = trimDotValue ? Number(trimDotValue) : trimDotValue;
        changeHandleInner(numberedValue)
    }

    const setMaxHandle = () => {
        if (maxStr) {
            const maxNumber = Number(maxStr);
            if ("onSetMax" in props && onSetMax && typeof onSetMax === 'function') {
                onSetMax(maxNumber);
            }

            changeHandleInner(maxNumber)
        }
    }

    //校验输入
    const validateHandle = useCallback((val) => {
        let flag = false;
        //啥都没有直接为真
        if (!valNotEmpty(val)) {
            return true;
        }

        //是否为数字校验
        if (numberValid(val)) {
            flag = true;
        } else {
            return false;
        }

        //是否大于最小值
        // if (minStr !== undefined) {
        //     if (valNotEmpty(val) && minValid(val, minStr, decimals)) {
        //         flag = true;
        //     } else {
        //         return false;
        //     }
        // }


        //是否大于最小值
        if (maxStr !== undefined) {
            if (valNotEmpty(val) && maxValid(val, maxStr, decimals)) {
                flag = true;
            } else {
                return false;
            }
        }


        //校验小数点后面精度
        if (precision !== undefined) {
            if (precisionValid(val, precision)) {
                flag = true;
            } else {
                return false;
            }
        }

        return flag;
    }, [minStr, maxStr])


    //外部有value传入则使用外部的value，否则使用自身的value
    const mergedValue = useMemo(()=>{
        if('value' in props){
            return value
        }else{
            return innerValue;
        }
    }, [value, innerValue])


    //input属性
    const inputProps = {
        className: styles["input-number"],
        onChange: changeHandle,
        onBlur: blurHandle,
        value: mergedValue,
        type: 'number',
        ...restProps
    }

    //设置最大值
    if (onSetMax) {
        inputProps.suffix = <div className={styles["set-max"]} onClick={setMaxHandle}>MAX</div>
    }

    return (
        <div className={styles["input-number-container"]}>
            <Input {...inputProps} />
        </div>
    )
}
