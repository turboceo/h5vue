import request from '@/utils/request'

// 查询事件节点关联人列表
export function listProcessNode(query) {
  return request({
    url: '/system/processNode/list',
    method: 'get',
    params: query
  })
}

// 查询事件节点关联人详细
export function getProcessNode(id) {
  return request({
    url: '/system/processNode/' + id,
    method: 'get'
  })
}

// 新增事件节点关联人
export function addProcessNode(data) {
  return request({
    url: '/system/processNode',
    method: 'post',
    data: data
  })
}

// 修改事件节点关联人
export function updateProcessNode(data) {
  return request({
    url: '/system/processNode',
    method: 'put',
    data: data
  })
}

// 删除事件节点关联人
export function delProcessNode(id) {
  return request({
    url: '/system/processNode/' + id,
    method: 'delete'
  })
}
