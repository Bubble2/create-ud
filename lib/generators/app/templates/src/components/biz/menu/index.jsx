import React, { useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { Layout, Menu, App } from 'antd';
import styles from './index.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
import { useDispatch, useSelector } from 'react-redux';
import { updateOpenMenuKeys } from '@state/routeSlice'
import { useTranslation } from "react-i18next";

export default () => {
    const { t, i18n } = useTranslation();

    const getItem = (label, key) => {
        return {
            key,
            label
        };
    }
    const items = [
        getItem(<Link to={'/'}>index</Link>, '/index'),
        getItem(<Link to={'/list'}>list</Link>, '/list'),
    ];

    const dispatch = useDispatch()
    const menuKeys = useSelector(state => state.routeSlice.menuKeys)
    const { openMenuKeys, selectedMenuKeys } = menuKeys

    const onOpenChange = (openKeys) => {
        dispatch(updateOpenMenuKeys({ openMenuKeys: openKeys }))
    }

    return (
        <>
            <Menu
                onOpenChange={onOpenChange}
                openKeys={openMenuKeys}
                selectedKeys={selectedMenuKeys}
                items={items}
                mode={'inline'}
            />
        </>
    )
}