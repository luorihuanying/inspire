/**
 * Created by PanJiaChen on 16/11/18.
 */
import { checkUserName } from '@/api/user'
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 * 校验用户名
 */
export async function validUsername(str) {
  // return false
  const param = { userName: str.trim() }
  const { data } = await checkUserName(param)
  return data.exsit !== 0
}
