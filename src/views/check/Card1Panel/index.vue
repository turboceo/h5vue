<template>
    <van-skeleton title avatar :row="3" :loading="isLoadingSgsRuleList">
        <tempalte v-if="isLoadingSgsRuleListError">
            <van-empty description="网络异常">
                <van-button round type="danger" class="bottom-button" @click="getSgsRuleList">重试</van-button>
            </van-empty>
        </tempalte>
        <template v-else>
            <section class="check-card">
                <van-field label-width="8em" disabled :value="user.user.nickName" label="检查人" placeholder="" />

                <van-field :required="false" v-show="sgsType === 1" label-width="8em" :value="'test'" label="动态静态检查">
                    <template #input>
                        <van-radio-group v-model="sgsForm.dsMonitoring" direction="horizontal">
                            <van-radio :name="1">动态</van-radio>
                            <van-radio :name="2">静态</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>

                <van-field v-show="sgsType === 2" label-width="8em" label="分析影像时长(h)">
                    <template #input>
                        <van-stepper v-model="sgsForm.analysisTime" min="0" step="0.5" :decimal-length="1" />
                    </template>
                </van-field>

                <van-field v-show="sgsType === 2" label-width="8em" label="SD卡状态">
                    <template #input>
                        <van-radio-group v-model="sgsForm.sdState">
                            <van-radio class="van-field--radio" :name="1">卡内数据异常</van-radio>
                            <van-radio class="van-field--radio" :name="2">有效</van-radio>
                            <van-radio class="van-field--radio" :name="3">无法读取</van-radio>
                            <van-radio class="van-field--radio" :name="4">卡内无数据</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>

                <template v-if="sgsType !== 3">
                    <!-- 1. 防御性驾驶 -->
                    <header class="check-card--header">
                        <span class="check-card--header---indicator"></span>防御性驾驶
                    </header>
                    <van-field label-width="8em" :required="false" readonly clickable name="picker"
                        :value="defensiveDrivingRuleDesc" label="防御性驾驶细则" placeholder="请选择"
                        @click="t('sgsRuleList', true)" />
                    <van-field v-show="!sgsForm.defensiveDrivingRules" :required="false" label-width="8em" clearable
                        v-model="other" label="其它细则" placeholder="请输入" />

                    <van-field :required="false" label-width="8em" label="防御性驾驶附件" placeholder="请输入">
                        <template #input>
                            <PdfUploader name="defensiveDriving" @upload-success="handleFileUploadSuccess"
                                style="margin-top: -8px;">
                            </PdfUploader>
                        </template>
                    </van-field>
                </template>

                <!-- 附件列表 -->
                <div class="file--list" style="padding: 10px 16px;">
                    <div class="flex justify-between file--item items-center my-10"
                        v-for="(item, $index) in sgsForm.defensiveDrivingRulesFile" :key="item.ossId">
                        <span style="flex: 1"> {{ item.fileName }}</span>
                        <van-button type="danger" icon="clear" size="mini"
                            @click="handleFileItemRemove(item, $index, 'defensiveDriving')">删除</van-button>
                    </div>
                </div>

                <!-- 巡检的情况下要显示 -->
                <div v-show="sgsType === 1">
                    <!-- 2. 酒精测试 -->
                    <header class="check-card--header">
                        <span class="check-card--header---indicator"></span>酒精测试
                    </header>
                    <van-field :required="false" label-width="8em" clearable v-model="sgsForm.alcoholResult" label="酒精测试结果"
                        placeholder="请输入" />
                    <van-field :required="false" label="酒精测试附件" placeholder="请输入">
                        <template #input>
                            <PdfUploader name="alcohol" @upload-success="handleFileUploadSuccess" style="margin-top: -8px;">
                            </PdfUploader>
                        </template>
                    </van-field>
                    <!-- 附件列表 -->
                    <div class="file--list" style="padding: 10px 16px;">
                        <div class="flex justify-between file--item items-center my-10"
                            v-for="(item, $index) in sgsForm.alcoholFile" :key="item.ossId">
                            <span style="flex: 1"> {{ item.fileName }}</span>
                            <van-button type="danger" icon="clear" size="mini"
                                @click="handleFileItemRemove(item, $index, 'alcohol')">删除</van-button>
                        </div>
                    </div>

                    <!-- 3. GPS IE分析 -->
                    <header class="check-card--header">
                        <span class="check-card--header---indicator"></span>GPS IE分析
                    </header>
                    <van-field :required="false" label-width="10em" clearable v-model="sgsForm.alcoholResult"
                        label="是否按照规定线路形式" placeholder="">
                        <template #input>
                            <van-radio-group v-model="sgsForm.onLine" direction="horizontal">
                                <van-radio :name="1">是</van-radio>
                                <van-radio :name="2">否</van-radio>
                            </van-radio-group>
                        </template>
                    </van-field>

                    <van-field :required="false" v-show="sgsForm.onLine === 2" label-width="8em" clearable
                        v-model="sgsForm.relyLine" label="实际路线" placeholder="请输入" />

                    <van-field :required="false" label="GPS附件" placeholder="">
                        <template #input>
                            <PdfUploader name="gps" @upload-success="handleFileUploadSuccess" style="margin-top: -8px;">
                            </PdfUploader>
                        </template>
                    </van-field>

                    <!-- 附件列表 -->
                    <div class="file--list" style="padding: 10px 16px;">
                        <div class="flex justify-between file--item items-center my-10"
                            v-for="(item, $index) in sgsForm.gpsFile" :key="item.ossId">
                            <span style="flex: 1"> {{ item.fileName }}</span>
                            <van-button type="danger" icon="clear" size="mini"
                                @click="handleFileItemRemove(item, $index, 'gps')">删除</van-button>
                        </div>
                    </div>

                    <!-- 4. 毒品测试 -->
                    <header class="check-card--header">
                        <span class="check-card--header---indicator"></span>毒品测试
                    </header>
                    <van-field :required="false" label-width="8em" clearable v-model="sgsForm.narcoticsResult"
                        label="毒品测试结果" placeholder="请输入" />
                    <van-field :required="false" label="毒品测试附件" placeholder="请输入">
                        <template #input>
                            <PdfUploader name="narcotics" @upload-success="handleFileUploadSuccess"
                                style="margin-top: -8px;">
                            </PdfUploader>
                        </template>
                    </van-field>
                    <!-- 附件列表 -->
                    <div class="file--list" style="padding: 10px 16px;">
                        <div class="flex justify-between file--item items-center my-10"
                            v-for="(item, $index) in sgsForm.narcoticsFiles" :key="item.ossId">
                            <span style="flex: 1"> {{ item.fileName }}</span>
                            <van-button type="danger" icon="clear" size="mini"
                                @click="handleFileItemRemove(item, $index, 'narcotics')">删除</van-button>
                        </div>
                    </div>

                    <!-- 5. 车速限定 -->
                    <header class="check-card--header">
                        <span class="check-card--header---indicator"></span>车速限定
                    </header>
                    <van-field :required="false" label-width="10em" clearable v-model="sgsForm.alcoholResult" label="是否超速"
                        placeholder="">
                        <template #input>
                            <van-radio-group v-model="sgsForm.speedingOver" direction="horizontal">
                                <van-radio :name="1">是</van-radio>
                                <van-radio :name="2">否</van-radio>
                            </van-radio-group>
                        </template>
                    </van-field>

                    <van-field :required="false" v-show="sgsForm.speedingOver === 1" label-width="8em" clearable
                        v-model="sgsForm.speedingProportion" label="超速比率" placeholder="请输入" />

                    <van-field requried label="车速测定附件" placeholder="">
                        <template #input>
                            <PdfUploader name="speed" @upload-success="handleFileUploadSuccess" style="margin-top: -8px;">
                            </PdfUploader>
                        </template>
                    </van-field>

                    <!-- 附件列表 -->
                    <div class="file--list" style="padding: 10px 16px;">
                        <div class="flex justify-between file--item items-center my-10"
                            v-for="(item, $index) in sgsForm.speedingFiles" :key="item.ossId">
                            <span style="flex: 1"> {{ item.fileName }}</span>
                            <van-button type="danger" icon="clear" size="mini"
                                @click="handleFileItemRemove(item, $index, 'speed')">删除</van-button>
                        </div>
                    </div>
                </div>

                <template v-if="sgsType === 3">
                    <van-field :required="false" label-width="4em" clearable v-model="sgsForm.alcoholResult" label="检查周期"
                        placeholder="">
                        <template #input>
                            <van-radio-group v-model="sgsForm.ruleTimeType" direction="horizontal">
                                <van-radio class="van-field--radio" :name="1">日检</van-radio>
                                <van-radio class="van-field--radio" :name="2">周检</van-radio>
                                <van-radio class="van-field--radio" :name="3">月检</van-radio>
                            </van-radio-group>
                        </template>
                    </van-field>
                </template>

                <!-- +++++++++++++ 弹窗相关的内容区域 +++++++++++++++++ -->

                <!-- SGS规则弹窗 -->
                <van-popup v-model="showPicker.sgsRuleList" position="bottom">
                    <van-picker value-key="sgsRule" show-toolbar :columns="sgsRuleList" @confirm="onConfirm"
                        @cancel="t('sgsRuleList', false)" />
                </van-popup>
            </section>
        </template>
    </van-skeleton>
