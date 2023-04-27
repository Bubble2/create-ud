import "@styles/fonts.scss";
import "@styles/common.scss";
import React, { useMemo, useEffect, useState, useRef } from "react";
import RootRouter from "@router/index";
import { useTranslation } from "react-i18next";
import { App, ConfigProvider, theme } from "antd";
import enUS from "antd/lib/locale/en_US";
import zhTW from "antd/lib/locale/zh_TW";
import darkTheme from '@constants/theme/dark';
import lightTheme from '@constants/theme/light';
import TokenListUpdater from '@components/biz/tokenListUpdater';
import TokenBalanceUpdater from '@components/biz/tokenBalanceUpdater';
import useChainMeetShare from '@hooks/useChainMeetShare';
import TransactionUpdater from '@components/biz/transactionUpdater';
import { StyleProvider, legacyLogicalPropertiesTransformer } from '@ant-design/cssinjs'

export default () => {
    const { t, i18n } = useTranslation();
    const [curTheme, setCurTheme] = useState('dark')
    useChainMeetShare();

    useEffect(() => {
        //不是这两个语言就用英文
        if (i18n.language !== "en" && i18n.language !== "zh-TW") {
            i18n.changeLanguage("en");
        }

        //链改变后刷新页面
        window.ethereum &&
            window.ethereum.on("chainChanged", (chainId) => {
                if (chainId) {
                    window.location.reload();
                }
            });
    }, []);

    return (
        <ConfigProvider locale={i18n.language === "zh-TW" ? zhTW : enUS} theme={curTheme === 'dark' ? darkTheme : lightTheme}>
            <StyleProvider transformers={[legacyLogicalPropertiesTransformer]}>
                <App>
                    <TokenListUpdater />
                    <TokenBalanceUpdater />
                    <TransactionUpdater />
                    <RootRouter />
                </App>
            </StyleProvider>
        </ConfigProvider>
    );
};

