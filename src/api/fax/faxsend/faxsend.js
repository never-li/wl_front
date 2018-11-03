import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/member/fax/faxsend/list',
    method: 'post',
    data
  })
}

export function resend(id) {
  return request({
    url: '/member/fax/faxsend/resend',
    method: 'post',
    data: { id: id }
  })
}

export function getImg(id) {
  return request({
    url: '/member/fax/faxsend/faximg/' + id,
    method: 'post',
    responseType: 'blob'
  })
}

