<template>
  <div class="bg-gray content--area">
    <div class="box" v-for="item in list" :key="item.id">
      <div class="van-cell van-cell--center van-field justify-between">
        <span>整改说明:</span>
        <span>已完成整改，详情见附件</span>
      </div>
      <div class="van-cell van-cell--center van-field justify-between" @click="sceneImg(item && item.evinAction || [],  0)">
        <span>整改图片:</span>
        <span>
          <van-icon name="photo" />({{ (item.evinAction || []).length }})
        </span>
      </div>
      <div class="van-cell van-cell--center van-field justify-between"  @click="sceneImg(item && item.wrapup || [],  0)">
        <span>整改报告:</span>
        <span>
          <van-icon name="column" />({{  (item.wrapup || []).length }})
        </span>
      </div>
      <div class="van-cell van-cell--center van-field justify-between">
        <span>整改人:</span>
        <span>
          {{  item.createBy }}
        </span>
      </div>
      <div class="van-cell van-cell--center van-field justify-between">
        <span>提交时间:</span>
        <span>
          {{  item.updateTime }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import VantPreviewMixin from './mixins/image-preview'

export default {
  name: 'RectificationLogTable',

  mixins: [VantPreviewMixin],

  computed: {
    ...mapState('notification', ['form']),
  },

  data() {
    return {
      list: [],
    };
  },

  created() {
    let listAdapter = s => s.split(',')
    this.list = this.form.list.map(item => {
      item.evinAction = listAdapter(item.evinAction)
      item.wrapup = listAdapter(item.wrapup)
      return item
    })
  },
};
</script>


<style lang="scss" scoped>
.box {
  margin-bottom: 15px;
}
</style>