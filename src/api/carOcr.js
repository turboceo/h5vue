import request from '@/utils/request'

/**
 * 车牌号识别
 * @param {Object} data 
 * @returns {Promise}
 * 
 */
export function carOcr(data) {
    return request({
        url: '/common/carOcr',
        method: 'post',
        headers: { 'Content-Type': 'multipart/form-data' },
        data
    })
}