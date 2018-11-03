import request from '@/utils/request'

export function addBill(data) {
  return request({
    url: '/member/system/billtype/add',
    method: 'post',
    data
  })
}

export function updateBill(data) {
  return request({
    url: '/member/system/billtype/update',
    method: 'post',
    data
  })
}

export function deleteBill(data) {
  return request({
    url: '/member/system/billtype/del',
    method: 'post',
    data
  })
}

export function queryList(data) {
  return request({
    url: '/member/system/billtype/list',
    method: 'post',
    data
  })
}
