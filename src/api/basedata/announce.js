import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/member/basedata/announce/list',
    method: 'post',
    data: data
  })
}

export function add(data) {
  return request({
    url: '/member/basedata/announce/add',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/member/basedata/announce/update',
    method: 'post',
    data: data
  })
}

export function del(data) {
  return request({
    url: '/member/basedata/announce/del',
    method: 'post',
    data: data
  })
}

export function detail(data) {
  return request({
    url: '/member/basedata/announce/detail',
    method: 'post',
    data: data
  })
}
