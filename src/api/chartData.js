import request from '@/utils/request'
/**
  功能描述：该接口返回绘制表格所需要的数据。
 */
export function getZhiShang1() {
  return request({
    url: '/cms/getZhiShang1Api/',
    method: 'get'
  })
}

export function getTianQi() {
  return request({
    url: '/cms/getTianQiApi/',
    method: 'get'
  })
}

export function getCamera() {
  return request({
    url: '/cms/getCameraApi/',
    method: 'get'
  })
}

export function getDayData() {
  return request({
    url: '/cms/getDataDayApi/',
    method: 'get'
  })
}

export function getMonthData() {
  return request({
    url: '/cms/getDataMonthApi/',
    method: 'get'
  })
}
export function getYearData() {
  return request({
    url: '/cms/getDataYearApi/',
    method: 'get'
  })
}

export function downloadData(data) {
  return request({
    url: '/cms/downloadDataApi/',
    method: 'post',
    data
  })
}
export function getlivePic() {
  return request({
    url: '/cms/getlivePicApi/',
    method: 'get'
  })
}
// 物联网
export function getNewtestData() {
  return request({
    url: '/cms/getNewtestDataApi/',
    method: 'get'
  })
}
export function get4GInfo() {
  return request({
    url: '/cms/get4GInfoApi/',
    method: 'get'
  })
}
export function getIotDay() {
  return request({
    url: '/cms/getIotDayApi/',
    method: 'get'
  })
}
export function getIotWeek() {
  return request({
    url: '/cms/getIotWeekApi/',
    method: 'get'
  })
}
export function getIotMonth() {
  return request({
    url: '/cms/getIotMonthApi/',
    method: 'get'
  })
}

