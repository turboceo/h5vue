import request from '@/utils/request'

// 查询地址列表
export function listTransport(query) {
  return request({
    url: '/system/transport/list',
    method: 'get',
    params: query
  })
}

// 查询地址详细
export function getTransport(tranId) {
  return request({
    url: '/system/transport/' + tranId,
    method: 'get'
  })
}

// 新增地址
export function addTransport(data) {
  return request({
    url: '/system/transport',
    method: 'post',
    data: data
  })
}

// 修改地址
export function updateTransport(data) {
  return request({
    url: '/system/transport',
    method: 'put',
    data: data
  })
}

// 删除地址
export function delTransport(tranId) {
  return request({
    url: '/system/transport/' + tranId,
    method: 'delete'
  })
}
