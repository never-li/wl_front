import request from '@/utils/request'

export function list(data) {
  return request.post('/member/collectfee/feepy/list', data)
}

export function dtlist(blid) {
  return request.post('/member/collectfee/feepy/dtlist', { blid: blid })
}

export function stocklist(data) {
  return request.post('/member/collectfee/feepy/stocklist', data)
}

export function add(data) {
  return request.post('/member/collectfee/feepy/add', data)
}

export function update(data) {
  return request.post('/member/collectfee/feepy/update', data)
}

export function del(id) {
  return request.post('/member/collectfee/feepy/del', { id: id })
}

export function audit(id) {
  return request.post('/member/collectfee/feepy/audit', { id: id })
}

export function unaudit(id) {
  return request.post('/member/collectfee/feepy/unaudit', { id: id })
}
export function makeCollections(data) {
  return request.post('/member/collectfee/feepy/makecollections', data)
}
export function print(data) {
  return request({
    url: '/member/collectfee/feepy/print',
    method: 'post',
    data
  })
}
export function batchPrint(data) {
  return request({
    url: '/member/collectfee/feepy/batchPrint',
    method: 'post',
    data
  })
}
