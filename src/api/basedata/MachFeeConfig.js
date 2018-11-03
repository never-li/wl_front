import request from '@/utils/request'

export function queryList(data) {
  return request({
    url: 'member/system/machfeeconfig/list',
    method: 'post',
    data
  })
}

export function addConfig(data) {
  return request({
    url: 'member/system/machfeeconfig/add',
    method: 'post',
    data
  })
}

export function updateConfig(data) {
  return request({
    url: 'member/system/machfeeconfig/update',
    method: 'post',
    data
  })
}

export function deleteConfig(data) {
  return request({
    url: 'member/system/machfeeconfig/del',
    method: 'post',
    data
  })
}

