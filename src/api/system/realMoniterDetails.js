import request from '@/utils/request'

// 查询应急中心监察列表
export function listRealMoniterDetails(query) {
  return request({
    url: '/system/realMoniterDetails/list',
    method: 'get',
    params: query
  })
}

// 查询应急中心监察详细
export function getRealMoniterDetails(id) {
  return request({
    url: '/system/realMoniterDetails/' + id,
    method: 'get'
  })
}

// 新增应急中心监察
export function addRealMoniterDetails(data) {
  return request({
    url: '/system/realMoniterDetails',
    method: 'post',
    data: data
  })
}

// 修改应急中心监察
export function updateRealMoniterDetails(data) {
  return request({
    url: '/system/realMoniterDetails',
    method: 'put',
    data: data
  })
}

// 删除应急中心监察
export function delRealMoniterDetails(id) {
  return request({
    url: '/system/realMoniterDetails/' + id,
    method: 'delete'
  })
}
