import request from '@/utils/request'

// 查询第三方检查列表
export function listSgsMoniterDetails(query) {
  return request({
    url: '/system/sgsMoniterDetails/list',
    method: 'get',
    params: query
  })
}

// 查询第三方检查详细
export function getSgsMoniterDetails(id) {
  return request({
    url: '/system/sgsMoniterDetails/' + id,
    method: 'get'
  })
}

// 新增第三方检查
export function addSgsMoniterDetails(data) {
  return request({
    url: '/system/sgsMoniterDetails',
    method: 'post',
    data: data
  })
}

// 修改第三方检查
export function updateSgsMoniterDetails(data) {
  return request({
    url: '/system/sgsMoniterDetails',
    method: 'put',
    data: data
  })
}

// 删除第三方检查
export function delSgsMoniterDetails(id) {
  return request({
    url: '/system/sgsMoniterDetails/' + id,
    method: 'delete'
  })
}
