import request from '@/utils/request'

export function getDevsDataPointsFromApi(query) {
  return request({
    url: '/cms/getDevsInfoList/',
    method: 'get',
    params: query
  })
}
export function delDevToApi(data) {
  return request({
    url: '/cms/delDev/',
    method: 'post',
    data
  })
}
export function updateDevToApi(data) {
  return request({
    url: '/cms/updateDev/',
    method: 'post',
    data
  })
}
export function createDevToApi(data) {
  return request({
    url: '/cms/createDev/',
    method: 'post',
    data
  })
}
export function delDpToApi(data) {
  return request({
    url: '/cms/delDp/',
    method: 'post',
    data

  })
}
export function createDpToApi(data) {
  return request({
    url: '/cms/createDp/',
    method: 'post',
    data
  })
}
export function updateDpToApi(data) {
  return request({
    url: '/cms/updateDp/',
    method: 'post',
    data
  })
}
