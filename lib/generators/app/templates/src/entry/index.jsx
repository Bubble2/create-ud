import React, { Suspense } from 'react';
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from '@pages/app';
import '../i18n';

import 'core-js/es6/map';
import 'core-js/es6/set';
import { Spin } from 'antd';
import store from '../configStore'
import { WagmiConfig } from 'wagmi'
import client from '@utils/createClient'

if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('../store', () => store.replaceReducer(rootReducer))
}


const render = (App) => {
    createRoot(document.getElementById('root')).render(
        <WagmiConfig client={client}>
            <Provider store={store}>
                <Suspense fallback={<div className="gb-center-container"><Spin /></div>}>
                    <App />
                </Suspense>
            </Provider>
        </WagmiConfig>
    )
};

render(App);




