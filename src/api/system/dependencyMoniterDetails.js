import request from '@/utils/request'

// 查询应急中心监察列表
export function listDependencyMoniterDetails(query) {
  return request({
    url: '/system/dependencyMoniterDetails/list',
    method: 'get',
    params: query
  })
}

// 查询应急中心监察详细
export function getDependencyMoniterDetails(id) {
  return request({
    url: '/system/dependencyMoniterDetails/' + id,
    method: 'get'
  })
}

// 新增应急中心监察
export function addDependencyMoniterDetails(data) {
  return request({
    url: '/system/dependencyMoniterDetails',
    method: 'post',
    data: data
  })
}

// 修改应急中心监察
export function updateDependencyMoniterDetails(data) {
  return request({
    url: '/system/dependencyMoniterDetails',
    method: 'put',
    data: data
  })
}

// 删除应急中心监察
export function delDependencyMoniterDetails(id) {
  return request({
    url: '/system/dependencyMoniterDetails/' + id,
    method: 'delete'
  })
}
