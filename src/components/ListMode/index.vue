<template>
  <div class="check--view list-mode" :class="{ 'is--ready': this.ready }" style="display: flex; flex-direction: column;">
    <div class="list--inner p-15" style="flex: 1; overflow-y: auto; min-height: 1px;">
      <CheckItem v-for="form in list" :key="form.id" :form="form"></CheckItem>
    </div>
    <!-- 底部栏 -->
    <div class="flex justify-between bg--white p-15 z-2 shadow--top">
      <van-button @click="debounceCancel" size="small" type="danger" plain style="width: 120px"
        icon="clear">返回</van-button>
      <van-button @click="debounceConfirm" size="small" type="info" icon="checked" style="width: 120px">提交</van-button>
    </div>
  </div>
</template>

<script>
import { formatDate, deepClone } from "@/utils/index";
import { addRealMonitor } from "@/api/system/realMonitor";

let SubmitMixin = {
  methods: {
    handleSubmit() {
      let inspdstartTime = formatDate(Date.now());
      let tmsRealMoniterItemAdapter = (item) => {
        return {
          // 本次检查结果
          concls: item.model,
          // 发现违规时间
          inspdstartTime,
          // 百规id
          tranroleId: item.id,
          // 记录内容描述
          inspdMemo: item.remark || "",
          // 现场图片
          evidPic: item.fileList.map((file) => file.url).join(",") || "",
          // 所在地点
          locaPlace: "",
        };
      };

      let data = {
        // 运单Id
        waybillId: this.deliNo,
        // 结果列表
        tmsRealMoniterDetailsList: this.list.map(tmsRealMoniterItemAdapter),
      };

      this.isSubmiting = true;

      addRealMonitor(data)
        .then((res) => {
          this.isSubmiting = false;
          console.log(res);
          this.$toast.success("操作成功");

          // TODO:
          // 跳转到主页
        })
        .catch((err) => {
          this.isSubmiting = false;
          console.log(err);
          this.show.notication = true;
          this.show.errorMsg = "操作失败";
        });
    },
  },
};

import { mapState } from "vuex";

import CheckItem from './CheckItem/index.vue'


import { Toast } from 'vant'

export default {
  name: "ListMode",

  props: {
    // 检查项类型，1为必查，0为所有
    type: {
      type: Number,
      default: -1
    }
  },

  mixins: [SubmitMixin],

  computed: {
    ...mapState('checklist', ['checkList']),
  },

  components: {
    CheckItem
  },

  data() {
    return {
      ready: false,
      list: []
    };
  },

  methods: {
    handleCancel() {
      this.$emit("cancel");
    },

    handleConfirm() {
      // 验证表单
      console.log('Start Validate:::')
      let list = this.list

      let errMsg = ''

      let isValidateSuccss = list.every(item => {
        let isHighRank = item.highRank === 2
        if (isHighRank && item.remark === '') {
          debugger
          errMsg = `请输入【${item.briefCont}】违规描述`
          return false
        }
        if (isHighRank && item.fileList.length === 0) {
          errMsg = `请上传【${item.briefCont}】相关附件`
          return false
        }
        return true
      })
      if (!isValidateSuccss) {
        Toast(errMsg || '验证失败')
        return
      }
      console.log('Validate Success:::')
      this.handleSubmit();
    },

    doAction(action, options) {
      let actionStrategies = {
        // ...
        // TODO:
        // - 添加策略
      };
      let func = actionStrategies && actionStrategies[action];
      // 执行策略
      func && func.call(this, options);
    },
  },

  created() {
    this.deliNo = this.$route.query.deliNo;
    console.log(`DeliNo: ${this.deliNo}`)
    this.debounceCancel = this.$debounce(this.handleCancel, 250);
    this.debounceConfirm = this.$debounce(this.handleConfirm, 250);
    this.$nextTick(() => {
      this.ready = true;
    });

    let clonedlist = deepClone(this.checkList)
    if (this.type === 1) {
      clonedlist = clonedlist.filter(item => item.highRank === 2)
    }
    this.list = clonedlist.map(item => {

      item.model = 0
      // - 移除开发环境下的注入逻辑
      // item.remark = item.highRank === 2 ? 'ajjdajjc' : ''
      // item.fileList = [
      //   {
      //     fileName: 'test.pdf',
      //     ossId: 1,
      //     url: 'https://www.baidu.com'
      //   }
      // ]
      return item
    })
  },
};
</script>

<style lang="scss" scoped>
// +++++++++++++ 表格相关样式 END ++++++++++

.check--view {
  position: fixed;
  background: #fff;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  margin-bottom: 0 !important;
}

.check--action {
  padding-top: 15px;
  padding-bottom: 15px;
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
</style>
