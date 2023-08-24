import request from '@/utils/request'

// 查询车辆列表
export function listTruck(query) {
  return request({
    url: '/system/truck/list',
    method: 'get',
    params: query
  })
}

// 查询车辆详细
export function getTruck(vehiId) {
  return request({
    url: '/system/truck/' + vehiId,
    method: 'get'
  })
}

// 新增车辆
export function addTruck(data) {
  return request({
    url: '/system/truck',
    method: 'post',
    data: data
  })
}

// 修改车辆
export function updateTruck(data) {
  return request({
    url: '/system/truck',
    method: 'put',
    data: data
  })
}

// 删除车辆
export function delTruck(vehiId) {
  return request({
    url: '/system/truck/' + vehiId,
    method: 'delete'
  })
}
