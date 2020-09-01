import { getSocketUrl } from '@/api/user'
import store from '@/store'
import getSocket from '@/utils/socket'

const state = {
  // socket连接状态
  isSuccessConnect: false,
  socketInstance: false,
  connectUrl: ''
}
const mutations = {
  SET_CONNECT_STATUS: (state, value) => {
    state.isSuccessConnect = value
  },
  SET_SOCKET_STATUS: (state, value) => {
    state.socketInstance = value
  },
  SET_CONNECT_URL: (state, value) => {
    state.connectUrl = value
  }
}
const actions = {
  getConnectUrl({ commit, state }) {
    const token = store.getters.token
    return new Promise((resolve, reject) => {
      if (state.connectUrl) {
        getSocket(state.connectUrl, token)
        resolve()
      } else {
        getSocketUrl().then(res => {
          // console.log('getsocket', res)
          const connect = res.data
          commit('SET_CONNECT_URL', connect)
          getSocket(connect, token)
          resolve()
        }).catch(error => { reject(error) })
      }
    })
  }
  // changeConnectStatus({ commit, state }, value) {
  //   return new Promise((resolve) => {
  //     commit('SET_CONNECT_STATUS', value)
  //     resolve()
  //   })
  // }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
