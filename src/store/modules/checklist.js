/**
 * 检查项目模块
 * @store
 */
import { listTransRole } from "@/api/system/transRole";

/**
* 检查项适配器
* @param {*} item
*/
let transRoleItemAdapter = (item) => {
  // 设置全部检查项为合规
  item.model = 0;
  item.showForm = false;
  // 备注
  item.remark = "";
  item.fileList = [];
  return item;
};

const state = {
  checkList: []
}

const actions = {
  updateCheckListAsync: ({ commit }, payload = {}) => {
    // 获取检查列表
    return listTransRole()
      .then((res) => {
        let list = res.rows.map(transRoleItemAdapter);
        commit('updateCheckList', list)
        return list
      })
      .catch((err) => {
        // Toast("请求异常");
        console.log('log updateCheckListAsync err:')
        console.log(err)
      });
  }
}

const mutations = {
  updateCheckList(state, list) {
    state.checkList = list
  }
}

const getters = {

}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
