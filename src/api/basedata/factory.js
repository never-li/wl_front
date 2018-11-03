import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/member/factory/factory/list',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: '/member/factory/factory/add',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/member/factory/factory/update',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/member/factory/factory/delete',
    method: 'post',
    data
  })
}

export function getAll() {
  return request({
    url: '/admin/system/factoryqrcode/getAll',
    method: 'post'
  })
}
