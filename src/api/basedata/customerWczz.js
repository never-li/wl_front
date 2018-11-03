import request from '@/utils/request'

export function addAccount(data) {
  return request({
    url: '/member/basedata/customerwczz/addaccount',
    method: 'post',
    data
  })
}

export function resetPassword(data) {
  return request({
    url: '/member/basedata/customerwczz/resetpassword',
    method: 'post',
    data
  })
}

export function updateValid(data) {
  return request({
    url: '/member/basedata/customerwczz/updatevalid',
    method: 'post',
    data
  })
}

export function list(data) {
  return request({
    url: '/member/basedata/customerwczz/list',
    method: 'post',
    data
  })
}
