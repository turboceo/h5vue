import request from '@/utils/request'

// 查询百规列表
export function listTransRole(query) {
  return request({
    url: '/system/transRole/list',
    method: 'get',
    // params: query
  })
}

// 查询百规详细
export function getTransRole(id) {
  return request({
    url: '/system/transRole/' + id,
    method: 'get'
  })
}

// 新增百规
export function addTransRole(data) {
  return request({
    url: '/system/transRole',
    method: 'post',
    data: data
  })
}

// 修改百规
export function updateTransRole(data) {
  return request({
    url: '/system/transRole',
    method: 'put',
    data: data
  })
}

// 删除百规
export function delTransRole(id) {
  return request({
    url: '/system/transRole/' + id,
    method: 'delete'
  })
}

// 百规不分页查询
export function getAllTransRole(briefCont = '') {
  return request({
    url: '/system/transRole/alllist',
    method: 'get',
    params: {
      briefCont
    }
  })
}



