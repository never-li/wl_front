import request from '@/utils/request'

// get请求用params参数
// export function queryList(query) {
//   return request({
//     url: '/v1/queryActivitys',
//     method: 'get',
//     params: query
//   })
// }

export function queryList(data) {
  return request({
    url: 'member/system/role/list',
    method: 'post',
    data
  })
}

export function getAllModuleList() {
  return request({
    url: 'member/system/role/alllist',
    method: 'post'
  })
}
export function getAllRoleList() {
  return request({
    url: 'member/system/role/allrolelist',
    method: 'post'
  })
}

export function getModuleRoleList(data) {
  return request({
    url: 'member/system/role/modulerolelist',
    method: 'post',
    data
  })
}

export function addRole(data) {
  return request({
    url: 'member/system/role/add',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: 'member/system/role/update',
    method: 'post',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: 'member/system/role/del',
    method: 'post',
    data
  })
}
