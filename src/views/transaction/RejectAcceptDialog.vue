<template>
  <van-action-sheet v-bind="$attrs" v-on="$listeners">
    <van-field rows="3" autosize type="textarea" label-width="8em" v-model="rejectAccpet.textarea" center clearable
      label="不予验收理由:" placeholder="请输入内容">
    </van-field>
    <p class="is--error">{{ rejectAccpet.errorMsg }}</p>
    <div class="flex justify-between btn-action--bar">
      <van-button plain type="default" class="btn-action is--cancel" @click="debounceActionHandler('cancel')">
        取消
      </van-button>
      <van-button plain type="primary" class="btn-action is--save" @click="debounceActionHandler('save')">
        保存
      </van-button>
    </div>
  </van-action-sheet>
</template>

<script>
import debounce from 'lodash/debounce';
import { Toast } from 'vant'

import { doAction } from '@/api/system/notification';

import { closePage } from 'utils/weixin'

export default {
  name: 'RejectAccpetDialog',

  inject: ['drawerContext'],

  props: {
    show: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      rejectAccpet: {
        textarea: '',
        errorMsg: '',
      },
    };
  },

  methods: {
    closeDialog() {
      this.$emit('input', false);
    },

    actionHandler(action, options = {}) {
      let actionStrategies = {
        cancel() {
          this.closeDialog();
        },

        save() {
          let content = this.rejectAccpet.textarea.trim();
          // 校验
          if (content === '') {
            this.rejectAccpet.errorMsg = '* 内容不能为空';
            return;
          }
          this.rejectAccpet.errorMsg = '';

          let data = {
            // 2代表不予验收
            rtfOver: 2,
            id: this.drawerContext.noticeId,
            rejectAcceptReason: content,
          };

          doAction(7, data)
            .then((res) => {
              debugger;
              Toast({
                message: '操作成功',
                position: 'bottom',
                type: 'success',
              });
              closePage.call(this);
              // this.$emit('rejectAccpetConfirm');
            })
            .catch((err) => {
              this.$notify({
                title: '提示',
                message: err.message || '操作失败',
                position: 'bottom',
                type: 'warning',
              });
            });
        },
      };

      // 动作策略
      let actionStrategy = actionStrategies && actionStrategies[action];
      actionStrategy && actionStrategy.call(this, options);
    },
  },

  created() {
    this.debounceActionHandler = debounce(this.actionHandler, 250);
  },
};
</script>

<style lang="scss" scoped>
.dialog {
  position: absolute;
  background: #f8fafc;
  box-shadow: rgb(196 196 196 / 50%) 0px 0px 10px 0px;
  width: 400px;
  z-index: 2;
  top: 50%;
  left: 50%;
  margin: auto;
  transform: translate3d(-50%, 100vh, 0);
  padding: 10px;
  transition: transform 0.2s ease-in-out;

  &.is--show {
    transform: translate3d(-50%, -50%, 0);
  }
}

.btn-action {
  width: 35%;

  &--bar {
    padding: 10px;
  }

  &.is--cancel {
    // color: #7f7f7f;
  }
}
</style>
