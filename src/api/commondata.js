import request from '@/utils/request'

/**
 * 获取用户信息
 */
export function userinfo() {
  return request({
    url: '/commondata/userinfo',
    method: 'post'
  })
}

/**
 * 获取仓库会员
 */
export function member() {
  return request({
    url: '/commondata/member',
    method: 'post'
  })
}

/**
 * 获取仓库
 */
export function store() {
  return request({
    url: '/commondata/store',
    method: 'post'
  })
}

/**
 * 获取钢厂
 */
export function factory() {
  return request({
    url: '/commondata/factory',
    method: 'post'
  })
}

/**
 * 获取品名
 */
export function type() {
  return request({
    url: '/commondata/type',
    method: 'post'
  })
}

/**
 * 获取类别
 */
export function sort() {
  return request({
    url: '/commondata/sort',
    method: 'post'
  })
}

/**
 * 获取钢号
 */
export function grade() {
  return request({
    url: '/commondata/grade',
    method: 'post'
  })
}

/**
 * 获取费用类别
 */
export function feeconfig() {
  return request({
    url: '/commondata/feeconfig',
    method: 'post'
  })
}

/**
 * 获取银行
 */
export function bank() {
  return request({
    url: '/commondata/bank',
    method: 'post'
  })
}

/**
 * 获取规格
 */
export function spec() {
  return request({
    url: '/commondata/spec',
    method: 'post'
  })
}

/**
 * 获取用户
 */
export function user() {
  return request({
    url: '/commondata/user',
    method: 'post'
  })
}

/**
 * 获取客户
 */
export function customer() {
  return request({
    url: '/commondata/customer',
    method: 'post'
  })
}

/**
 * 获取加工机台（加工类型）
 */
export function machtype() {
  return request({
    url: '/commondata/machtype',
    method: 'post'
  })
}

/**
 * 获取加工机组
 */
export function machine() {
  return request({
    url: '/commondata/machine',
    method: 'post'
  })
}

/**
 * 获取吊机工
 */
export function craners() {
  return request({
    url: '/commondata/craners',
    method: 'post'
  })
}

/**
 * 获取装卸工
 */
export function handors() {
  return request({
    url: '/commondata/handors',
    method: 'post'
  })
}

/**
 * 获取包装备注
 */
export function packremark() {
  return request({
    url: '/commondata/packremark',
    method: 'post'
  })
}

/**
 * 获取系统参数
 */
export function systemset() {
  return request({
    url: '/commondata/systemset',
    method: 'post'
  })
}

/**
 * 获取付款方式
 */
export function paymode() {
  return request({
    url: '/commondata/paymode',
    method: 'post'
  })
}

/**
 * 获取组别
 */
export function department() {
  return request({
    url: '/commondata/department',
    method: 'post'
  })
}

/**
 * 获取全部系统参数
 */
export function systemparm() {
  return request({
    url: '/commondata/systemparm',
    method: 'post'
  })
}

/**
 * 获取集团
 */
export function membergroup() {
  return request({
    url: '/commondata/membergroup',
    method: 'post'
  })
}

/**
 * 获取原料出仓单价
 */
export function mastockoutprice() {
  return request({
    url: '/commondata/mastockoutprice',
    method: 'post'
  })
}

/**
 * 获取原料仓租信息
 */
export function mastorefeeinfo() {
  return request({
    url: '/commondata/mastorefeeinfo',
    method: 'post'
  })
}

/**
 * 获取收发货员
 */
export function receivers() {
  return request({
    url: '/commondata/receivers',
    method: 'post'
  })
}

/**
 * 获取费用内容
 */
export function feetype() {
  return request({
    url: '/commondata/feetype',
    method: 'post'
  })
}

/**
 * 获取雇员（仓管）
 */
export function empname() {
  return request({
    url: '/commondata/empname',
    method: 'post'
  })
}

/**
 * 获取原料出仓单价（批量）
 */
export function batchmastockoutprice() {
  return request({
    url: '/commondata/batchmastockoutprice',
    method: 'post'
  })
}

/**
 * 获取加工费选项
 */
export function machfeeoptions() {
  return request({
    url: '/commondata/machfeeoptions',
    method: 'post'
  })
}
