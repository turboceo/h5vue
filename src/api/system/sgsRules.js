import request from '@/utils/request'

// 查询SGS物流车辆监控系统影像列表
export function listSgsMonitor(query) {
  return request({
    url: '/system/sgsMonitor/list',
    method: 'get',
    params: query
  })
}

// 查询SGS物流车辆监控系统影像详细
export function getSgsMonitor(monitorId) {
  return request({
    url: '/system/sgsMonitor/' + monitorId,
    method: 'get'
  })
}

// 新增SGS物流车辆监控系统影像
export function addSgsMonitor(data) {
  return request({
    url: '/system/sgsMonitor',
    method: 'post',
    data: data
  })
}

// 修改SGS物流车辆监控系统影像
export function updateSgsMonitor(data) {
  return request({
    url: '/system/sgsMonitor',
    method: 'put',
    data: data
  })
}

// 删除SGS物流车辆监控系统影像
export function delSgsMonitor(monitorId) {
  return request({
    url: '/system/sgsMonitor/' + monitorId,
    method: 'delete'
  })
}