</template>

<script>
import { mapState } from 'vuex'
import { delOss } from '@/api/system/oss'

import PdfUploader from './uploader.vue'
import { Radio, RadioGroup, Picker, Stepper, Skeleton, Empty } from 'vant'

import { listSgsRule } from '@/api/system/sgsRule'

export default {
  // 巡检面板
  name: 'Card1Panel',

  components: {
    PdfUploader,
    [Picker.name]: Picker,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [Stepper.name]: Stepper,
    [Skeleton.name]: Skeleton,
    [Empty.name]: Empty
  },

  props: {
    // sgs巡检类别，1 视频 2巡检
    sgsType: {
      type: Number,
      default: 1
    },

    sgsForm: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  computed: {
    ...mapState('user', ['user']),
    shouldShow () {
      // TODO:
      // 根据检查类型来判断
      return this.sgsType === 1
    }
  },

  data () {
    return {
      isLoadingSgsRuleList: false,
      isLoadingSgsRuleListError: false,

      // 防御性Item对应的说明
      defensiveDrivingRuleDesc: '',

      other: '',

      // SGS规则列表
      sgsRuleList: [],

      showPicker: {
        sgsRuleList: false
      },

      uploader: [{ url: 'https://img01.yzcdn.cn/vant/leaf.jpg' }]
    }
  },

  methods: {
    /**
         * 封装Picker显示&隐藏的方法
         */
    t (prop, isShow) {
      this.showPicker[prop] = isShow
    },

    /**
         * 删除文件处理
         */
    handleFileItemRemove (item, $index, strategy) {
      this.$toast('正在删除...')
      let ossId = item.ossId
      if (strategy === 'defensiveDriving') {
        this.sgsForm.defensiveDrivingRulesFile.splice($index, 1)
      }
      if (strategy === 'alcohol') {
        this.sgsForm.alcoholFile.splice($index, 1)
      }
      if (strategy === 'gps') {
        this.sgsForm.gpsFile.splice($index, 1)
      }
      if (strategy === 'narcotics') {
        this.sgsForm.narcoticsFiles.splice($index, 1)
      }

      if (strategy === 'speed') {
        this.sgsForm.speedingFiles.splice($index, 1)
      }

      // item.fileList.splice($index, 1);
      delOss(ossId).then((res) => {
        if (res.code === 200) {
          this.$toast('删除成功')
          return
        }
        this.$toast('删除失败')
      })
    },

    /**
         * 处理文件上传成功
         * @param {Object} payload 事件回调payload
         */
    handleFileUploadSuccess (payload) {
      let { strategy, file } = payload
      if (strategy === 'defensiveDriving') {
        this.sgsForm.defensiveDrivingRulesFile.push(file)
        return
      }

      if (strategy === 'alcohol') {
        this.sgsForm.alcoholFile.push(file)
        return
      }

      if (strategy === 'gps') {
        this.sgsForm.gpsFile.push(file)
        return
      }

      if (strategy === 'narcotics') {
        this.sgsForm.narcoticsFiles.push(file)
        return
      }

      if (strategy === 'speed') {
        this.sgsForm.speedingFiles.push(file)
      }
    },

    onConfirm (item) {
      this.defensiveDrivingRuleDesc = item.sgsRule
      this.sgsForm.defensiveDrivingRules = item.id
      this.t('sgsRuleList', false)
    },

    /**
     * 加载Sgs规则列表
     */
    getSgsRuleList () {
      this.isLoadingSgsRuleList = true
      listSgsRule().then(res => {
        this.sgsRuleList = res.rows
        this.isLoadingSgsRuleList = false
        this.isLoadingSgsRuleListError = false
      }).catch(err => {
        this.isLoadingSgsRuleList = false
        this.isLoadingSgsRuleListError = true
        console.log('log sgsRuleList error:')
        console.log(err)
      })
    }
  },

  created () {
    this.getSgsRuleList()
  }
}
</script>

<style lang="scss" scoped>
.van-field--radio {
    margin-bottom: 10px;
    width: 100%;
}

.check-card {
    margin-top: 20px;
    // margin-bottom: 20px;
    margin-bottom: 50px;

    &--header {
        font-size: 16px;
        padding: 10px 15px;

        &---indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #f60;
            margin-right: 10px;
            display: inline-block;
        }
    }
}
</style>
