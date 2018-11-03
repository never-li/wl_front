import request from '@/utils/request'

// 列表查询
export function list(data) {
  return request({
    url: '/member/process/machpack/list',
    method: 'post',
    data
  })
}

// 加工打包查询
export function queryMachPackInfo(data) {
  return request({
    url: '/member/process/machpack/queryMachPackInfo',
    method: 'post',
    data
  })
}

// 木架查询
export function usedBattenDtList(data) {
  return request({
    url: '/member/process/machpack/usedBattenDtList',
    method: 'post',
    data
  })
}

// 开料规格查询
export function specDtList(data) {
  return request({
    url: '/member/process/machpack/specDtList',
    method: 'post',
    data
  })
}

// 选择领料明细查询查询
export function selectUseList(data) {
  return request({
    url: '/member/process/machpack/selectUseList',
    method: 'post',
    data
  })
}

// 已领料明细查询
export function useList(data) {
  return request({
    url: '/member/process/machpack/useList',
    method: 'post',
    data
  })
}

// 领料
export function selectGood(data) {
  return request({
    url: '/member/process/machpack/selectGood',
    method: 'post',
    data
  })
}

// 取消领料
export function cancelGood(data) {
  return request({
    url: '/member/process/machpack/cancelGood',
    method: 'post',
    data
  })
}

// 选择成品查询
export function selectPdGoodList(data) {
  return request({
    url: '/member/process/machpack/selectPdGoodList',
    method: 'post',
    data
  })
}

// 成品打包
export function addPdPack(data) {
  return request({
    url: '/member/process/machpack/addPdPack',
    method: 'post',
    data
  })
}

// 选择边料查询
export function selectWasteList(data) {
  return request({
    url: '/member/process/machpack/selectWasteList',
    method: 'post',
    data
  })
}

// 边料打包
export function addWastePack(data) {
  return request({
    url: '/member/process/machpack/addWastePack',
    method: 'post',
    data
  })
}

// 成品打包信息查询
export function pdPackList(data) {
  return request({
    url: '/member/process/machpack/pdPackList',
    method: 'post',
    data
  })
}

// 成品打包明细信息查询
export function pdPackDtList(blid) {
  const data = { blid: blid }
  return request({
    url: '/member/process/machpack/pdPackDtList',
    method: 'post',
    data
  })
}

// 选择卷回查询
export function selectRollbackList(data) {
  return request({
    url: '/member/process/machpack/selectRollbackList',
    method: 'post',
    data
  })
}

// 卷回打包
export function addRollbackPack(data) {
  return request({
    url: '/member/process/machpack/addRollbackPack',
    method: 'post',
    data
  })
}

// 删除卷回打包
export function deleteRollbackPack(data) {
  return request({
    url: '/member/process/machpack/deleteRollbackPack',
    method: 'post',
    data
  })
}

// 卷回打包信息查询
export function rollbackPackList(data) {
  return request({
    url: '/member/process/machpack/rollbackPackList',
    method: 'post',
    data
  })
}

// 拆包
export function unPack(data) {
  return request({
    url: '/member/process/machpack/unPack',
    method: 'post',
    data
  })
}

// 修改包装
export function updatePack(data) {
  return request({
    url: '/member/process/machpack/updatePack',
    method: 'post',
    data
  })
}

// 包装复制
export function copyPack(data) {
  return request({
    url: '/member/process/machpack/copyPack',
    method: 'post',
    data
  })
}

// 并包
export function joinPack(data) {
  return request({
    url: '/member/process/machpack/joinPack',
    method: 'post',
    data
  })
}

// 完成加工
export function finishMach(data) {
  return request({
    url: '/member/process/machpack/finishMach',
    method: 'post',
    data
  })
}

// 取消加工
export function cancelMach(data) {
  return request({
    url: '/member/process/machpack/cancelMach',
    method: 'post',
    data
  })
}

// 标签打印
export function labelPrint(data) {
  return request({
    url: '/member/process/machpack/packpdf',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 自定义标签打印
export function labelCustomPrint(data) {
  return request({
    url: '/member/process/machpack/packpdfcustom',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
