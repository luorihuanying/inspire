
import Layout from '@/layout'

const devRouter = {
  path: '/deviceManagement',
  component: Layout,
  redirect: '/deviceManagement/addDevice',
  name: '设备管理',
  meta: {
    title: '设备管理',
    icon: '设备管理'
  },
  children: [
    {
      path: 'addDevice',
      component: () => import('@/views/deviceManagement/addDevice/index'), // Parent router-view
      name: '添加设备',
      meta: { title: '添加设备', roles: ['admin'], icon: '添加设备' }
    },
    {
      path: 'devGroup',
      name: '设备分组',
      component: () => import('@/views/deviceManagement/deviceGroup/index'),
      meta: { title: '设备分组', icon: '分组' }
    },
    {
      path: 'devList',
      name: '设备列表',
      component: () => import('@/views/deviceManagement/deviceList/index'),
      meta: { title: '设备列表', roles: ['admin'], icon: 'list' }
    },
    {
      path: 'plotList',
      component: () => import('@/views/deviceManagement/plotManagement'),
      name: '地块及图层',
      meta: { title: '地块及图层', roles: ['admin'], icon: '地块' }
    }
  ]
}

export default devRouter
