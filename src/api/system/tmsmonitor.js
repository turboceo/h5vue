import request from '@/utils/request'

// 查询执行岗位
export function getExcuteList(id, wayBillID) {
  return request({
    url: `/system/tmsmonitor/excute/${id}/${wayBillID}`,
    method: 'get',
    params: query || {}
  })
}
