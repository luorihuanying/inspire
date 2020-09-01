import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条 style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  // 进度栏
  // console.log(to)
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  console.log(store.getters.socketStatus)

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      if (to.meta.socket) {
        const intervalId = window.setInterval(async() => {
          if (store.getters.socketStatus) {
            window.clearInterval(intervalId)
            checkRoles(to, from, next)
          } else {
            await store.dispatch('socket/getConnectUrl', null, { root: true })
            if (store.getters.socketStatus) {
              window.clearInterval(intervalId)
              checkRoles(to, from, next)
            }
          }
        }, 500)
      } else {
        checkRoles(to, from, next)
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

async function checkRoles(to, from, next) {
  // 确定用户是否已通过getInfo获得其权限角色
  const hasRoles = store.getters.roles && store.getters.roles.length > 0
  if (hasRoles) {
    next()
  } else {
    try {
      // get user info
      const { roles } = await store.dispatch('user/getInfo')
      // 基于角色生成可访问路由图
      const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
      // 动态添加可访问路由
      router.addRoutes(accessRoutes)
      next({ ...to, replace: true })
    } catch (error) {
      // 删除令牌并转到登录页面重新登录
      await store.dispatch('user/resetToken')
      Message.error(error || 'Has Error')
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
}
