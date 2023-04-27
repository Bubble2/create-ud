import React, { useEffect } from 'react';
import { Base64 } from 'js-base64'
import { changeURLArg } from '@utils/format';

export default () => {
    useEffect(() => {
        const userAgent = window.navigator.userAgent;
        if (userAgent.indexOf('ChainMeet') === -1) return;

        const chainmeetShareVal = Base64.encode(JSON.stringify({
            "title": "Veta - Structured products margin trading platform",
            "desc": "Make structured product trading simple and safe."
        }));

        let resolvedSearch = window.location.search;

        //有chainmeetShare则修改
        if (resolvedSearch.includes('chainmeetShare=')) {
            resolvedSearch = changeURLArg(resolvedSearch, 'chainmeetShare', chainmeetShareVal)
        } else {
            //无chainmeetShare，但有其他search，则加&
            if (resolvedSearch) {
                resolvedSearch = resolvedSearch + '&'
            } else {//无任何search
                resolvedSearch = '?' + resolvedSearch
            }
            resolvedSearch = `${resolvedSearch}chainmeetShare=${chainmeetShareVal}`
        }

        window.history.replaceState({}, '0', `${window.location.origin}${window.location.pathname}${resolvedSearch}`);

    }, [window.location.origin, window.location.pathname, window.location.search])
}