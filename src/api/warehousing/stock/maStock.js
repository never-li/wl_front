import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/member/warehouse/mastock/list',
    method: 'post',
    data
  })
}

export function freeze(data) {
  return request({
    url: '/member/warehouse/mastock/freeze',
    method: 'post',
    data
  })
}

export function unfreeze(data) {
  return request({
    url: '/member/warehouse/mastock/unfreeze',
    method: 'post',
    data
  })
}

export function changeMaStock(data) {
  return request({
    url: '/member/warehouse/mastock/changeMaStock',
    method: 'post',
    data
  })
}

export function queryStockShadow(data) {
  return request({
    url: '/member/warehouse/mastock/queryStockShadow',
    method: 'post',
    data
  })
}

export function getMaStockColumn(data) {
  return request({
    url: '/member/warehouse/mastock/getcolumn',
    method: 'post',
    data
  })
}

export function addMaStockColumn(data) {
  return request({
    url: '/member/warehouse/mastock/addcolumn',
    method: 'post',
    data
  })
}

export function checkimage(data) {
  return request({
    url: '/member/warehouse/instore/checkimage',
    method: 'post',
    data
  })
}

export function importFile(data) {
  return request({
    url: '/member/warehouse/mastock/import',
    method: 'post',
    timeout: 9999999,
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function exportFile(data) {
  return request({
    url: '/member/warehouse/mastock/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
