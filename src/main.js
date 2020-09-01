import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
// Amap
import VueAMap from 'vue-amap'
import defaultSettings from '@/settings'

import App from './App'
import store from './store'
import router from './router'
import * as filters from './filters' // global filters

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
//
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明

Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})
// 注册map插件
Vue.use(VueAMap)
localStorage.removeItem('_Amp_raster')
VueAMap.initAMapApiLoader({
  key: defaultSettings.mapKey,
  plugin: [
    'AMap.CustomLayer',
    'AMap.DistrictSearch',
    'AMap.Polygon'

  ],
  v: '1.4.15',
  uiVersion: '1.0.11'
})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)

})
