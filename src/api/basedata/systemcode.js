import request from '@/utils/request'

export function update(data) {
  return request({
    url: '/member/system/code/update',
    method: 'post',
    data: data
  })
}

export function list(data) {
  return request({
    url: '/member/system/code/list',
    method: 'post',
    data: data
  })
}

export function dtList(data) {
  return request({
    url: '/member/system/code/dtlist',
    method: 'post',
    data: { codeId: data }
  })
}
