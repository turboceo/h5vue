<template>
    <div class="panel car--search">
        <div class="panel-header flex items-center">
            <van-search class="panel-header--search" v-model="form.vehiNo" label="车牌号" placeholder="请输入搜索关键词"
                @input="debounceHandleCarNoInput">
            </van-search>
        </div>
        <div class="panel-content">
            <CarInfoList :list="vehiList" @item-click="debounceHandleVehiNoRowCheck">
            </CarInfoList>
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
import CarInfoList from "./CarInfoList.vue";
import { Search, Toast } from 'vant'
import { listTruck } from "@/api/system/truck";

export default {
    name: 'CarSearchPanel',

    components: {
        CarInfoList,
        [Search.name]: Search,
        [Toast.name]: Toast,
    },

    data() {
        return {
            form: {
                vehiNo: ''
            },
            vehiList: [],
        }
    },

    computed: {
        /**
         * 当前被勾选的项目
         */
        currentItem() {
            return this.vehiList.find(item => item.checked)
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
                list.forEach(item => {
                    item.checked = false
                })
            }
            item.checked = !item.checked
        },

        /**
         * 处理车辆输入
         */
        handleCarNoInput() {
            Toast.loading({
                message: "查询中...",
                forbidClick: true,
            });
            let { vehiNo } = this.form;
            listTruck({
                vehiNo,
                vehiType: "2", // 车头号
            }).then((res) => {
                this.$toast.clear();
                let len = res.rows.length;
                if (len === 0) {
                    this.$toast("暂无数据");
                    return;
                }
                let rowItemAdapter = item => {
                    item.checked = false;
                    return item;
                }
                this.vehiList = res.rows.map(rowItemAdapter);
            });
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
        this.debounceHandleCarNoInput = this.$debounce(this.handleCarNoInput, 250);
        this.debounceHandleConfirm = this.$debounce(this.handleConfirm, 250);
        this.debounceHandleCancel = this.$debounce(this.handleCancel, 250);
        this.debounceHandleVehiNoRowCheck = this.$debounce(this.handleVehiNoRowCheck, 250)
    }
}
</script>

<style lang="scss" scoped>
.panel {
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