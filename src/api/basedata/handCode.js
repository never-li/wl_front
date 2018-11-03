import request from '@/utils/request'

export function queryList(data) {
  return request({
    url: 'member/basedata/handcode/list',
    method: 'post',
    data
  })
}

export function addCode(data) {
  return request({
    url: 'member/basedata/handcode/add',
    method: 'post',
    data
  })
}

export function updateCode(data) {
  return request({
    url: 'member/basedata/handcode/update',
    method: 'post',
    data
  })
}

export function deleteCode(data) {
  return request({
    url: 'member/basedata/handcode/del',
    method: 'post',
    data
  })
}

export function terminate(data) {
  return request({
    url: 'member/basedata/handcode/terminate',
    method: 'post',
    data
  })
}

export function getNum(data) {
  return request({
    url: 'member/basedata/handcode/getnum',
    method: 'post',
    data
  })
}
