import Axios from 'axios';
import QS from 'qs';
import Cookies from "js-cookie";
import store from '../store';
import {Message} from "element-ui";

// 创建axios实例
const service = Axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? window.productionUrl : window.developmentUrl,
    timeout: 3 * 1000
})

let serverError = false;

/**
 * 设置：
 *      刷新token方法refreshToken()
 *      检查token有效期, 如token即将过期则刷新
 */

function checkToken() {
    const token = Cookies.get('jwtToken');
    if (!token) {
        return false;
    }
    let infostr = token.substring(token.indexOf('.') + 1, token.lastIndexOf('.'));
    let Base64 = require('js-base64').Base64;
    let info = Base64.decode(infostr);
    //解析token为对象json
    let infoObject = JSON.parse(info);
    //当前时间戳
    let current = new Date().getTime() / 1000;
    //当有效期过期时需要删除本地的token以及续签token
    if (infoObject.exp < current) {
        Cookies.set('jwtToken', null, {expires: 0});
        return false;
    } else if ((infoObject.exp - current) < (60 * 30)) {
        //当有效期还剩半小时过期时主动更新token
        refreshToken();
    }
    return true;
}

async function refreshToken() {
    // await
}

// service.defaults.headers.get['Content-Type'] = 'application/json';
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 请求拦截器
service.interceptors.request.use(config => {
        config.data = QS.stringify(config.data); // 数据转化
        // config.headers = {
        //     'Content-Type':'application/json' //配置请求头
        // }
        // 或者增加loading
        // 判断是否存在token，如果存在的话，则每个http header都加上token
        // if (checkToken()) {
        //     config.headers.Authorization = Cookies.get('jwtToken');
        // }
        return config;
    },
error => Promise.error(error)
)
// 响应拦截器
service.interceptors.response.use(
    response => {
    // token失效可以在这里处理
    // if (response.data.code == 'token失效') {
    //     //清空token
    //     store.commit("user/setToken", "");
    //     //清空首页的vuex的state
    //     store.commit('user/setUser', {});
    //
    //     Message({
    //         message: `登录账号已过期或无访问权限，请重新登录`,
    //         type: 'error',
    //         showClose:true
    //     })
    //
    //     return Promise.reject(response);
    // }
    // 运行时异常拦截
    // else if (response.data.code === '运行时异常拦截') {
    //     Message({
    //         message: '系统内部错误，请联系管理员或稍后重试',
    //         type: 'error',
    //         showClose: true
    //     })
    //     return Promise.reject(response);
    // }
    // // 业务异常拦截
    // else if (response.data.code === '业务异常拦截') {
    //     Message({
    //         message: `${response.data.msg}`,
    //         type: 'warning',
    //         showClose: true
    //     })
    //     return Promise.reject(response);
    // }
    //    关闭loading
        return Promise.resolve(response.data)
    },
    error => {
        // 超时、服务器连接错误等具体处理
        if (!serverError) {
            Message({
                message: error.message,
                type: 'error',
                showClose: true
            })
        }
        serverError = true
        setTimeout(() => {
            serverError = false
        }, 5000)
        return Promise.reject(error); // 返回错误信息
    }
)

export default service;
