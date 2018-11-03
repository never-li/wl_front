import request from '@/utils/request'

export function goodslist(data) { // 提货货物查询
  return request.post('/member/process/newmach/goodslist', data)
}

export function lock(data) { // 锁定货物 revert: 0 锁定 1解锁
  return request.post('/member/warehouse/mastock/lock', data)
}

export function add(data) { // 新增
  return request.post('/member/process/newmach/add', data)
}

export function addAndAudit(data) { // 新增
  return request.post('/member/process/newmach/addAndAudit', data)
}

export function update(data) { // 更新
  return request.post('/member/process/newmach/update', data)
}

export function updateAndAudit(data) { // 更新
  return request.post('/member/process/newmach/updateAndAudit', data)
}

export function del(data) { // 删除
  return request.post('/member/process/newmach/delete', data)
}

export function list(data) { // 查询加工单列表
  return request.post('/member/process/newmach/list', data)
}

export function dtList(data) { // 查询加工单明细
  return request.post('/member/process/newmach/dtlist', data)
}

export function audit(data) { // 审核
  return request.post('/member/process/newmach/audit', data)
}

export function unaudit(data) { // 反审核
  return request.post('/member/process/newmach/unaudit', data)
}

export function print(data) { // 打印
  return request.post('/member/process/newmach/print', data)
}

export function remarkTemplList(data) { // 备注模版列表
  return request.post('/member/process/newmach/remarkTemplList', data)
}

export function addRemarkTempl(data) { // 添加备注模版列表
  return request.post('/member/process/newmach/addRemarkTempl', data)
}

export function deleteRemarkTempl(data) { // 删除备注模版列表
  return request.post('/member/process/newmach/deleteRemarkTempl', data)
}

export function pdview(data) { // 查询成品明细列表
  return request.post('/member/process/newmach/pdview', data)
}

export function close(data) { // 确认
  return request.post('/member/process/newmach/close', data)
}

export function unclose(data) { // 反确认
  return request.post('/member/process/newmach/unclose', data)
}
