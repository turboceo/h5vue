import request from '@/utils/request'

// 查询路卡列表
export function listRoadCard(query) {
  return request({
    url: '/system/roadCard/list',
    method: 'get',
    params: query
  })
}

// 查询路卡详细
export function getRoadCard(id) {
  return request({
    url: '/system/roadCard/' + id,
    method: 'get'
  })
}

// 新增路卡
export function addRoadCard(data) {
  return request({
    url: '/system/roadCard',
    method: 'post',
    data: data
  })
}

// 修改路卡
export function updateRoadCard(data) {
  return request({
    url: '/system/roadCard',
    method: 'put',
    data: data
  })
}

// 删除路卡
export function delRoadCard(id) {
  return request({
    url: '/system/roadCard/' + id,
    method: 'delete'
  })
}
