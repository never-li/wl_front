import request from '@/utils/request'

export function list(data) {
  return request.post('/member/warehouse/changest/list', data)
}

export function dtlist(blid) {
  return request.post('/member/warehouse/changest/dtlist', { blid: blid })
}

export function sublist(blid) {
  return request.post('/member/warehouse/changest/sublist', { blid: blid })
}

export function stocklist(data) {
  return request.post('/member/warehouse/changest/stocklist', data)
}

export function add(data, isAudit) {
  if (isAudit) {
    return request.post('/member/warehouse/changest/addAndAudit', data)
  } else {
    return request.post('/member/warehouse/changest/add', data)
  }
}

export function update(data, isAudit) {
  if (isAudit) {
    return request.post('/member/warehouse/changest/updateAndAudit', data)
  } else {
    return request.post('/member/warehouse/changest/update', data)
  }
}

export function del(id) {
  return request.post('/member/warehouse/changest/del', { id: id })
}

export function audit(id) {
  return request.post('/member/warehouse/changest/audit', { id: id })
}

export function unaudit(id) {
  return request.post('/member/warehouse/changest/unaudit', { id: id })
}

export function createsub(data) {
  return request.post('/member/warehouse/changest/createsub', data)
}

export function deletesub(data) {
  return request.post('/member/warehouse/changest/deletesub', data)
}

export function lock(data) {
  return request.post('/member/warehouse/mastock/lock', data)
}

export function print(data) {
  return request.post('/member/warehouse/changest/print', data)
}

export function batchprint(data) {
  return request.post('/member/warehouse/changest/batchprint', data)
}
