import request from '@/utils/request'

// 查询属地检查列表
export function listDependencyMonitor(query) {
  return request({
    url: '/system/dependencyMonitor/list',
    method: 'get',
    params: query
  })
}

// 查询属地检查详细
export function getDependencyMonitor(monitorId) {
  return request({
    url: '/system/dependencyMonitor/' + monitorId,
    method: 'get'
  })
}

// 新增属地检查
export function addDependencyMonitor(data) {
  return request({
    url: '/system/dependencyMonitor',
    method: 'post',
    data: data
  })
}

// 修改属地检查
export function updateDependencyMonitor(data) {
  return request({
    url: '/system/dependencyMonitor',
    method: 'put',
    data: data
  })
}

// 删除属地检查
export function delDependencyMonitor(monitorId) {
  return request({
    url: '/system/dependencyMonitor/' + monitorId,
    method: 'delete'
  })
}
