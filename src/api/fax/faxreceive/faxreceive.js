import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/member/fax/faxreceive/faxlist',
    method: 'post',
    data
  })
}

export function updateIsDo(id, isDo, remark, faxType) {
  if (isDo === 1) {
    return request.post('/member/fax/faxreceive/do', { id: id, remark: remark, faxType: faxType })
  } else {
    return request.post('/member/fax/faxreceive/undo', { id: id, remark: remark, faxType: faxType })
  }
}

export function getImg(id, imgNo) {
  return request({
    url: '/member/fax/faxreceive/faximg/' + id + '/' + imgNo,
    method: 'post',
    responseType: 'blob'
  })
}

export function getBillFaxList(data) {
  return request({
    url: '/member/fax/faxreceive/billfaxlist',
    method: 'post',
    data
  })
}
