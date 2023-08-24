import request from '@/utils/request'

export function getCompletedNotification(params) {
    return request({
        url: '/system/notification/completed',
        method: 'get',
        params
    })
}