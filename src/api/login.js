import request from '@/utils/request'

export function login(username, password, memberId, sn) {
  return request({
    url: 'login/member/login',
    method: 'post',
    data: {
      'userCode': username,
      'passWd': password,
      'memberId': memberId,
      'sn': sn
    }
  })
}

export function rsa() {
  return request({
    url: 'commondata/rsa',
    method: 'post'
  })
}

export function dologout() {
  return request({
    url: '/login/dologout',
    method: 'post'
  })
}

/**
 * 刷新token
 */
export function changet() {
  return request({
    url: '/login/changet',
    method: 'post'
  })
}

/**
 * 修改密码
 */
export function changePwd(oldPWD, newPWD, sn) {
  return request({
    url: '/login/changepwd',
    method: 'post',
    data: {
      'oldPWD': oldPWD,
      'newPWD': newPWD,
      'sn': sn
    }
  })
}
