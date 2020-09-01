import request from '@/utils/request'
/**
 * 请求地址：127.0.0.1:5000/cms//userLoginApi/
  请求方式：POST
  功能描述：该接口可以返回用户登录后产生的token。
  接口参数说明：
  username  用户名  字符型
  password  密码    字符型
  模板返回值：{token:''}

 * @param {*} data | {username:'',password:''}
 */
export function login(data) {
  return request({
    url: '/cms/userLoginApi/',
    // url: '/user/login',
    method: 'post',
    data: data
  })
}
/**
 * @returns String  | http://sockket.link
 */
export function getSocketUrl() {
  return request({
    url: '/cms/getSocketUrl/',
    method: 'get'
  })
}
/**
 * 请求地址：127.0.0.1:5000/cms/userInfoApi
  请求方式：GET
  功能描述：该接口可以返回数据库中所有用户权限以及个人信息。
  接口参数说明：
  模板返回值：
 * @param {*} token |user token
 * @returns {*} | {
                    roles: ['admin', 'test1', 'test2'],
                    introduction: 'I am a super administrator',
                    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
                    name: 'Super Admin'
                  }
 */
export function getInfo(token) {
  return request({
    url: '/cms/userInfoApi/',
    // url: '/user/info',
    method: 'get',
    params: { token }
  })
}
/**
 * @returns | 'success'
 */
export function logout() {
  return request({
    url: '/cms/logout/',
    method: 'get'
  })
}
export function checkUserName(username) {
  return request({
    url: '/cms/userIsExist/',
    method: 'get',
    params: username
  })
}
