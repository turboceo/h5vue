<template>
  <div class="check--view">
    <div class="p-15">
      <CardBox title="违规信息" :show-toggler="false" type="simple">
        <div class="bg--white content--area" :class="{ 'is--more': show }">
          <van-field v-model="form.tmsMoniterVo.inspdstartTime" input-align="right" center clearable label="发现时间:"
            placeholder="请输入" :readonly="true">
          </van-field>
          <van-field v-model="form.carrierName" input-align="right" center clearable label="承运商:" placeholder="请输入"
            :readonly="true">
          </van-field>
          <van-field v-model="form.tmsWaybillVo.truckNo" input-align="right" center clearable label="车牌号:"
            placeholder="请输入" :readonly="true">
          </van-field>
          <van-field v-model="form.tmsMoniterVo.briefCont" input-align="right" center clearable label="违规内容:"
            placeholder="请输入" :readonly="true">
          </van-field>
          <template v-if="form.tmsMoniterVo.evidVid.length > 0">
            <van-field input-align="right" center clearable label="现场视频:" :readonly="true">
              <template #input>
                <van-button plain hairline type="primary" @click="debounceClickVideoArrow('prev')"
                  :disabled="isPrevDisabled" size="small" icon="arrow-left"></van-button>
                <span>&nbsp;</span>
                <van-button plain hairline type="primary" @click="debounceClickVideoArrow('next')"
                  :disabled="isNextDisabled" size="small" icon="arrow"></van-button>
              </template>
            </van-field>
            <div class="video--grallery bg--white">
              <video class="video--file" controls :src="form.tmsMoniterVo.evidVid[videoIndex]">
                你的浏览器不支持视频
              </video>
            </div>
          </template>
          <template v-else>
            <van-field input-align="right" center clearable label="现场视频:" :readonly="true" value="暂无视频">
            </van-field>
          </template>

          <van-field center clearable label="现场图片:" placeholder="" readonly>
            <template #input>
              <p v-show="form.tmsMoniterVo.evidPic.length === 0" style="text-align: right; width: 100%;">暂无图片</p>
            </template>
          </van-field>

          <div class="image--container">
            <van-row>
              <van-col span="8" v-for="(item, $index) in form.tmsMoniterVo.evidPic" :key="$index">
                <img class="grid-item" :src="item" @click="sceneImg(form.tmsMoniterVo.evidPic, $index)">
              </van-col>
            </van-row>
          </div>
        </div>

        <!-- <span class="viewmore--trigger" v-show="!show" @click="show = !show">显示更多信息
          <svg-icon icon-class="arrow-right" class="icon viewmore--trigger---icon"></svg-icon>
        </span> -->
      </CardBox>
    </div>
  </div>
</template>

<script>
import CardBox from 'components/CardBox/IndexView.vue'
import { mapState } from 'vuex'

import debounce from 'lodash/debounce'

import VantPreviewMixin from './mixins/image-preview'

const VideoMixin = {
  data() {
    return {
      videoIndex: 0,
    }
  },

  computed: {
    isPrevDisabled() {
      return this.videoIndex === 0
    },

    isNextDisabled() {
      return this.videoIndex === this.form.tmsMoniterVo.evidVid.length - 1
    },
  },

  methods: {
    clickVideoArrow(action) {
      debugger
      let delta = action === 'prev' ? -1 : 1
      this.videoIndex += delta
    },
  },

  created() {
    this.debounceClickVideoArrow = debounce(this.clickVideoArrow, 250)
  }
}


export default {
  name: 'ViolationInfoCard',

  mixins: [VantPreviewMixin, VideoMixin],

  components: {
    CardBox,
  },

  computed: {
    ...mapState('notification', ['form']),
  },

  data() {
    return {
      show: false
    }
  },

  methods: {
    handleItemPreview(item) {
      ImagePreview(['https://img01.yzcdn.cn/vant/apple-2.jpg']);
    }
  }
}
</script>

<style lang="scss" scoped>
// 通知栏
.high--contract {
  border-bottom: 1px solid #15151540;
}

.check--view {
  background: #f7f7f7;
}

.video--grallery {
  padding: 10px 16px;
}

.video--file {
  width: 100%;
  height: 160px;
}

.image--container {
  padding: 10px;
}

.grid-item {
  width: 100%;
  height: 100px;
  box-sizing: border-box;
  padding: 5px;
  background-size: cover;
}

.viewmore--trigger {
  position: absolute;
  bottom: -30px;
  left: 15px;
  font-weight: 500;
  color: #5469f6;
  z-index: 2;
  font-size: 16px;
}
</style>
