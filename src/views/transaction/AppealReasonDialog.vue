<template>
  <van-action-sheet v-bind="$attrs" v-on="$listeners">
    <van-field rows="3" autosize type="textarea" v-model="appealReason.textarea" center clearable label="申诉理由:"
      placeholder="请输入内容">
    </van-field>
    <p class="is--error">{{ appealReason.errorMsg }}</p>
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

import { doAction } from '@/api/system/notification';

export default {
  name: 'AppealReasonDialog',

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
      appealReason: {
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
          let content = this.appealReason.textarea.trim();
          // 校验
          if (content === '') {
            this.appealReason.errorMsg = '* 内容不能为空';
            return;
          }
          this.appealReason.errorMsg = '';

          let data = {
            appealReason: this.appealReason.textarea,
            id: this.drawerContext.noticeId,
          };

          doAction('4', data)
            .then((res) => {
              this.$notify({
                title: '提示',
                message: '申诉操作成功',
                position: 'bottom-right',
                type: 'success',
              });
              this.closeDialog();
              this.$emit('appeal-succsss');
            })
            .catch((err) => {
              this.$notify({
                title: '提示',
                message: err.message || '申诉操作失败',
                position: 'bottom-right',
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
.btn-action {
  width: 35%;

  &--bar {
    padding: 10px;
  }

  &.is--cancel {
    // color: #7f7f7f;
  }
}

.is--error {
  color: red;
}
</style>
