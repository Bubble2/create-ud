import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { join } from '@utils/path'
import { Spin } from 'antd';

const renderRoutes = (routes, updateMenuKeys, extraProps = {}, switchProps = {}) => routes ? (
    <Switch {...switchProps}>
        {routes.map((route, i) => {
            return (
                <Route
                    key={route.key || i}
                    path={route.path}
                    exact={route.exact}
                    strict={route.strict}
                    render={(props) => {

                        //路由path拼接
                        if (route.routes && !route.isPathJoined) {
                            route.routes = route.routes.map(item => {
                                item.path = join(route.path, item.path)
                                return item;
                            })
                            route.isPathJoined = 1
                        }

                        //注入到redux中用于菜单定位
                        if ((route.selectedFirstMenuKeys || route.selectedFirstMenuKeys === undefined) && (route.selectedMenuKeys || route.selectedMenuKeys === undefined) && (route.openMenuKeys || route.openMenuKeys === undefined) && updateMenuKeys) {
                            updateMenuKeys({
                                selectedFirstMenuKeys: route.selectedFirstMenuKeys,
                                selectedMenuKeys: route.selectedMenuKeys,
                                openMenuKeys: route.openMenuKeys
                            })
                        }

                        return (
                            <Suspense fallback={<div className="gb-center-container"><Spin /></div>}>
                                <route.component {...props} {...extraProps} route={route} />
                            </Suspense>
                        )
                    }}
                />
            )
        })}
    </Switch>
) : null;

export default renderRoutes;