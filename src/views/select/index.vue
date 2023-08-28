<template>
    <div class="select--view">
        <div class="p-15">
            <template v-if="showConfirm">
                <CardBox class="fixed--title" :title="'已检出违规项(共' + submitList.length + '条)'" :show-toggler="false"
                    type="simple">
                </CardBox>
                <div class="card--list">
                    <div class="card--box" v-for="item in previewList" :key="item.id">
                        <div class="card--row is--header">
                            编号: {{ item.source.riskLeve }}-{{ item.source.respFor }}
                        </div>
                        <div class="card--row">违规内容: {{ item.source.briefCont }}</div>
                        <div class="card--row">
                            关注程度: {{ item.source.ranking }}级别-{{ item.source.prioritis }}
                        </div>
                        <div class="card--row">是否6+2: {{ item.source.highRank === 2 ? '是' : '否' }}</div>
                    </div>
                </div>
            </template>

            <template v-else>
                <van-action-sheet v-model="showRequirementActionSheet" :close-on-click-overlay="false" title="上传提示">
                    <div class="requirement-popup--container">
                        <van-notice-bar wrapable :scrollable="false" color="#1989fa" background="#ecf9ff"
                            left-icon="info-o">
                            请至少上传一张图片或视频以表明当前检查正常
                        </van-notice-bar>
                        <div class="icon--group is--center is-requirement--popup">
                            <Uploader @upload-success="handleRequirementPhotoUploadSuccess" accept="image/*">
                                <div class="upload--inner">
                                    <van-icon class="icon-item" name="photo" />
                                    <span>拍照</span>
                                </div>
                            </Uploader>
                            <div class=""
                                style="display: flex; align-items: center; justify-content: center; padding: 10px; padding: 20px; font-size: 20px;">
                                <span>或</span>
                            </div>
                            <!-- <div class="icon--group--spliter"></div> -->
                            <Uploader @upload-success="handleRequirementVideoUploadSuccess" accept="video/*">
                                <div class="upload--inner">
                                    <van-icon class="icon-item" @click="handleIconItemClicked('video')" name="video" />
                                    <span>录视频</span>
                                </div>
                            </Uploader>
                        </div>

                        <!-- 上传的文件列表 -->
                        <div class="file--list" style="padding: 10px;">
                            <div class="flex justify-between file--item items-center my-10"
                                v-for="item in requirementFileList" :key="item.ossId">
                                <span class="file--item---title"> {{ item.fileName }}</span>
                                <van-button class="file--item---action" type="danger" icon="clear" size="mini"
                                    @click="handleRequirementFileItemRemove(item)">删除</van-button>
                            </div>
                        </div>

                        <div class="requirement-popup--action">
                            <van-button style="width: 40%" type="info" :loading="isHandlingRequirement"
                                loading-text="正在提交..." :disabled="shouldDisabledRequirementSubmit"
                                @click="handleRequirementSubmit">提交</van-button>
                        </div>
                    </div>
                </van-action-sheet>

                <CardBox class="is--tiny" title="检查项目" :show-toggler="false" type="simple">
                    <div class="field--wrapper" style="position: relative">
                        <van-field v-model="form.type" center readonly clearable required label="违规内容" placeholder="请选择"
                            @click-input="handleTypeInput">
                            <template #button>
                                <van-button :loading="loading.type" @click="handleTypeInput" icon="search" size="small"
                                    type="info">检索</van-button>
                            </template>
                        </van-field>
                    </div>
                </CardBox>

                <CardBox title="违规描述" :show-toggler="false" type="simple">
                    <div class="bg-white deli--container field--border">
                        <!-- 违规内容 -->
                        <van-field v-model="form.remark" center clearable :required="form.required" rows="3" autosize
                            type="textarea" placeholder="请输入描述">
                        </van-field>
                    </div>
                </CardBox>
                <CardBox title="现场记录的附件" :show-toggler="false" type="simple">
                    <div class="icon--group">
                        <Uploader @upload-success="handlePhotoUploadSuccess" accept="image/*">
                            <div class="upload--inner">
                                <van-icon class="icon-item" name="photo" />
                                <span>拍照</span>
                            </div>
                        </Uploader>
                        <Uploader @upload-success="handleVideoUploadSuccess" accept="video/*">
                            <div class="upload--inner">
                                <van-icon class="icon-item" @click="handleIconItemClicked('video')" name="video" />
                                <span>录视频</span>
                            </div>
                        </Uploader>
                        <Uploader @upload-success="handleFileUploadSuccess" accept="*/*">
                            <div class="upload--inner">
                                <van-icon class="icon-item" @click="handleIconItemClicked('file')" name="column" />
                                <span>上传文件</span>
                            </div>
                        </Uploader>
                    </div>

                    <div class="bg-white deli--container">
                        <!-- 上传的文件列表 -->
                        <div class="file--list">
                            <div class="flex justify-between file--item items-center my-10" v-for="item in form.fileList"
                                :key="item.ossId">
                                <span class="file--item---title"> {{ item.fileName }}</span>
                                <van-button class="file--item---action" type="danger" icon="clear" size="mini"
                                    @click="handleFileItemRemove(item)">删除</van-button>
                            </div>
                        </div>
                    </div>
                </CardBox>

                <!-- 分割线 -->
                <van-divider
                    :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px', marginTop: '40px' }">其它选项</van-divider>

                <van-button @click="doAction('showFilterList', 1)" size="small" type="info" plain block
                    class="btn--action">展开全部必查项</van-button>

                <van-button @click="doAction('showFilterList', 0)" size="small" type="info" plain block
                    class="btn--action">展开全部检查项</van-button>

            </template>

            <!-- 底部操作栏 -->
            <div class="flex justify-center fixed--bottom bg--white p-15 z-2 shadow--top">
                <template v-if="showConfirm">
                    <van-button class="fxied--bottom---action" @click="debounceCancel" size="small" type="danger" plain
                        style="width: 120px" icon="clear">取消</van-button>
                    <van-button class="fxied--bottom---action" @click="debounceConfirm" size="small" type="info"
                        icon="checked" style="width: 120px">提交</van-button>
                </template>

                <template v-else>
                    <van-button class="fxied--bottom---action" @click="debounceEndCheck('omg')" size="small" type="danger"
                        plain style="width: 120px" icon="passed">检查结束</van-button>
                    <van-button class="fxied--bottom---action" @click="debounceContinueCheck" size="small" type="info"
                        icon="arrow" style="width: 120px">继续检查</van-button>
                </template>
            </div>

            <!-- 展开检查项列表模式 -->
            <transition name="bounce">
                <ListMode v-if="listMode" :type="listModeType" :list="list" @cancel="listMode = false"></ListMode>
            </transition>

            <!-- 检查项查询面板 -->
            <transition name="bounce">
                <TypeSearchPanel v-if="show.typeSearchPanel" @confirm="handleCheckItemSelect"
                    @close="show.typeSearchPanel = false">
                </TypeSearchPanel>
            </transition>
        </div>
    </div>
