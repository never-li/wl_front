import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/member/basedata/machtype/list',
    method: 'post',
    data: data
  })
}

export function mobileList() {
  return request({
    url: '/member/basedata/mobile/listall',
    method: 'post'
  })
}

export function dtList(data) {
  return request({
    url: '/member/basedata/machtype/machinelist',
    method: 'post',
    data: data
  })
}

export function add(data) {
  return request({
    url: '/member/basedata/machtype/add',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/member/basedata/machtype/update',
    method: 'post',
    data: data
  })
}

export function del(data) {
  return request({
    url: '/member/basedata/machtype/del',
    method: 'post',
    data: data
  })
}
