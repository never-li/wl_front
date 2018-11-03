import request from '@/utils/request'

export function list(data) {
  return request.post('/member/process/machclearing/list', data)
}

export function dtlist(data) {
  return request.post('/member/process/machclearing/dtlist', data)
}

export function unfeereslist(data) {
  return request.post('/member/process/machclearing/unfeereslist', data)
}

export function queryAttachFee(data) {
  return request.post('/member/process/machclearing/queryAttachFee', data)
}

export function queryUsedBattenDt(data) {
  return request.post('/member/process/machclearing/queryUsedBattenDt', data)
}

export function add(data) {
  return request.post('/member/process/machclearing/add', data)
}

export function addAndAudit(data) {
  return request.post('/member/process/machclearing/addAndAudit', data)
}

export function updateAndAudit(data) {
  return request.post('/member/process/machclearing/updateAndAudit', data)
}

export function update(data) {
  return request.post('/member/process/machclearing/update', data)
}

export function updatePrice(data) {
  return request.post('/member/process/machclearing/updateprice', data)
}

export function del(data) {
  return request.post('/member/process/machclearing/del', data)
}

export function audit(data) {
  return request.post('/member/process/machclearing/audit', data)
}

export function unaudit(data) {
  return request.post('/member/process/machclearing/unaudit', data)
}

export function print(data) {
  return request.post('/member/process/machclearing/print', data)
}

