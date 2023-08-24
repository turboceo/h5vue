<template>
    <van-action-sheet v-bind="$attrs" v-on="$listeners" @click-overlay="handleClickOverlay">
        <!-- <CardBox title="请选择整改类型" :show-toggler="false" type="simple">
        </CardBox> -->
        <div class="bg--white p-15">
            <p class="is--error" v-show="showRectificationRequirementError">* 请输入整改要求</p>
            <van-radio-group v-model="radio">
                <van-radio name="立即整改">
                    <p>立即整改</p>
                </van-radio>
                <van-radio name="7日内整改">
                    <p>7日内整改</p>
                </van-radio>
                <van-radio name="15天内整改">
                    <p>15天内整改</p>
                </van-radio>
                <van-radio name="其他">
                    <p>其他</p>
                </van-radio>
                <van-field style="background-color: #f7f7f7;" v-show="isOtherRectificationRequirementType" v-model="content"
                    center clearable placeholder="请输入整改要求" />
            </van-radio-group>
        </div>
        <div class="flex justify-center btn-action--bar">
            <van-button plain type="primary" class="btn-action is--save" @click="debounceActionHandler('save')">
                保存
            </van-button>
        </div>
    </van-action-sheet>
</template>
  
<script>
import debounce from 'lodash/debounce';
import RectificationRequirementMixin from './RectificationRequirementMixin'
import { Toast } from 'vant'

import { closePage } from 'utils/weixin'

import { doAction } from '@/api/system/notification';

export default {
    name: 'RectificationRequirementActionSheet',

    inject: ['drawerContext'],

    components: {
    },

    mixins: [
        RectificationRequirementMixin
    ],

    data() {
        return {
            appealReason: {
                textarea: '',
                errorMsg: '',
            },
        };
    },

    methods: {
        handleClickOverlay() {
            Toast({
                message: '请选择请整改要求',
                position: 'bottom',
            });
        },

        closeDialog() {
            this.$emit('input', false);
        },

        actionHandler(action, options = {}) {
            let actionStrategies = {
                cancel() {
                    debugger
                    this.closeDialog();
                },

                /**
                 * 保存操作
                 */
                save() {
                    if (!this.isRectificationRequirementValidate()) return
                    let ctx = this.drawerContext
                    let state = ctx.form.preNode
                    let noticeId = ctx.form.id
                    let data = {
                        "rtfOver": 2,
                        "rtfPeriod": this.radio,
                        "id": noticeId
                    }

                    debugger
                    doAction(state.toString(), data)
                        .then((res) => {
                            debugger
                            Toast({
                                message: '操作成功',
                                position: 'bottom',
                            });
                            ctx.$emit('refresh')
                            let t = setTimeout(() => {
                                t && clearTimeout(t)
                                closePage.call(this)
                            }, 1500)
                        })
                        .catch((err) => {
                            debugger;
                            Toast(err.message)
                            Toast({
                                message: err.message || '操作失败',
                                position: 'bottom',
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
  