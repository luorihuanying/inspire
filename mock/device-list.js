
import Mock from 'mockjs'

const devList1 = Mock.mock({
  'devList|25': [{
    id: '@increment',
    devName: '设备' + '@integer(1, 50)',
    regName: '一区',
    'status|1': ['0', '1'],
    gName: '设备组' + '@integer(1, 3)',
    date: '@datetime',
    position: [13, 23]
  }]
})

const devList2 = Mock.mock({
  'devList|25': [{
    id: '@increment',
    devName: '设备' + '@integer(1, 50)',
    regName: '二区',
    'status|1': [0, 1, 0, 0, 0],
    gName: '设备组' + '@integer(1, 3)',
    date: '@datetime',
    position: [13, 23]
  }]
})
const regList = [
  { regName: '一区',
    groups: ['设备组1', '设备组2', '设备组3'],
    devs: devList1.devList
  },
  {
    regName: '二区',
    groups: ['设备组1', '设备组2', '设备组3'],
    devs: devList2.devList
  }
]

const reg = [
  {
    regName: '一区',
    groups: [
      { name: 'group1',
        devsCount: 13
      }, {
        name: 'group2',
        devsCount: 4
      },
      {
        name: 'group3',
        devsCount: 7
      }],
    devsCount: {
      total: 24,
      offline: 10,
      online: 14
    }
  },
  {
    regName: '二区',
    groups: [
      { name: 'group1',
        devsCount: 13
      }, {
        name: 'group2',
        devsCount: 4
      },
      {
        name: 'group3',
        devsCount: 7
      }],
    devsCount: {
      total: 24,
      offline: 10,
      online: 14
    }
  }
]
export default [
  {
    url: '/cms/getDevsList/',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: regList,
        queryParams: config.query
      }
    }
  },
  {
    url: '/cms/getDevsCount/',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: reg

      }
    }
  },
  {
    url: '/cms/updateDevsInfo/',
    type: 'post',
    response: config => {
      const data = config.body.data
      return {
        code: 20000,
        msg: 'ok',
        data: data
      }
    }
  },
  {
    url: '/cms/deleteDev/',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        msg: 'ok'
      }
    }
  }

]

