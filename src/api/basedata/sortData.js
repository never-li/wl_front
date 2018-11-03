import request from '@/utils/request'

export function update(data) {
  return request({
    url: '/member/basedata/sortdata/update',
    method: 'post',
    data: data
  })
}

export function add(data) {
  return request({
    url: '/member/basedata/sortdata/add',
    method: 'post',
    data: data
  })
}

export function del(data) {
  return request({
    url: '/member/basedata/sortdata/del',
    method: 'post',
    data: data
  })
}

export function list(data) {
  return request({
    url: '/member/basedata/sortdata/list',
    method: 'post',
    data: data
  })
}

export function dtList(data) {
  return request({
    url: '/member/basedata/sortdata/typelist',
    method: 'post',
    data: { sortId: data }
  })
}
