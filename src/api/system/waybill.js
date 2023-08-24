import request from '@/utils/request'

// 查询运单列表
export function listWaybill(query) {
  return request({
    url: '/system/waybill/list2',
    method: 'get',
    params: query
  })
}

// 查询运单详细
export function getWaybill(companyCode) {
  return request({
    url: '/system/waybill/' + companyCode,
    method: 'get'
  })
}

// 新增运单
export function addWaybill(data) {
  return request({
    url: '/system/waybill',
    method: 'post',
    data: data
  })
}

// 修改运单
export function updateWaybill(data) {
  return request({
    url: '/system/waybill',
    method: 'put',
    data: data
  })
}

// 删除运单
export function delWaybill(deliNos) {
  return request({
    url: '/system/waybill/' + deliNos,
    method: 'delete'
  })
}
