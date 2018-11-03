import request from '@/utils/request'

export function list(data) {
  return request.post('/member/process/outstorepd/list', data)
}

export function stocklist(data) { // 提货货物查询
  return request.post('/member/process/changepd/stocklist', data)
}

export function add(data) { // 提货新增
  return request.post('/member/process/outstorepd/add', data)
}

export function del(data) { // 提货删除
  return request.post('/member/process/outstorepd/del', data)
}

export function update(data) { // 提货修改
  return request.post('/member/process/outstorepd/update', data)
}

export function lock(data) { // 锁定货物 revert: 0 锁定 1解锁
  return request.post('/member/process/changepd/lockgoods', data)
}

export function dtList(data) { // 货物明细查询
  return request.post('/member/process/outstorepd/dtlist', data)
}

export function feeInfo(data) { // 查仓租单价
  return request.post('/member/process/changepd/getStoreFeeDtFromPdPack', data)
}

export function outPrice(data) { // 查出仓单价
  return request.post('/commondata/batchmastockoutprice', data)
}

export function audit(data) { // 审核
  return request.post('/member/process/outstorepd/audit', data)
}

export function unaudit(data) { // 反审核
  return request.post('/member/process/outstorepd/unaudit', data)
}

export function dispatch(data) { // 记录发货
  return request.post('/member/process/outstorepd/dispatch', data)
}

export function deldispatch(data) { //  删除发货
  return request.post('/member/process/outstorepd/deldispatch', data)
}

export function queryDispatchData(data) { //  发货信息查询
  return request.post('/member/process/outstorepd/queryDispatchData', data)
}

export function updateForAudit(data) { //  提货改单
  return request.post('/member/process/outstorepd/updateForAudit', data)
}

export function print(data) {
  return request.post('/member/process/outstorepd/print', data)
}

export function batchprint(data) {
  return request.post('/member/process/outstorepd/batchPrint', data)
}

export function getPrintList(data) {
  return request.post('/member/process/outstorepd/getPrintList', data)
}
