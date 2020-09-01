import request from '@/utils/request'

export function getDevsListFromApi(query) {
  return request({
    url: '/cms/getDevsList/',
    method: 'get',
    params: query
  })
}
/**
 * 获取设备组、设备以及在线情况
 */
export function getDevsCountFormApi() {
  return request({
    url: '/cms/getDevsCount/',
    method: 'get'
  })
}

export function updateDevsInfoToApi(data) {
  return request({
    url: '/cms/updateDevsInfo/',
    method: 'post',
    data: data
  })
}
export function deleteDev(data) {
  return request({
    url: '/cms/deleteDev/',
    method: 'post',
    data: data
  })
}

/** *
 * 设备分组api
 */
export function getRegGroupInfoFromApi(data) {
  return request({
    url: '/cms/getGroupInfo/',
    method: 'get',
    params: data
  })
}
export function updateRegInfoToApi(data) {
  return request({
    url: '/cms/updateRegInfo/',
    method: 'post',
    data: data
  })
}
export function createRegInfoToApi(data) {
  return request({
    url: '/cms/createRegInfo/',
    method: 'post',
    data: data
  })
}
export function delRegToApi(data) {
  return request({
    url: '/cms/delRegInfo/',
    method: 'post',
    data: data
  })
}
export function updataGroupInfoToApi(data) {
  return request({
    url: '/cms/updateGroupInfo/',
    method: 'post',
    data: data
  })
}
export function delGroupInfoToApi(data) {
  return request({
    url: '/cms/delGroupInfo/',
    method: 'post',
    data: data
  })
}
export function creteGroupInfoToApi(data) {
  return request({
    url: '/cms/createGroupInfo/',
    method: 'post',
    data
  })
}
