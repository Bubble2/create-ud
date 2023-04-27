import React from 'react';
import { updateOpenMenuKeys, updateSelectedMenuKeys, updateSelectedFirstMenuKeys } from '@state/routeSlice'
import { useDispatch } from 'react-redux';

export default ()=>{
    const dispatch = useDispatch();
    const updateMenu = (args) => {
        dispatch(updateOpenMenuKeys(args)) //如果要求全部展开则不要执行这个，同时 ，redux初始值要添加全部一级菜单key
        dispatch(updateSelectedMenuKeys(args))
        dispatch(updateSelectedFirstMenuKeys(args))
    }
    return updateMenu 
}