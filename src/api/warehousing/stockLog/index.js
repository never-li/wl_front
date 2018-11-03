import request from '@/utils/request'

export function list(data) {
  return request.post('/member/warehouse/stockflow/list', data)
}
