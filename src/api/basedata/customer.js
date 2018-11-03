import request from '@/utils/request'

export function addCustomer(data) {
  return request({
    url: '/member/basedata/customer/add',
    method: 'post',
    data
  })
}

export function updateCustomer(data) {
  return request({
    url: '/member/basedata/customer/update',
    method: 'post',
    data
  })
}

export function deleteCustomer(data) {
  return request({
    url: '/member/basedata/customer/del',
    method: 'post',
    data
  })
}

export function queryList(data) {
  return request({
    url: '/member/basedata/customer/list',
    method: 'post',
    data
  })
}

export function downloadFile(data) {
  return request({
    url: '/member/basedata/customer/export',
    method: 'post',
    data
  })
}
