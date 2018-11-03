import request from '@/utils/request'

export function list(data) { // 列表查询
  return request({
    url: '/member/warehouse/change/list',
    method: 'post',
    data
  })
}

export function add(data, isAudit) {
  if (isAudit) {
    return request({
      url: '/member/warehouse/change/addAndAudit',
      method: 'post',
      data
    })
  } else {
    return request({
      url: '/member/warehouse/change/add',
      method: 'post',
      data
    })
  }
}

export function del(data) {
  return request({
    url: '/member/warehouse/change/del',
    method: 'post',
    data
  })
}

export function update(data, isAudit) {
  if (isAudit) {
    return request({
      url: '/member/warehouse/change/updateAndAudit',
      method: 'post',
      data
    })
  } else {
    return request({
      url: '/member/warehouse/change/update',
      method: 'post',
      data
    })
  }
}

export function stocklist(data) {
  return request({
    url: '/member/warehouse/change/stocklist',
    method: 'post',
    data
  })
}
export function dtStocklist(data) {
  return request({
    url: '/member/warehouse/change/dtstocklist',
    method: 'post',
    data
  })
}

export function mastorefeeinfo(data) {
  return request({
    url: '/commondata/mastorefeeinfo',
    method: 'post',
    data
  })
}

export function dtlist(data) {
  return request({
    url: '/member/warehouse/change/dtlist',
    method: 'post',
    data
  })
}

export function audit(id) {
  return request({
    url: '/member/warehouse/change/audit',
    method: 'post',
    data: { id: id }
  })
}

export function unaudit(id) {
  return request({
    url: '/member/warehouse/change/unaudit',
    method: 'post',
    data: { id: id }
  })
}

export function lock(data) {
  return request.post('/member/warehouse/mastock/lock', data)
}

export function dtlistforaudit(data) {
  return request({
    url: '/member/warehouse/change/dtlistforaudit',
    method: 'post',
    data
  })
}

export function updateforaudit(data) {
  return request.post('/member/warehouse/change/updateforaudit', data)
}

export function print(data) {
  return request.post('/member/warehouse/change/print', data)
}

export function batchprint(data) {
  return request.post('/member/warehouse/change/batchprint', data)
}

export function getPrintList(data) {
  return request.post('/member/warehouse/change/getPrintList', data)
}