</template>

<script>
import { deepClone } from '@/utils/index'
import { checkItemFactory } from './util'

import { delOss } from '@/api/system/oss'
import ListMode from '@/components/ListMode/index.vue'
import CardBox from 'components/CardBox/IndexView'
import Uploader from 'components/Uploader.vue'
import { Cell, Toast, Radio, RadioGroup, Dialog } from 'vant'

import TypeSearchPanel from './TypeSearchPanel/index.vue'

import WeixinClosePageMixin from '@/mixins/WeixinClosePageMixin'

import SubmitMixin from './SubmitMixin'

import CheckListMixin from './CheckListMixin'

import { addRealMonitor } from '@/api/system/realMonitor'
import { addSgsMonitor } from '@/api/system/sgsMonitor'

let ListModeMixin = {
  data () {
    return {
      listMode: false,
      listModeType: -1
    }
  }
}

const RequirementMixin = {
  data () {
    return {
      showRequirementActionSheet: false,
      requirementFileList: [],
      isHandlingRequirement: false
    }
  },

  computed: {
    shouldDisabledRequirementSubmit () {
      return this.requirementFileList.length === 0
    }
  },

  methods: {
    async handleRequirementSubmit () {
      let __checkType__ = this.__checkType__

      if (this.requirementFileList.length === 0) {
        Toast('请至少要上传一张图片或者一个视频')
        return
      }

      let evidPic = this.requirementFileList.filter(item => item.type == 'photo').map(item => item.url).join(',') || ''
      let evidVid = this.requirementFileList.filter(item => item.type == 'video').map(item => item.url).join(',') || ''

      let waybillId = this.deliNo

      let sendStrategies = {
        real: function (list) {
          let tmsRealMoniterDetailsList = []

          let data = {
            // 运单Id
            waybillId,
            // 结果列表
            tmsRealMoniterDetailsList,
            evidPic,
            evidVid
          }

          addRealMonitor(data).then(res => {
            this.showRequirementActionSheet = false
            this.$router.replace({
              name: 'home'
            })
          }).catch(error => {
            debugger
            // eslint-disable-next-line no-mixed-operators
            Toast(error && error.msg || '操作失败')
          })
        },

        sgs: function (list) {
          let tmsSgsMoniterDetails = []

          // TODO:
          // - 是否需要增加检查周期的参数
          let { sgsType } = this.$route.query
       
          let data = {
            // 运单Id
            waybillId,
            // 结果列表
            tmsSgsMoniterDetails,
            evidPic,
            evidVid,
            sgsType
          }

          addSgsMonitor(data).then(res => {
            debugger
            console.log(res)
            this.showRequirementActionSheet = false
            this.$router.replace({
              name: 'home'
            })
          }).catch(error => {
            // eslint-disable-next-line no-mixed-operators
            Toast(error && error.msg || '操作失败')
          })
        }
      }

      let func = sendStrategies && sendStrategies[__checkType__]
      func && func.call(this, this.requirementFileList)
    },

    handleRequirementPhotoUploadSuccess (data) {
      data.file.type = 'photo'
      this.requirementFileList.push(data.file)
    },

    handleRequirementVideoUploadSuccess (data) {
      data.file.type = 'video'
      this.requirementFileList.push(data.file)
    },

    handleRequirementFileItemRemove (item) {
      this.$toast('正在删除...')
      let ossId = item.ossId
      let list = this.requirementFileList
      let $index = list.indexOf(item)
      list.splice($index, 1)
      // OSS删除
      delOss(ossId).then((res) => {
        if (res.code === 200) {
          this.$toast('删除成功')
          return
        }
        this.$toast('删除失败')
      })
    }
  },
  created () {
    // if(process.env.NODE_ENV === 'development') {
    //     this.requirementFileList = [
    //         { "ossId": "1663415902280806401", "url": "http://zsh-pyzl.oss-cn-shenzhen.aliyuncs.com/2023/05/30/25480707b75943fa8b3fd2e7788069b8.png", "fileName": "iShot_2023-05-15_16.52.54.png", "type": "photo" }, { "ossId": "1663415953115770882", "url": "http://zsh-pyzl.oss-cn-shenzhen.aliyuncs.com/2023/05/30/443f43a6cad44be5b32f1ddcf52b6764.mp4", "fileName": "testvideo.mp4", "type": "video" },
    //         { "ossId": "1663415902280806402", "url": "http://zsh-pyzl.oss-cn-shenzhen.aliyuncs.com/2023/05/30/25480707b75943fa8b3fd2e7788069b8.png", "fileName": "iShot_2023-05-15_16.52.54.png", "type": "photo" }
    //     ]
    // }
  }
}

