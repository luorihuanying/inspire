import Layout from '@/layout'

const dataCenterRouter = {
  path: '/dataCenter',
  component: Layout,
  redirect: '/dataCenter/historicalData',
  name: '数据中心',
  meta: {
    title: '数据中心',
    icon: '数据中心',
    socket: true
  },
  children: [
    {
      path: 'historicalData',
      component: () => import('@/views/dataCenter/historicalData/index'), // Parent router-view
      name: '历史数据',
      meta: {
        title: '历史数据',
        icon: '历史数据',
        roles: ['admin']
        // socket: true
      }
    },
    {
      path: 'devGroup',
      name: '其他',
      component: () => import('@/views/dataCenter/others/index'),
      meta: { title: '其他',
        icon: 'qq',
        roles: ['admin']
        // socket: true
      }
    }
  ]

}
export default dataCenterRouter
