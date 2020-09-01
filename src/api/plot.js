import request from '@/utils/request'

export function getPlotInfoFromApi(query) {
  return request({
    url: '/cms/getPlots/',
    method: 'get',
    params: query
  })
}
export function updatePlotInfoFromApi(data) {
  return request({
    url: '/cms/updatePlotInfo/',
    method: 'post',
    data
  })
}
export function createPlotInfoFromApi(data) {
  return request({
    url: '/cms/createPlotInfo/',
    method: 'post',
    data
  })
}
export function deletePlotInfoToApi(data) {
  return request({
    url: '/cms/deletePlotInfo/',
    method: 'post',
    data
  })
}
