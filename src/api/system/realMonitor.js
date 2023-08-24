import request from '@/utils/request'

// 查询应急中心監察列表
export function listRealMonitor(query) {
  return request({
    url: '/system/realMonitor/list',
    method: 'get',
    params: query
  })
}

// 查询应急中心監察详细
export function getRealMonitor(monitorId) {
  return request({
    url: '/system/realMonitor/' + monitorId,
    method: 'get'
  })
}

// 新增应急中心監察
export function addRealMonitor(data) {
  return request({
    url: '/system/realMonitor',
    method: 'post',
    data: data
  })
}

// 修改应急中心監察
export function updateRealMonitor(data) {
  return request({
    url: '/system/realMonitor',
    method: 'put',
    data: data
  })
}

// 删除应急中心監察
export function delRealMonitor(monitorId) {
  return request({
    url: '/system/realMonitor/' + monitorId,
    method: 'delete'
  })
}
