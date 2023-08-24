import request from '@/utils/request'

// 查询第三方检查列表
export function listSgsMonitor(query) {
  return request({
    url: '/system/sgsMonitor/list',
    method: 'get',
    params: query
  })
}

// 查询第三方检查详细
export function getSgsMonitor(monitorId) {
  return request({
    url: '/system/sgsMonitor/' + monitorId,
    method: 'get'
  })
}

// 新增第三方检查
export function addSgsMonitor(data) {
  return request({
    url: '/system/sgsMonitor',
    method: 'post',
    data: data
  })
}

// 修改第三方检查
export function updateSgsMonitor(data) {
  return request({
    url: '/system/sgsMonitor',
    method: 'put',
    data: data
  })
}

// 删除第三方检查
export function delSgsMonitor(monitorId) {
  return request({
    url: '/system/sgsMonitor/' + monitorId,
    method: 'delete'
  })
}
