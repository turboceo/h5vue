import request from '@/utils/request'

// 查询测试代码生成器列表
export function listTtt(query) {
  return request({
    url: '/business/ttt/list',
    method: 'get',
    params: query
  })
}

// 查询测试代码生成器详细
export function getTtt(id) {
  return request({
    url: '/business/ttt/' + id,
    method: 'get'
  })
}

// 新增测试代码生成器
export function addTtt(data) {
  return request({
    url: '/business/ttt',
    method: 'post',
    data: data
  })
}

// 修改测试代码生成器
export function updateTtt(data) {
  return request({
    url: '/business/ttt',
    method: 'put',
    data: data
  })
}

// 删除测试代码生成器
export function delTtt(id) {
  return request({
    url: '/business/ttt/' + id,
    method: 'delete'
  })
}

// 导出测试代码生成器
export function exportTtt(query) {
  return request({
    url: '/business/ttt/export',
    method: 'get',
    params: query
  })
}