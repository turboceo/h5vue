import request from '@/utils/request'

// 查询企业基本信息列表
export function listEnterprise(query) {
  return request({
    url: '/system/enterprise/list',
    method: 'get',
    params: query
  })
}

// 查询企业基本信息详细
export function getEnterprise(id) {
  return request({
    url: '/system/enterprise/' + id,
    method: 'get'
  })
}

// 新增企业基本信息
export function addEnterprise(data) {
  return request({
    url: '/system/enterprise',
    method: 'post',
    data: data
  })
}

// 修改企业基本信息
export function updateEnterprise(data) {
  return request({
    url: '/system/enterprise',
    method: 'put',
    data: data
  })
}

// 删除企业基本信息
export function delEnterprise(id) {
  return request({
    url: '/system/enterprise/' + id,
    method: 'delete'
  })
}
