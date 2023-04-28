import { Layout, Spin, App } from 'antd';
import React, { useMemo, useEffect, useState, useRef, Suspense } from "react";
import Menu from "../biz/menu";
import classNames from "classnames/bind";
import styles from "./index.scss";
const cx = classNames.bind(styles);
import renderRoutes from '@router/renderRoutes';
import useUpdateMenu from './useUpdateMenu';
import { useTranslation } from 'react-i18next';
const { Sider } = Layout;

export default ({ route }) => {
    const { t, i18n } = useTranslation();
    const updateMenu = useUpdateMenu();

    return (
        <>
            <Menu />
            {
                route.routes && renderRoutes(route.routes, updateMenu)
            }
        </>
    )
}