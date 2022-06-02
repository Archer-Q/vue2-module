import Cookies from 'js-cookie'

const state = {
    token: '',
    userInfo: {},// 用户信息
}
const getters = {
    userInfo (state) {
        return state.userInfo
    },
    orgInfo (state) {
        return state.userInfo.orgInfo
    }
}
const mutations = {
    setToken: (state, data) => {
        state.token = data
    },
    setUser: (state, data) => {
        state.userInfo = data
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations
}
