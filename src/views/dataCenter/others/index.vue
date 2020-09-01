<template>
  <div id="app">
    <img alt="Vue logo" src="@/assets/images/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <button @click="sendMsg">发送信息</button>

    <div id="example-1">
      <button @click="show = !show">
        Toggle render
      </button>
      <transition name="slide-fade">
        <p v-show="show">hello</p>
      </transition>
    </div>
  </div>
</template>
<style lang="scss" scoped>
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(-10px);
  opacity: 0;
}
.slide-fade-leave-to{
  transform: translateY(10px);
  opacity: 0;
}
</style>
<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld
  },
  data() {
    return {
      show: false
    }
  },
  // mounted() {
  //   this.$socket.open()
  // },
  // beforeDestroy() {
  //   this.$socket.close()
  // },
  methods: {
    sendMsg() {
      // this.send()
    }

    // send() {
    //   console.log('发送:' + '1111111')
    //   this.$socket.emit('message', '1111111111')
    // }
  }
  // sockets: {
  //   connect: function() {
  //     this.$store.commit('socket/SET_CONNECT_STATUS', true, { root: true })
  //     console.log('socket connected')
  //   },
  //   message: function(val) {
  //     console.log(val)
  //   },
  //   disconnect: function() {
  //     console.log('dfdfdfdfd')
  //   }

  // }

}
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