export default {
  name: 'SelectView',

  mixins: [
    SubmitMixin,
    ListModeMixin,
    WeixinClosePageMixin,
    CheckListMixin,

    // @date 2023-05-29
    RequirementMixin
  ],

  components: {
    ListMode,
    CardBox,
    Uploader,
    [Cell.name]: Cell,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    TypeSearchPanel
  },

  data () {
    return {
      // 运单号
      deliNo: '',

      showConfirm: false,
      showFormExtra: true,
      errorMsg: '',
      loading: {},

      form: checkItemFactory(),

      // 已选的检查项
      selectList: [],

      show: {
        notication: false,
        typeFilter: false,

        typeSearchPanel: false
      },

      list: [],
      filterTypeList: [],

      submitList: [],

      // 预览列表
      previewList: []
    }
  },

  methods: {
    handleModelChange (name) {
      debugger
      console.log(this.form.required)
    },

    /**
         * 添加文件
         * @param {File} file 文件对象表示
         */
    addFile (file) {
      this.form.fileList.push(file)
    },

    handlePhotoUploadSuccess (data) {
      this.addFile(data.file)
    },

    handleVideoUploadSuccess (data) {
      this.addFile(data.file)
    },

    handleFileUploadSuccess (data) {
      this.addFile(data.file)
    },

    /**
         * 验证当前表单项是否有效
         */
    isCurrentFormItemValidate () {
      let f = this.form
      let type = f.type.trim()
      if (type === '') {
        Toast('请选择违规内容')
        return false
      }
      if (f.id === null) {
        Toast('请选择违规内容')
        return false
      }
      if (f.required) {
        let remark = f.remark.trim()
        if (remark === '') {
          Toast('请输入违规描述')
          return false
        }
        let fileList = f.fileList
        if (fileList.length === 0) {
          Toast('请上传现场记录的附件')
          return false
        }
      }
      return true
    },

    /**
         * 继续检查
         */
    handleContinueCheck () {
      if (!this.isCurrentFormItemValidate()) {
        return
      }
      // 深复制数据
      this.submitList.push(deepClone(this.form))
      this.form = checkItemFactory()
      return true
    },

    /**
         * 删除文件处理
         */
    handleFileItemRemove (item) {
      this.$toast('正在删除...')
      debugger
      let ossId = item.ossId
      let list = this.form.fileList
      let $index = list.indexOf(item)
      list.splice($index, 1)
      // OSS删除
      delOss(ossId).then((res) => {
        if (res.code === 200) {
          this.$toast('删除成功')
          return
        }
        this.$toast('删除失败')
      })
    },

    handleIconItemClicked (type) {
      console.log('log type:')
      console.log(type)
    },

    handleEndCheck (state) {
      function beforeClose (action, done) {
        if (action === 'confirm') {
          this.handleSubmit([])
            .then((res) => {
              Toast('操作成功')
              done()
              this.$router.replace({
                name: 'home'
              })
            })
            .catch((err) => {
              console.log(err)
              Toast(err.message || '操作失败')
              done()
            })
        } else {
          done()
        }
      }

      let submitList = this.submitList
      let isListEmpty = submitList.length === 0
      let type = this.form.type

      if (isListEmpty && type === '') {
        let __checkType__ = this.__checkType__

        // 以下策略只处理属地检查
        if (__checkType__ !== 'dep') {
          this.showRequirementActionSheet = true
          return
        }

        console.log('策略1')

        Dialog.confirm({
          message: '当前检查一切正常，是否确认?',
          beforeClose: beforeClose.bind(this)
        })
        return
      }
      if (isListEmpty && type !== '' && !this.isCurrentFormItemValidate()) {
        console.log('策略2')
        return
      }
      if (!isListEmpty && type === '') {
        console.log('策略3')
        let ret1 = deepClone(this.submitList)
        this.previewList = ret1
        this.showConfirm = true
        return
      }
      if (!isListEmpty && type !== '' && !this.isCurrentFormItemValidate()) {
        console.log('策略4')
        return
      }
      console.log('策略5')
      let ret1 = deepClone(this.submitList)
      let ret2 = deepClone(this.form)
      ret1.push(ret2)
      this.previewList = ret1
      this.showConfirm = true
    },

    handleCancel () {
      this.showConfirm = false
    },

    /**
     * 确认操作
     */
    handleConfirm () {
      this.isSubmiting = true
      this.handleSubmit(this.previewList)
        .then((res) => {
          this.isSubmiting = false
          Toast('操作成功')
          // 可能跳转到主页
          // this.closePage.call(this)
          this.$router.replace({
            name: 'home'
          })
        })
        .catch((err) => {
          this.isSubmiting = false
          console.log(err)
          Toast(err.message || '操作失败')
        })
    },

    doAction (action, options) {
      let actionStrategies = {
        /**
         * 进行检查
         */
        doCheck: async function () {
          if (this.loading.doCheck) return

          // 表单验证
          let f = this.form
          if (f.location === '') {
            this.errorMsg = '请选择检查地点'
            this.show.notication = true
            return
          }
          if (f.vehiNo === '') {
            this.errorMsg = '请选择车牌号'
            this.show.notication = true
            return
          }

          this.loading.doCheck = true
          // // 重置状态
          // this.form.isChecking = false;

          try {
            // ...
          } catch (error) {
            this.loading.doCheck = false
          }
        },

        /**
         * 显示检查项列表
         */
        showFilterList: function (listModeType) {
          this.listMode = true
          this.listModeType = listModeType
        }
      }
      let func = actionStrategies && actionStrategies[action]
      // 执行策略
      func && func.call(this, options)
    },

    handleCheckItemSelect (item) {
      this.show.typeFilter = false
      this.form.source = item
      this.form.type = item.briefCont
      this.form.id = item.id
      // 6 + 2的检查项要设置必填属性
      this.form.required = item.highRank === 2
    },

    /**
     * 处理车辆输入
     */
    handleTypeInput () {
      this.show.typeSearchPanel = true
    }
  },

  created () {
    let q = this.$route.query
    // 运单号
    this.deliNo = q.deliNo
    // 检查类型
    this.__checkType__ = q.type
    // 节流优化
    this.debounceHandleTypeInput = this.$debounce(this.handleTypeInput, 1000)
    this.debounceEndCheck = this.$debounce(this.handleEndCheck, 250)
    this.debounceCancel = this.$debounce(this.handleCancel, 250)
    this.debounceConfirm = this.$debounce(this.handleConfirm, 250)
    this.debounceContinueCheck = this.$debounce(this.handleContinueCheck, 250)
  }
}
</script>

