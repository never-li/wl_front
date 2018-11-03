import request from '@/utils/request'

export function queryList(data) {
  return request({
    url: 'member/system/feeconfig/list',
    method: 'post',
    data
  })
}

export function addConfig(data) {
  return request({
    url: 'member/system/feeconfig/add',
    method: 'post',
    data
  })
}

export function updateConfig(data) {
  return request({
    url: 'member/system/feeconfig/update',
    method: 'post',
    data
  })
}

export function deleteConfig(data) {
  return request({
    url: 'member/system/feeconfig/del',
    method: 'post',
    data
  })
}

