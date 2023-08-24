import { getNotification } from '@/api/system/notification';

import { getField, updateField } from 'vuex-map-fields';

const state = {
  form: {}
  // form: {
  //   tmsWaybillVo: {},
  //   tmsMoniterVo: {
  //     evidPic: [],
  //     evidVid: '',
  //   },
  //   nodeVoList: [],
  // },
}

const actions = {
  updateNotificationDetailAsync: ({ commit }, payload) => {
    let { noticeId } = payload
    // commit('setLoading', true, { root: true }) // 调用全局vuex的setLoading方法
    return getNotification(noticeId).then(response => {
      commit('updateNotificationDetail', response)
      return response
    })
  }
}

const mutations = {
  updateField,

  updateNotificationDetail(state, response) {
    let data = response.data;

    // data.tmsMoniterVo.evidVid = 'http://zsh-pyzl.oss-cn-shenzhen.aliyuncs.com/2023/03/30/e3e06a64716146938d501158ac73d048.mp4,http://39.104.179.27:9000/pyzltest/2023/03/30/292e751015c24c59a022b64ddfa59c93.mp4'

    data.tmsMoniterVo.evidVid = data.tmsMoniterVo.evidVid ? data.tmsMoniterVo.evidVid.split(',') : [];

    let picList = data.tmsMoniterVo.evidPic
    data.tmsMoniterVo.evidPic = picList === ''
      ? []
      : picList.split(',');

    console.log(data.tmsMoniterVo)

    let newObj = Object.assign({}, state.form, data)
    state.form = newObj
  }
}

const getters = {
  getField,
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
