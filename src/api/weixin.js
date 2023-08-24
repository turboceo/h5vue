import request from '@/utils/request'

export function getWxConfig(query) {
    return request({
        url: '/wx/getWxConfig',
        method: 'get',
        data: {
        },
    })
}
