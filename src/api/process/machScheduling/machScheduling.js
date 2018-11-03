import request from '@/utils/request'

// 查询
export function list(data) {
  return request({
    url: '/member/process/machscheduling/list',
    method: 'post',
    data
  })
}

// 明细查询
export function machlist(data) {
  return request({
    url: '/member/process/machscheduling/machlist',
    method: 'post',
    data
  })
}

// 机台状态查询
export function machineStatusList(data) {
  return request({
    url: '/member/process/machscheduling/machineStatusList',
    method: 'post',
    data
  })
}

// 机台排单查询
export function machDtOrderList(data) {
  return request({
    url: '/member/process/machscheduling/machDtOrderList',
    method: 'post',
    data
  })
}

// 修改机台
export function update(data) {
  return request({
    url: '/member/process/machscheduling/update',
    method: 'post',
    data
  })
}

// 更新生产排序
export function updateOrderNum(data) {
  return request({
    url: '/member/process/machscheduling/updateOrderNum',
    method: 'post',
    data
  })
}
