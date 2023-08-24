import request from '@/utils/request'

// 查询SGS防御性驾驶判定细则列表
export function listSgsRule(query) {
  return request({
    url: '/system/sgsRule/list',
    method: 'get',
    params: query
  })
}

// 查询SGS防御性驾驶判定细则详细
export function getSgsRule(id) {
  return request({
    url: '/system/sgsRule/' + id,
    method: 'get'
  })
}

// 新增SGS防御性驾驶判定细则
export function addSgsRule(data) {
  return request({
    url: '/system/sgsRule',
    method: 'post',
    data: data
  })
}

// 修改SGS防御性驾驶判定细则
export function updateSgsRule(data) {
  return request({
    url: '/system/sgsRule',
    method: 'put',
    data: data
  })
}

// 删除SGS防御性驾驶判定细则
export function delSgsRule(id) {
  return request({
    url: '/system/sgsRule/' + id,
    method: 'delete'
  })
}
