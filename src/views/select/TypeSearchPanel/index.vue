<template>
    <div class="panel car--search">
        <div class="panel-header flex items-center">
            <van-search class="panel-header--search" v-model="q" label="" placeholder="请输入违规项关键词"
                @input="debounceUserInput">
            </van-search>
        </div>
        <div class="panel-content">
            <list :list="filterCheckList" @item-click="debounceHandleVehiNoRowCheck" />
        </div>
        <div class="panel-footer">
            <van-button type="danger" block size="small" plain class="panel-footer--action"
                @click="debounceHandleCancel">返回</van-button>
            <van-button type="primary" block size="small" class="panel-footer--action" :disabled="isDisabledCofirm"
                @click="debounceHandleConfirm">确认</van-button>
        </div>
    </div>
</template>

<script>
// ===> Components
import list from "./List.vue";
import { Search, Toast } from 'vant'

import { mapState, mapActions } from "vuex";

import { deepClone } from '@/utils/index.js'

export default {
    name: 'TypeSearchPanel',

    components: {
        list,
        [Search.name]: Search,
        [Toast.name]: Toast,
    },

    data() {
        return {
            q: '',
            filterCheckList: [],
        }
    },

    computed: {
        ...mapState('checklist', ['checkList']),

        /**
         * 当前被勾选的项目
         */
        currentItem() {
            return this.filterCheckList.find(item => item.checked)
        },

        isDisabledCofirm() {
            if (!this.currentItem) return true
            return false
        }
    },

    methods: {
        /**
         * 选择车牌号
         * @param {Boolean} checked
         */
        handleVehiNoRowCheck(data) {
            let { item, list } = data
            if (list.length > 1) {
                list
                    .filter(__item__ => __item__.id !== item.id)
                    .forEach(item => {
                        item.checked = false
                    })
            }
            item.checked = !item.checked
        },

        /**
         * 处理车辆输入
         */
        handleUserInput() {
            this.filterCheckList = []
            let q = this.q
            let ret = this.checkList.filter(item => {
                return item.briefCont.indexOf(q) > -1
            })
            this.filterCheckList = deepClone(ret.map(item => {
                item.checked = false
                return item
            }))
        },

        handleCancel() {
            this.$emit('close')
        },

        handleConfirm() {
            this.$emit('confirm', this.currentItem);
            this.handleCancel()
        }
    },

    created() {
        // +++++++++++ 节流优化 +++++++++++
        this.debounceUserInput = this.$debounce(this.handleUserInput, 250);
        this.debounceHandleConfirm = this.$debounce(this.handleConfirm, 250);
        this.debounceHandleCancel = this.$debounce(this.handleCancel, 250);
        this.debounceHandleVehiNoRowCheck = this.$debounce(this.handleVehiNoRowCheck, 250)

        this.handleUserInput()
    }
}
</script>

<style lang="scss" scoped>
.panel {
    position: fixed;
    background: #fff;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    margin-bottom: 0 !important;

    display: flex;
    flex-direction: column;
    height: 100vh;

    &-header {
        &--search {
            flex: 1;
        }
    }

    &-content {
        flex: 1;
        padding: 0 15px 15px;
        overflow-y: auto;
    }

    &-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;

        &--action {
            &~& {
                margin-left: 50px;
            }
        }
    }
}
</style>