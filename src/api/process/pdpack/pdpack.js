import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/member/process/pdpack/list',
    method: 'post',
    data
  })
}

export function getPdPackColumn(data) {
  return request({
    url: '/member/process/pdpack/getcolumn',
    method: 'post',
    data
  })
}

export function addPdPackColumn(data) {
  return request({
    url: '/member/process/pdpack/addcolumn',
    method: 'post',
    data
  })
}

export function exportExcel(data) {
  return request({
    url: '/member/process/pdpack/export',
    method: 'post',
    data
  })
}

export function getSplitPack(data) {
  return request({
    url: '/member/process/pdpack/getSplitPack',
    method: 'post',
    data
  })
}

export function splitPack(data) {
  return request({
    url: '/member/process/pdpack/splitPack',
    method: 'post',
    data
  })
}
