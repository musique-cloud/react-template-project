import axios from "axios";
import {message as antMsg, Modal} from "antd";
import {getToken, removeToken} from "@/utils/token.js";


const baseURL = "http://localhost:9000/wn"
const timeout = 10000
const tokenName = "token"
const duration = 2

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: baseURL,
    // 超时
    timeout: timeout
})

// request拦截器
service.interceptors.request.use(config => {
    // 是否需要设置 token
    if (getToken()) {
        config.headers[tokenName] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
}, error => {
    // throw error
    return Promise.reject(error);
})

// 响应拦截器
service.interceptors.response.use(
    res => {

        // 未设置状态码则默认成功状态
        const code = res.data.code;
        // 获取错误信息
        const msg = res.data.msg;

        if (code === 200) {
            return res.data;
        }

        if (code === 500) {
            antMsg.error(msg, duration);
            return Promise.reject(msg);
        }
        if (code === 1000) {
            antMsg.warning(msg, duration);
            return Promise.reject(msg);
        }

        if (code === 2000) {
            removeToken();
            Modal.warn({
                title: '系统提示',
                content: msg,
                okText: '去登录',
                onOk: () => {
                    // 跳转到登录页面
                    location.href = '/login'
                }
            });
        }

        antMsg.error("系统发生未知错误", duration);
        return Promise.reject("系统发生未知错误");
    },
    error => {
        antMsg.error("系统发生未知错误", duration);
        return Promise.reject("系统发生未知错误");
    }
)

export default service
