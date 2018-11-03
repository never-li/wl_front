import request from '@/utils/request'

export function list(data) {
  return request.post('/member/process/outstorehd/list', data)
}

export function dtList(data) {
  return request.post('/member/process/outstorehd/dtList', data)
}

export function add(data) { // 提货新增
  return request.post('/member/process/outstorehd/add', data)
}
export function addAndAudit(data) { // 提货新增并审核
  return request.post('/member/process/outstorehd/addAndAudit', data)
}

export function del(data) { // 提货新增
  return request.post('/member/process/outstorehd/del', data)
}

export function update(data) { // 提货修改
  return request.post('/member/process/outstorehd/update', data)
}

export function audit(data) { // 审核
  return request.post('/member/process/outstorehd/audit', data)
}

export function unaudit(data) { // 反审核
  return request.post('/member/process/outstorehd/unaudit', data)
}

export function print(data) {
  return request.post('/member/process/outstorehd/print', data)
}

export function batchprint(data) {
  return request.post('/member/process/outstorehd/batchprint', data)
}

export function queryDispatchData(data) {
  return request.post('/member/process/outstorehd/queryDispatchData', data)
}

export function dispatch(data) {
  return request.post('/member/process/outstorehd/dispatch', data)
}

export function deleteDispatch(data) {
  return request.post('/member/process/outstorehd/deleteDispatch', data)
}
