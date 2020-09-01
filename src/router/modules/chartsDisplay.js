import Layout from '@/layout'

const chartRouter = {
  path: '/chartDisplay',
  component: Layout,
  redirect: '/chartDisplay/turang',
  name: '图表展示',
  meta: {
    title: '图表展示',
    icon: '图表展示'
  },
  children: [
    {
      path: 'turang',
      component: () => import('@/views/chartDisplay/turang/index'), // Parent router-view
      name: '智墒土壤温湿度监测仪',
      meta: {
        title: '土壤监测仪',
        icon: '土壤传感器',
        roles: ['admin']
        // socket: true
      }
    },
    {
      path: 'qixiangzhan',
      component: () => import('@/views/chartDisplay/qixiangzhan/index'), // Parent router-view
      name: '天圻气象站(基地旁)',
      meta: {
        title: '天圻气象站',
        icon: '气象站',
        roles: ['admin']
        // socket: true
      }
    },
    {
      path: 'shexiangtou',
      component: () => import('@/views/chartDisplay/shexiangtou/index'), // Parent router-view
      name: '极飞摄像头(表型圃)',
      meta: {
        title: '极飞摄像头',
        icon: '摄像头',
        roles: ['admin']
        // socket: true
      }
    },
    {
      path: 'wulianwang',
      component: () => import('@/views/chartDisplay/wulianwang/index'), // Parent router-view
      name: '物联网节点',
      meta: {
        title: '物联网节点',
        icon: '物联网',
        roles: ['admin']
        // socket: true
      }
    }
  ]
}

export default chartRouter
