import React, { useEffect, useMemo, useRef } from 'react';
import { Button, Alert } from 'antd';
import classNames from "classnames/bind";
import styles from "./index.scss";
const cx = classNames.bind(styles);
import { useTranslation } from 'react-i18next';
import { useApprove, ApproveProps } from '@hooks/useApprove'

interface ApproveBtnProps extends ApproveProps {
    tokenName?: string
    children: React.ReactElement
    hideApproveBtn?: boolean  //不显示授权按钮
    hideApproveBtnWithFn?: boolean //不显示授权，但是具备授权功能
}

export default ({ tokenName, tokenAddress, spendAmount = 0, spenderAddress, children, hideApproveBtn, hideApproveBtnWithFn, ...restProps }: ApproveBtnProps) => {
    const onApproveSuccessRef = useRef()
    const { approveHandle, approvePending, allowance, isNeedApprove } = useApprove({ tokenAddress, spenderAddress, spendAmount }, { onSuccess: onApproveSuccessRef.current })
    const { t, i18n } = useTranslation();

    //不显示授权按钮，直接在原本按钮上加授权功能，授权完成后直接执行原本按钮操作
    if (hideApproveBtnWithFn) {
        if (hideApproveBtn || children?.props?.disabled || !isNeedApprove) {
            return React.cloneElement(children, {
                ...children.props,
                ...restProps
            })
        } else {
            const { loading: originLoading, onClick: originOnClick, ...otherOriginProps } = children.props;
            onApproveSuccessRef.current = originOnClick;
            return React.cloneElement(children, {
                ...otherOriginProps,
                ...restProps,
                loading: approvePending || originLoading,
                onClick: () => {
                    approveHandle?.()
                }
            })
        }
    }

    return (
        <>
            {
                hideApproveBtn || children?.props?.disabled || !isNeedApprove ?
                    React.cloneElement(children, {
                        ...children.props,
                        ...restProps
                    })
                    : (
                        <Button type="primary" {...restProps} size={children.props?.size} loading={approvePending} className={cx("btn-full", children.props.className)} onClick={() => approveHandle?.()}>approve{tokenName ? ' ' + tokenName : null}</Button>
                    )
            }
        </>
    )
}