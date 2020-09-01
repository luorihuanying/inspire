import Mock from 'mockjs'

const historyData = Mock.mock({
  'dataList|5': [{
    groupName: 'groupName',
    id: '@increment',
    devName: '设备' + '@integer(1, 50)',
    'alarm|1': ['0', '1'],
    dataPointName: '数据点' + '@integer(1, 50)',
    'type|1': [1, 2, 3, 4, 5],
    date: '@datetime',
    value: 'ss134'
  }]
})

// 区域-分组
const regionGroupList = [
  {
    regionName: '一区',
    groupList: ['1区-设备组1', '1区-设备组2', '1区-设备组3']
  },
  {
    regionName: '二区',
    groupList: ['2区-设备组1', '2区-设备组2', '2区-设备组3']
  }
]

const devList = Mock.mock({
  'data|20': ['设备' + '@integer(1,15)']
})

const dataPointList = ['数据点1', '数据点2', '数据点3', '数据点4', '数据点5', '数据点6']
export default [
  {
    url: '/cms/regGroApi/',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: regionGroupList
      }
    }

  },

  {
    url: '/cms/historydataApi/',
    type: 'post',
    response: config => {
      const { devName, dataPoints, page = 1, limit = 20, startTime, endTime } = config.body
      const items = historyData.dataList
      const pageList = items.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        data: {
          total: items.length,
          historyDataList: pageList,
          query: { devName, dataPoints, page, limit, startTime, endTime }
        }
      }
    }
  },

  {
    url: '/cms/getDevsApi/',
    type: 'get',
    response: config => {
      const data = devList.data
      return {
        code: 20000,
        data: {
          devList: data
        }
      }
    }
  },
  {
    url: '/cms/dpApi/',
    type: 'get',
    response: config => {
      const data = dataPointList
      return {
        code: 20000,
        data: {
          dataPointList: data
        }
      }
    }
  },

  {
    url: '/cms/createNewhistoryDataApi/',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        msg: 'ok'
      }
    }
  },
  // delete one row
  {
    url: '/cms/deleteOneDataApi/',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        msg: 'ok'
      }
    }
  },
  // change one data point value status
  {
    url: '/cms/changeAlarmStatusApi/',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        msg: 'ok'
      }
    }
  },
  // update one row data(value)
  {
    url: '/cms/updateData/',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        msg: 'ok'
      }
    }
  }

]

