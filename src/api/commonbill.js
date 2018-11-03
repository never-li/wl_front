import request from '@/utils/request'

/**
 * 获取用户信息
 */
export function printIncNum(data) {
  return request.post('/commonbill/printIncNum', data)
}
