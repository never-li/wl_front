import request from '@/utils/request'

export function addUser(data) {
  return request({
    url: '/member/system/userconfig/add',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/member/system/userconfig/update',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/member/system/userconfig/del',
    method: 'post',
    data
  })
}

export function queryList(data) {
  return request({
    url: '/member/system/userconfig/list',
    method: 'post',
    data
  })
}

export function getRoleListByMid(data) {
  return request({
    url: '/member/system/userconfig/userrolelist',
    method: 'post',
    data
  })
}
export function getModuleListByMid(data) {
  return request({
    url: '/member/system/userconfig/usermodulelist',
    method: 'post',
    data
  })
}

export function getUserStoreList(data) {
  return request({
    url: '/member/system/userconfig/userstorelist',
    method: 'post',
    data
  })
}

export function getNoUserStoreList(data) {
  return request({
    url: '/member/system/userconfig/nouserstorelist',
    method: 'post',
    data
  })
}
export function allUserRoleList(data) {
  return request({
    url: '/member/system/userconfig/alluserrolelist',
    method: 'post',
    data
  })
}