<style lang="scss" scoped>
$dropdown-bg: #f8f9fb;

.select--view {
    // padding-bottom: 230px;
    padding-bottom: 90px;
}

.check--action {
    padding-top: 15px;
    padding-bottom: 15px;
}

.high--contract {
    // background: #d5d5d5;
    border-bottom: 1px solid #15151540;
}

.icon-item {
    font-size: 50px;
}

.btn--action {
    &~& {
        margin-top: 10px;
    }
}

.shadow--top {
    box-shadow: rgb(196 196 196 / 50%) 3px -5px 10px 0px;
}

.is--tiny {
    .field--wrapper {
        margin-top: -20px;
    }
}

// 侧滑动画
.bounce-enter-active {
    animation: bounce-in 0.2s;
}

.bounce-leave-active {
    animation: bounce-in 0.2s reverse;
}

@keyframes bounce-in {
    0% {
        transform: translateX(100%);
    }

    50% {
        transform: translateX(30%);
    }

    100% {
        transform: translateX(0%);
    }
}

.file--item {
    font-size: 16px;

    &---title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
    }

    &---action {
        width: 100px;
    }
}

// 检查项汇总

// +++++++++++++ 表格相关样式 START ++++++++++
.clear--float {
    clear: both;
    float: left;
    width: 100%;
}

