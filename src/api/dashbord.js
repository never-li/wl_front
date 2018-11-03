import request from '@/utils/request'
export function queryAnnounce() {
  return request({
    url: '/dashboard/announce',
    method: 'post'
  })
}

export function queryAnnounceDetail(data) {
  return request({
    url: '/dashboard/announce/detail',
    method: 'post',
    data
  })
}

export function queryInStoreList(data) {
  return request({
    url: '/member/warehouse/instore/list',
    method: 'post',
    data
  })
}

export function queryMachSchedulingList(data) {
  return request({
    url: '/member/process/machscheduling/list',
    method: 'post',
    data
  })
}

export function queryMachOrderList(data) {
  return request({
    url: '/member/process/newmach/list',
    method: 'post',
    data
  })
}

export function queryFeeList(data) {
  return request({
    url: '/member/collectfee/feerc/list',
    method: 'post',
    data
  })
}
