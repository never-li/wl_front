import request from '@/utils/request'

export function list(data) {
  return request.post('/member/collectfee/feerc/list', data)
}

export function feeChargeLogList(blid) {
  return request.post('/member/collectfee/feerc/feechargeloglist', { blid: blid })
}

export function dtlist(blid) {
  return request.post('/member/collectfee/feerc/dtlist', { blid: blid })
}

export function stocklist(data) {
  return request.post('/member/collectfee/feerc/stocklist', data)
}

export function add(data) {
  return request.post('/member/collectfee/feerc/add', data)
}

export function update(data) {
  return request.post('/member/collectfee/feerc/update', data)
}

export function del(id) {
  return request.post('/member/collectfee/feerc/del', { id: id })
}

export function audit(id) {
  return request.post('/member/collectfee/feerc/audit', { id: id })
}

export function unaudit(id) {
  return request.post('/member/collectfee/feerc/unaudit', { id: id })
}
export function makeCollections(data) {
  return request.post('/member/collectfee/feerc/makecollections', data)
}
export function print(data) {
  return request({
    url: '/member/collectfee/feerc/print',
    method: 'post',
    data
  })
}

export function batchPrint(data) {
  return request({
    url: '/member/collectfee/feerc/batchPrint',
    method: 'post',
    data
  })
}

export function dtlistbyblno(data) {
  return request({
    url: '/member/collectfee/feerc/dtlistbyblno',
    method: 'post',
    data
  })
}
