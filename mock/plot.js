import { config } from '@vue/test-utils'

const plotList = [
  {
    plostName: '地块-1',
    desc: '对地块-1的描述',
    bounds: [], // 地块矩形边界
    layerUrl: 'http://..', // 图层资源路径
    exterior: [], // 边界坐标list
    lotRange: 2330 // 地块面积
  },
  {
    plostName: '地块-2',
    desc: '对地块-2的描述',
    bounds: [],
    layerUrl: 'http://..',
    exterior: [],
    lotRange: 2330
  }
]
const plotList1 = [
  {
    plostName: '地块1',
    desc: '对地块-1的描述',
    bounds: [], // 地块矩形边界
    layerUrl: 'http://..', // 图层资源路径
    exterior: [], // 边界坐标list
    lotRange: 2330 // 地块面积
  },
  {
    plostName: '地块1',
    desc: '对地块-2的描述',
    bounds: [],
    layerUrl: 'http://..',
    exterior: [],
    lotRange: 2330
  }
]
export default [
  {
    url: '/cms/updatePlotInfo/',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        msg: 'ok'
      }
    }
  },
  {
    url: '/cms/createPlotInfo/',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        msg: 'ok'
      }
    }
  },
  {
    url: '/cms/deletePlotInfo/',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        msg: 'ok'
      }
    }
  }
]
