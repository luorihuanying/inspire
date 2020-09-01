import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import store from '@/store'
const wesocket = {
  debug: true,
  connection: '',
  options: {
    autoConnect: false
  }
}

function getSocket(url, token) {
  wesocket.connection = url + '?tokne=' + token
  const VueSocket = new VueSocketIO(wesocket)
  // 监听connect事件，设置isSuccessConnect为true
  VueSocket.io.on('disconnect', () => {
    console.log('socket disconnect')
  // store.commit('newIsSuccessConnect', true)
  })
  Vue.use(VueSocket)
  store.commit('socket/SET_SOCKET_STATUS', true, { root: true })
}

export default getSocket
