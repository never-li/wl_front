import request from '@/utils/request'

export function list(data) {
  return request.post('/member/warehouse/outstore/list', data)
}

export function stockList(data) { // 提货货物查询
  return request.post('/member/warehouse/outstore/stocklist', data)
}

export function add(data) { // 提货新增
  return request.post('/member/warehouse/outstore/add', data)
}

export function addAndAudit(data) { // 提货新增并审核
  return request.post('/member/warehouse/outstore/addAndAudit', data)
}

export function del(data) { // 提货新增
  return request.post('/member/warehouse/outstore/del', data)
}

export function update(data) { // 提货修改
  return request.post('/member/warehouse/outstore/update', data)
}

export function updateAndAudit(data) { // 提货修改并审核
  return request.post('/member/warehouse/outstore/updateAndAudit', data)
}

export function lock(data) { // 锁定货物 revert: 0 锁定 1解锁
  return request.post('/member/warehouse/mastock/lock', data)
}

export function dtList(data) { // 货物明细查询
  return request.post('/member/warehouse/outstore/dtlist', data)
}

export function feeInfo(data) { // 查仓租单价
  return request.post('/commondata/mastorefeeinfo', data)
}

export function outPrice(data) { // 查出仓单价
  return request.post('/commondata/batchmastockoutprice', data)
}

export function audit(data) { // 审核
  return request.post('/member/warehouse/outstore/audit', data)
}

export function unaudit(data) { // 反审核
  return request.post('/member/warehouse/outstore/unaudit', data)
}

export function dispatch(data) { // 记录发货
  return request.post('/member/warehouse/outstore/dispatch', data)
}

export function deldispatch(data) { //  删除发货
  return request.post('/member/warehouse/outstore/deldispatch', data)
}

export function queryDispatchData(data) { //  发货信息查询
  return request.post('/member/warehouse/outstore/queryDispatchData', data)
}

export function updateForAudit(data) { //  提货改单
  return request.post('/member/warehouse/outstore/updateForAudit', data)
}

export function print(data) {
  return request.post('/member/warehouse/outstore/print', data)
}

export function batchprint(data) {
  return request.post('/member/warehouse/outstore/batchprint', data)
}

export function getPrintList(data) {
  return request.post('/member/warehouse/outstore/getPrintList', data)
}
