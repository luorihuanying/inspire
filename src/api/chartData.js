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
