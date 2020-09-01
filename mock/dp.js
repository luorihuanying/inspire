
const dataPointsList1 = [
  {
    dpName: '数据点-1',
    desc: '数据点的描述',
    position: [107.872283, 22.964122],
    dataTotal: 10000, // 当前发送数据总量
    type: 2 // 数据点传感器类型
  },
  {
    dpName: '数据点-2',
    desc: '数据点的描述',
    position: [107.872283, 22.964122],
    dataTotal: 10000,
    type: 2
  },
  {
    dpName: '数据点-3',
    desc: '数据点的描述',
    position: [107.872283, 22.964122],
    dataTotal: 10000,
    type: 1// 传感器类型
  }
]

const dataPointsList = [
  {
    dpName: '数据点1',
    desc: '数据点的描述',
    position: [107.872283, 22.964122],
    dataTotal: 10000, // 当前发送数据总量
    type: 2 // 数据点传感器类型
  },
  {
    dpName: '数据点2',
    desc: '数据点的描述',
    position: [107.872283, 22.964122],
    dataTotal: 10000,
    type: 2
  },
  {
    dpName: '数据点3',
    desc: '数据点的描述',
    position: [107.872283, 22.964122],
    dataTotal: 10000,
    type: 1// 传感器类型
  }
]
const d1 = [
  {
    devName: '设备1',
    desc: '设备1的描述',
    position: [107.87062, 22.961346],
    dataPoints: dataPointsList, // 数据点list
    dpTotal: dataPointsList.length, // 设备下数据点总数
    dataTotal: 20000 // 当前数据接收数据总量
  },
  {
    devName: '设备2',
    desc: '设备2的描述',
    position: [107.871929, 22.963105],
    dataPoints: dataPointsList1,
    dpTotal: dataPointsList.length,
    dataTotal: 30000
  }
]

const d2 = [
  {
    devName: '设备-1',
    desc: '设备1的描述',
    position: [107.87062, 22.961346],
    dataPoints: dataPointsList, // 数据点list
    dpTotal: dataPointsList.length, // 设备下数据点总数
    dataTotal: 20000 // 当前数据接收数据总量
  },
  {
    devName: '设备-2',
    desc: '设备2的描述',
    position: [107.871929, 22.963105],
    dataPoints: dataPointsList,
    dpTotal: dataPointsList.length,
    dataTotal: 30000
  }
]
const reg = [
  {
    regName: '一区',
    devs: d1
  },
  {
    regName: '二区',
    devs: d2
  }
]
export default [
  {
    url: '/cms/getDevsInfoList/',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: reg
      }
    }
  },
  {
    url: '/cms/delDev/',
    type: 'post',
    response: config => {
      return {
        code: 0,
        msg: 'ok'
      }
    }
  },
  {
    url: '/cms/updateDev/',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        msg: 'ok'
      }
    }
  },
  {
    url: '/cms/createDev/',
    type: 'post',
    response: config => {
      return {
        code: 0,
        msg: 'ok'
      }
    }
  },
  {
    url: '/cms/delDp/',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        msg: 'ok'
      }
    }
  },
  {
    url: '/cms/createDp/',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        msg: 'ok'
      }
    }
  },
  {
    url: '/cms/updateDp/',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        msg: 'ok'
      }
    }
  }
]