.table-column {
    &--item {
        width: 25%;
        float: left;
        font-size: 10px;
        text-align: center;
        padding: 5px 0;
        background: #f8f9fb;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    border-bottom: 1px solid #d5d5d5;

    &.is--head {
        border-bottom-width: 2px;
    }

    &:last-child {
        border-bottom: none;
    }
}

.table-row {
    position: relative;

    &::after {
        position: absolute;
        content: "";
        height: 1px;
        background: #d5d5d5;
        width: 100%;
        top: 100%;
    }

    &.is-head::after {
        width: calc(100% - 60px);
        left: 60px;
        height: 2px;
    }

    span {
        // background: #fff;
        height: 35px;
        flex: 1;

        &.header-cell {
            font-weight: 500;
        }

        &.checkbox-cell {
            flex: 0 0 60px;
        }

        display: flex;
        justify-content: center;
        align-items: center;

        color: #151515;
        font-weight: 350;

        &.is--important {
            color: #be0004;
        }

        &.hidden {
            visibility: hidden;
        }

        @at-root .w100 & {
            flex: 0 0 100px;
        }
    }
}

.icon--group {
    display: flex;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: 10px;

    &.is-requirement--popup {
        padding-top: 10px;
        padding-bottom: 10px;
    }

    &.is--center {
        justify-content: center;
    }

    &--spliter {
        position: relative;
        height: 100%;

        &::after {
            position: absolute;
            content: '或';
            top: 50%;
            transform: translateY(-50%);
            padding: 20px;
            margin-left: 20px;
            margin-right: 20px;
        }
    }
}

.upload--inner {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.fxied--bottom---action {
    &~& {
        margin-left: 30px;
    }
}

.card--list {
    margin-top: 60px;
}

.card--box {
    background: #f7f7f7;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;

}

.card--row {
    font-size: 16px;

    &.is--header {
        font-size: 20px;
        font-weight: 500;
        margin-bottom: 5px;
    }
}

.fixed--title {
    position: fixed;
    left: 0;
    right: 0;
    background: #fff !important;
    padding: 0 15px;
    top: 0;
}

// RequireMent Popup
// @date 2023-05-30 13:49
.requirement-popup {
    &--container {
        position: relative;
        height: 50vh;
    }

    &--action {
        position: fixed;
        bottom: 0px;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        padding-bottom: calc(10px + constant(safe-area-inset-bottom));
        /* 兼容 iOS < 11.2 */
        padding-bottom: calc(10px + env(safe-area-inset-bottom));
        /* 兼容 iOS >= 11.2 */
    }
}
</style>
