import request from '@/utils/request'

export function list(data) {
  return request.post('/member/process/changepd/list', data)
}

export function dtlist(blid) {
  return request.post('/member/process/changepd/dtlist', { blid: blid })
}

export function sublist(blid) {
  return request.post('/member/warehouse/changest/sublist', { blid: blid })
}

export function stocklist(data) {
  return request.post('/member/process/changepd/stocklist', data)
}

export function add(data) {
  return request.post('/member/process/changepd/add', data)
}

export function update(data) {
  return request.post('/member/process/changepd/update', data)
}

export function del(id) {
  return request.post('/member/process/changepd/del', { id: id })
}

export function audit(data) {
  return request.post('/member/process/changepd/audit', data)
}

export function unaudit(data) {
  return request.post('/member/process/changepd/unaudit', data)
}

export function createsub(data) {
  return request.post('/member/warehouse/changest/createsub', data)
}

export function deletesub(data) {
  return request.post('/member/warehouse/changest/deletesub', data)
}

export function lock(data) {
  return request.post('/member/process/changepd/lockgoods', data)
}

export function print(data) {
  return request.post('/member/process/changepd/print', data)
}

export function getPrintList(data) {
  return request.post('/member/process/changepd/getPrintList', data)
}

export function batchprint(data) {
  return request.post('/member/process/changepd/batchPrint', data)
}

export function updateforaudit(data) {
  return request.post('/member/process/changepd/updateforaudit', data)
}

export function addAndAudit(data) {
  return request.post('/member/process/changepd/addAndAudit', data)
}

export function updateAndAudit(data) {
  return request.post('/member/process/changepd/updateAndAudit', data)
}

export function getStoreFeeDtFromPdPack(data) {
  return request({
    url: '/member/process/changepd/getStoreFeeDtFromPdPack',
    method: 'post',
    data
  })
}

