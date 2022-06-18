import QS from 'qs';
import axios from "axios";

let instance = axios.create({
    baseURL: "",
    timeout: 5 * 1000,
})

instance.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error)
    }
)

export default instance;
