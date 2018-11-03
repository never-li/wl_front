import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/member/warehouse/checkstoragejob/list',
    method: 'post',
    data
  })
}

export function audit(data) {
  return request({
    url: '/member/warehouse/checkstoragejob/audit',
    method: 'post',
    data
  })
}

export function back(data) {
  return request({
    url: '/member/warehouse/checkstoragejob/back',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/member/warehouse/checkstoragejob/del',
    method: 'post',
    data
  })
}

export function checkStock(data) {
  return request({
    url: '/member/warehouse/checkstoragejob/checkstock',
    method: 'post',
    data
  })
}

export function dtList(data) {
  return request({
    url: '/member/warehouse/checkstoragejob/dtlist',
    method: 'post',
    data
  })
}

export function handleDiff(data) {
  return request({
    url: '/member/warehouse/checkstoragejob/handlediff',
    method: 'post',
    data
  })
}

export function handleLess(data) {
  return request({
    url: '/member/warehouse/checkstoragejob/handleless',
    method: 'post',
    data
  })
}

export function checkImage(data) { // 获取图片
  return request({
    url: '/member/warehouse/instore/checkimage',
    method: 'post',
    data
  })
}
