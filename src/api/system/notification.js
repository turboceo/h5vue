import request from '@/utils/request'

// 查询告知书列表
export function listNotification(query) {
  return request({
    url: '/system/notification/list',
    method: 'get',
    params: query
  })
}

// 查询告知书详细
export function getNotification(id) {
  return request({
    url: '/system/notification/' + id,
    method: 'get'
  })
}

// 新增告知书
export function addNotification(data) {
  return request({
    url: '/system/notification',
    method: 'post',
    data: data
  })
}

// 修改告知书
export function updateNotification(data) {
  return request({
    url: '/system/notification',
    method: 'put',
    data: data
  })
}

// 删除告知书
export function delNotification(id) {
  return request({
    url: '/system/notification/' + id,
    method: 'delete'
  })
}

// 提醒中心报表
export function getNotificationReport() {
  return request({
    url: '/system/notification/report',
    method: 'get'
  })
}

export function doAction(type, data) {
  return request({
    url: `/system/tmsmonitor/action/${type}`,
    method: 'post',
    data: data
  })
}
