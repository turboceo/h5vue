<template>
    <div class="container ">
        <div class="card--list list-wrap p-15">
            <vo-pages :data="list" @pullingUp="pullingUp" @pullingDown="pullingDown" :loadedAll="loadedAll">
                <div class="card--item" v-for="item in list" :key="item.id"
                    @click="debounceActionHandler('viewFlow', item)">
                    <header class="card--item---header">
                        <span class="card--item---truckNo">
                            <svg-icon class="icon" icon-class="car" />
                            {{ item.truckNo }}
                        </span>
                        <van-button size="small" type="info" :disabled="item.disabled">
                            <van-icon name="eye-o" /> 立即处理
                        </van-button>
                    </header>
                    <p>
                        状态： {{ getProgressStateDesc(item.state) }}
                    </p>

                    <p>
                        违规项目: {{ item.content }}
                    </p>
                    <p>
                        要求完成时间: {{ item.preFinishTime }}
                    </p>
                    <!-- TODO: v-hasPermi="['system:realMonitor:edit'] -->
                    <p>
                        流程状态: <span class="flow--step" :class="getFlowStepClass(flow)"
                            v-for="(flow, $flowIndex) in item.flowList" :key="$flowIndex">{{
                                flow.name }}</span>
                    </p>
                </div>
            </vo-pages>
        </div>
    </div>
</template>

<script>
import debounce from 'lodash/debounce'

import { Toast } from 'vant'

import {
    listNotification
} from '@/api/system/notification'

// Mixin
import StateMixin from './StateMixin'
import Upload from './Upload'
import VoPageMixin from '@/mixins/VoPageMixin'

import { checkPermi } from '@/utils/checkRoleOrPermision'

// 承运商  1 确认         3 回执签发通知书   4 申述      6 整改
// 执行岗  2 签发通知书    5 处理申述       7 验收      8 结束
const PROGRESS_STATE_NAME_MAP = {
    0: '监查记录',
    1: '确认',
    2: '签发通知书',
    3: '回执签发通知书',
    4: '申诉',
    5: '处理申述',
    6: '整改',
    7: '验收',
    8: '确认结束'
}

// @adapter
let itemAdapter = (item) => {
    let t = item.tmsWaybillVo
    console.log(`当前流程#{${item.id}}状态: ${item.preNode}`)
    let ret = {
        id: item.id,
        // 状态
        state: item.preNode,
        truckNo: t.truckNo,
        // 违规项目
        content: item.tranRoleId,
        splName: t.splName,
        // 倒序，以流程最后时间为依据
        flowList: item.nodeVoList.reverse().map((node) => {
            let p = node.progressState
            return {
                id: p,
                name: PROGRESS_STATE_NAME_MAP[p]
            }
        }),
        // 当前操作流程状态
        preNode: item.preNode,
        preFinishTime: item.preFinishTime
    }
    return ret
}

export default {
    name: 'NotificationView',

    mixins: [StateMixin, Upload, VoPageMixin],

    data() {
        return {
            errorMsg: '',
            list: [],
            total: 0,
            page: 1,
            loadedAll: false,
            queryParams: {}
        }
    },

    methods: {
        /**
         * 
        * 查看流程
        */
        viewFlow(flow) {
            let __currentFlowState__ = flow.preNode

            // 拦截验收阶段
            if (__currentFlowState__ === 8) {
                Toast({
                    message: '流程已完成，无需进行处理操作',
                    duration: 3000
                });
                return;
            }

            // 1 确认  system:notification:checkstate
            // 2 签发告知书   system:notification:sign
            // 3 签收告知书   system:notification:checksign
            // 5 处理申述  system:notification:checkRepresentations
            // 6 整改  system:notification:rectification
            // 7 验收  system:notification:acceptance

            let notificationPermissionMap = {
                // 确认  
                1: ['system:notification:checkstate'],
                // 签发告知书
                2: ['system:notification:sign'],
                // 签收告知书
                3: ['system:notification:checksign'],
                // 处理申述
                5: ['system:notification:checkRepresentations'],
                // 整改 
                6: ['system:notification:rectification'],
                // 验收
                7: ['system:notification:acceptance']
            }

            let permisison = notificationPermissionMap && notificationPermissionMap[__currentFlowState__]

            let showEditor = () => {
                // http://192.168.3.172:8888/#/transaction?id=1633051757745750017&progressState=1
                this.$router.push({
                    name: 'transaction',
                    query: {
                        id: flow.id,
                        // 进度状态
                        progressState: flow.preNode,
                        from: 'list'
                    }
                })
            }

            if (!permisison) {
                showEditor()
                return
            }

            // 判断是否具有权限
            let hasPermission = checkPermi(permisison)

            // 没有权限就弹窗显示
            if (!hasPermission) {
                Toast({
                    message: '你当前没有权限操作',
                    duration: 3000
                });
                return
            }
            showEditor();
        },

        /**
             * 获取流程步骤的样式演示
             * @param {Object} item 流程步骤
             */
        getFlowStepClass(item) {
            let type = item.type
            // 等待执行人处理
            if (type === 0) {
                return 'is--done'
            }
            if (type === 1) {
                return 'is--waiting'
            }
        },

        actionHandler(action, options = {}) {
            let actionStrategies = {
                /**
                 * 查看详情
                 */
                viewDetail(item) {
                    debugger
                    this.$router.push({
                        name: 'transaction',
                        query: {
                            // TODO:
                            // - 参数可能要修改
                            id: item.id
                        }
                    })
                },

                viewFlow(item) {
                    this.viewFlow(item)
                }
            }

            // 动作策略
            let actionStrategy = actionStrategies && actionStrategies[action]
            actionStrategy && actionStrategy.call(this, options)
        },

        pullingDown() {
            this.beforePullDown = false
            this.page = 1
            this.getList(false)
        },
        pullingUp() {
            this.page += 1
            this.getList()
        },

        async getList(loadMore = true) {
            try {
                let res = await listNotification(this.queryParams)
                this.total = res.total
                let newList = res.rows.map(itemAdapter)

                if (loadMore) {
                    this.list = this.list.concat(newList)
                } else {
                    this.list = newList
                }
                if (!this.beforePullDown) {
                    this.beforePullDown = true
                }
                this.loadedAll = this.total <= this.list.length
            } catch (error) {
                console.log('network error:')
                console.log(error)
            }
        }
    },

    created() {
        let { isOutDate, getPreNode } = this.$route.query
        this.queryParams.isOutDate = isOutDate
        this.queryParams.preNode = getPreNode
        this.debounceActionHandler = debounce(this.actionHandler, 250)
    },

    mounted() {
        this.getList(false)
    }
}
</script>

<style lang="scss" scoped>
.card--item {
    &---header {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #f3f3f3;
        padding-bottom: 5px;
        margin-bottom: 5px;
    }

    &---truckNo {
        font-size: 24px;
    }
}

.flow-list--view {
    background: #f5f5f5e3;
    min-height: 100vh;
}

.container {
    height: 100%;
    width: 100%;
    background: #f5f5f5;

    .list-wrap {
        height: calc(100% - 50px);
        overflow-y: hidden;
    }
}

.card--item {
    padding: 15px;
    background: #fff;
    border-radius: 10px;
    margin-bottom: 15px;

    p {
        margin-top: 0px;
        margin-bottom: 5px;
        font-size: 16px;
    }
}

// 流程步骤
.flow--step {
    position: relative;
    padding-right: 20px;
    color: #008024;

    &::after {
        position: absolute;
        content: "→";
    }

    &:last-child::after {
        content: "";
    }
}
</style>
