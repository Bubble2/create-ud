import React from 'react'
import axios from 'axios';


let pending = []; //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let cancelToken = axios.CancelToken;
let removePending = (ever) => {
    for (let p in pending) {
        if (pending[p].u === ever.url + '&' + ever.method) { //当当前请求在数组中存在时执行函数体
            pending[p].f(); //执行取消操作
            pending.splice(p, 1); //把这条记录从数组中移除
        }
    }
    console.log('pending ajax', pending)
}

//新建了一个axios的实例
const ajax = axios.create({

});


//http request 拦截器
ajax.interceptors.request.use(
    config => {
        // ------------------------------------------------------------------------------------
        removePending(config); //在一个ajax发送前执行一下取消操作
        config.cancelToken = new cancelToken((c) => {
            // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
            pending.push({ u: config.url + '&' + config.method, f: c });
        });
        // -----------------------------------------------------------------------------------------
        return config;
    },
    error => {
        return Promise.reject(err);
    }
);

var modalStatus = { closed: true };

//增加了响应数据的拦截，当请求响应登录超时的时候，给提醒
ajax.interceptors.response.use(function (response) {
    // ------------------------------------------------------------------------------------------
    removePending(response.config);  //在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
    // -------------------------------------------------------------------------------------------
    if (response.data.code === 120) {
        try {
            modalStatus.closed = false;
        } catch (error) {
            console.log('error', error)
        }

    }
    return response;

}, function () {
    return Promise.reject(error);
});

export default ajax;