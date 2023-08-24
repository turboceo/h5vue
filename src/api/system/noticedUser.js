import request from '@/utils/request'

// 查询通知用户列表
export function listNoticedUser(query) {
  return request({
    url: '/system/noticedUser/list',
    method: 'get',
    params: query
  })
}

// 查询通知用户详细
export function getNoticedUser(id) {
  return request({
    url: '/system/noticedUser/' + id,
    method: 'get'
  })
}

// 新增通知用户
export function addNoticedUser(data) {
  return request({
    url: '/system/noticedUser',
    method: 'post',
    data: data
  })
}

// 修改通知用户
export function updateNoticedUser(data) {
  return request({
    url: '/system/noticedUser',
    method: 'put',
    data: data
  })
}

// 删除通知用户
export function delNoticedUser(id) {
  return request({
    url: '/system/noticedUser/' + id,
    method: 'delete'
  })
}
