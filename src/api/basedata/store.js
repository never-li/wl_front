import request from '@/utils/request'

export function queryList(data) {
  return request({
    url: 'member/basedata/store/list',
    method: 'post',
    data
  })
}

export function addStore(data) {
  return request({
    url: 'member/basedata/store/add',
    method: 'post',
    data
  })
}

export function updateStore(data) {
  return request({
    url: 'member/basedata/store/update',
    method: 'post',
    data
  })
}

export function deleteStore(data) {
  return request({
    url: 'member/basedata/store/del',
    method: 'post',
    data
  })
}

export function updateMaintaining(data) {
  return request({
    url: 'member/basedata/store/maintaining',
    method: 'post',
    data
  })
}
