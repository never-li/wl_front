import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/member/basedata/mobile/list',
    method: 'post',
    data: data
  })
}

export function add(data) {
  return request({
    url: '/member/basedata/mobile/add',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/member/basedata/mobile/update',
    method: 'post',
    data: data
  })
}

export function del(data) {
  return request({
    url: '/member/basedata/mobile/del',
    method: 'post',
    data: data
  })
}
