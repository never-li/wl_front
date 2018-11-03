import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/member/basedata/feetype/list',
    method: 'post',
    data: data
  })
}

export function add(data) {
  return request({
    url: '/member/basedata/feetype/add',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/member/basedata/feetype/update',
    method: 'post',
    data: data
  })
}

export function del(data) {
  return request({
    url: '/member/basedata/feetype/del',
    method: 'post',
    data: data
  })
}
