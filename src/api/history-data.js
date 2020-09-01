import request from '@/utils/request'

/**
 *请求地址：127.0.0.1:5000/cms/regGroApi
 请求方式：GET
 功能描述：该接口可以返回所有区域下所有设备组。
 *return  data:[
 {
    regionName: '一区',
    groupList: ['1区-设备组1', '1区-设备组2', '1区-设备组3']
  },
 {
    regionName: '二区',
    groupList: ['2区-设备组1', '2区-设备组2', '2区-设备组3']
  }
 ]
 */
export function getRegionGroupList() {
  return request({
    url: '/cms/regGroApi/',
    method: 'get'
  })
}

/**
 *
 *请求地址：127.0.0.1:5000/cms/historydataApi
 请求方式：GET
 功能描述：该接口可以返回所有历史记录。
 return data : [
 {
            "id": 2,
            "devName": "4G模块",
            "alarm": 0,
            "dataPointName": "湿度传感器",
            "type": 2,
            "date": "2020-04-03T00:26:42",
            "value": 43.0
        }]
 @param {*} data | { devName, dataPoints, page = 1, limit = 20, startTime, endTime }
 */
export function getHistoryDataList(data) {
  return request({
    url: '/cms/historydataApi/',
    method: 'post',
    data: data
  })
}

/**
 * 请求地址：127.0.0.1:5000/cms/getDevsApi
 请求方式：GET
 功能描述：该接口可以返回所有设备。
 * @param {*} groupName // 设备组名
 { "devList":["4G模块1","4G模块2"] }
 */
export function getDevListByGroupName(groupName) {
  return request({
    url: '/cms/getDevsApi/',
    method: 'get',
    params: groupName
  })
}

/**
 * 请求地址：127.0.0.1:5000/cms/dpApi
 请求方式：GET
 功能描述：该接口可以返回所有数据点。
 接口参数说明：
 模板返回值：{dataPointList:[]}

 * @param {*} devName //设备名
 */
export function getdataPointListBydevName(devName) {
  return request({
    url: '/cms/dpApi/',
    method: 'get',
    params: devName
  })
}

/**
 *请求地址：127.0.0.1:5000/cms/createNewhistoryDataApi
 请求方式：POST
 功能描述：该接口可以创建一条新的历史记录。
 接口参数说明：
 regGroup  区域名-设备组名(扶绥-设备组1)  字符型
 devName  设备名称  字符型
 createTime  创建时间  字符型
 * @param {*} data
 * {
        groupName: undefined,
        devName: '',
        date: new Date(),
        dataPointName: undefined,
        value: 0,
        alarm: 0
      },
 @return {*} |{msg:'ok'}
 */
export function postNewhistoryData(data) {
  return request(
    {
      url: '/cms/createNewhistoryDataApi/',
      method: 'post',
      data: data
    })
}

/**
 *  请求地址：127.0.0.1:5000/cms/deleteOneDataApi
 请求方式：POST
 功能描述：该接口可以删除一条历史记录。
 接口参数说明：
 id   选中的历史记录序号  整型
 模板返回值：“ok”
 * @param {*} data |{id:0,devName:'devname',dataPointName:'dataPointName'...}
 @return {*} |{msg:'ok'}
 */
export function delOneRowfromApi(data) {
  return request(
    {
      url: '/cms/deleteOneDataApi/',
      method: 'post',
      data: data
    }
  )
}

/**
 * 请求地址：127.0.0.1:5000/cms/changeAlarmStatusApi
 请求方式：POST
 功能描述：该接口可以修改一条历史记录报警状态。
 接口参数说明：
 id   选中的历史记录序号  整型
 模板返回值：“ok”
 * @param {*} data | {id:0,devName:'devname',dataPointName:'dataPointName'...}
 @return {*} |{msg:'ok'}
 */
export function changeAlarmStatusFromApi(data) {
  return request(
    {
      url: '/cms/changeAlarmStatusApi/',
      method: 'post',
      data: data
    }
  )
}

/**
 * 请求地址：127.0.0.1:5000/cms/updateData
 请求方式：POST
 功能描述：该接口可以编辑一条历史记录的数值。
 接口参数说明：
 valueId  选中的记录序号  字符型
 value  记录的数值   浮点型
 模板返回值：“ok”
 * @param {*} data | {id:0,devName:'devname',dataPointName:'dataPointName'...}
 @return {*} |{msg:'ok'}
 */
export function updateDateFromApi(data) {
  return request(
    {
      url: '/cms/updateData/',
      method: 'post',
      data: data
    }
  )
}
