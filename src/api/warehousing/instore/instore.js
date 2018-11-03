import request from '@/utils/request'

export function list(data) { // 列表查询
  return request({
    url: '/member/warehouse/instore/list',
    method: 'post',
    data
  })
}
export function add(data, isAudit) {
  if (isAudit) {
    return request({
      url: '/member/warehouse/instore/addAndAudit',
      method: 'post',
      data
    })
  } else {
    return request({
      url: '/member/warehouse/instore/add',
      method: 'post',
      data
    })
  }
}
export function update(data, isAudit) { // 修改接口
  if (isAudit) {
    return request({
      url: '/member/warehouse/instore/updateAndAudit',
      method: 'post',
      data
    })
  } else {
    return request({
      url: '/member/warehouse/instore/update',
      method: 'post',
      data
    })
  }
}

export function updateforaudit(data) { // 修改接口
  return request({
    url: '/member/warehouse/instore/updateforaudit',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/member/warehouse/instore/del',
    method: 'post',
    data
  })
}

export function dtlistforaudit(data) { // 已审核页面 明细查询
  return request({
    url: '/member/warehouse/instore/dtlistforaudit',
    method: 'post',
    data
  })
}

export function dtlist(data) { // 修改页面 明细查询
  return request({
    url: '/member/warehouse/instore/dtlist',
    method: 'post',
    data
  })
}

export function audit(data) { // 审核
  return request({
    url: '/member/warehouse/instore/audit',
    method: 'post',
    data
  })
}

export function unaudit(data) { // 反审核
  return request({
    url: '/member/warehouse/instore/unaudit',
    method: 'post',
    data
  })
}

export function checkimage(data) { // 反审核
  return request({
    url: '/member/warehouse/instore/checkimage',
    method: 'post',
    data
  })
}

export function print(data) { // 打印
  return request({
    url: '/member/warehouse/instore/print',
    method: 'post',
    data
  })
}
export function batchPrint(data) { // 批量打印
  return request({
    url: '/member/warehouse/instore/batchprint',
    method: 'post',
    data
  })
}

export function check(data) { // 校验明细编号是否重复
  return request({
    url: '/member/warehouse/instore/check',
    method: 'post',
    data
  })
}
