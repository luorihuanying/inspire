import request from '@/utils/request'
/**
  功能描述：该接口返回地图监控页面的信息。
 */
export function getRegDevsInfoFromApi() {
  return request({
    url: '/cms/amap_aboutApi/',
    method: 'get'
  })
}
