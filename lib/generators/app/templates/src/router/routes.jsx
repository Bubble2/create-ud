import asyncLoad from './asyncLoad';

/**
 * 1、selectedFirstMenuKey一级菜单定位
 * 
 * 
 * 2、页面路由切换到对应的path时，该path对应的selectedMenuKeys中的数据包含哪个同一级菜单key，则这个菜单key对应的菜单高亮，例如：
 * selectedMenuKey：["/", "/detail"]则同级菜单key为'/'和'/detail'对应的菜单都高亮
 * 
 * 3、页面路由切换到对应的path时，该path对应的openMenuKeys中的数据包含哪个同一级菜单key，则这个菜单key对应的菜单打开，例如：
 * openMenuKeys：["/"]，则父级菜单key为"/"的菜单打开
 * 菜单的keys请参考components/biz/menu 组件
 * 
 * **/
const routes = [
    {
        path: '/',
        exact: true,
        component: asyncLoad(() => import('@components/layouts/basic')),
        routes: [
            {
                path: '/',
                exact: true,
                selectedMenuKeys: ['/index'],
                openMenuKeys: ['/'],
                component: asyncLoad(() => import('@pages/index')),
            },
        ]
    },
    {
        path: '/list',
        component: asyncLoad(() => import('@components/layouts/basic')),
        routes: [
            {
                path: '/',
                exact: true,
                selectedMenuKeys: ['/list'],
                openMenuKeys: ['/'],
                component: asyncLoad(() => import('@pages/list')),
            }
        ]
    },
];

export default routes;
