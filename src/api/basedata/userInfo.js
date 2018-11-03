import request from '@/utils/request'

// 获取权限设置 (页面权限设置中 --> 3级菜单的数据)
export function getAllModuleList() {
  return request({
    url: 'admin/system/userconfig/alllist',
    method: 'post'

  })
}

export function getModuleRoleList(data) {
  return request({
    url: 'admin/system/userconfig/modulerolelist',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: 'admin/system/userconfig/add',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: 'admin/system/userconfig/update',
    method: 'post',
    data
  })
}

// 获取用户设置列表 (用户左侧表格列表 用户代码 - 用户名称)
export function getList(data) {
  return request({
    url: 'admin/system/userconfig/list',
    method: 'post',
    data
  })
}

// 用户角色查询 (权限设置中拥有的所有用户角色 权限代码 -  权限名称)
export function getAllUserRoleList() {
  return request({
    url: 'admin/system/userconfig/alluserrolelist',
    method: 'post'
  })
}

// 点击用户后 ===》 对应权限设置中的列表
export function getUserRoleList(data) {
  return request({
    url: 'admin/system/userconfig/userrolelist',
    method: 'post',
    data
  })
}

// 点击用户后 ===》 用户权限模块查询 3 级菜单使用
export function getUserModuleList(data) {
  return request({
    url: 'admin/system/userconfig/usermodulelist',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: 'admin/system/userconfig/del',
    method: 'post',
    data
  })
}

