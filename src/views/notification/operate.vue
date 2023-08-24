<template>
    <div class="flow-list-operate--view ">
        <div class="p-15">
            <h1>operate Flow</h1>
        </div>
    </div>
</template>
  
<script>
import debounce from "lodash/debounce";

import {
    listNotification
} from '@/api/system/notification'

let itemAdapter = (item) => {
    let t = item.tmsWaybillVo;
    console.log(`当前流程#{${item.id}}状态: ${item.preNode}`);
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
            let p = node.progressState;
            return {
                id: p,
                name: PROGRESS_STATE_NAME_MAP[p],
            };
        }),
        // 当前操作流程状态
        preNode: item.preNode,
    };
    return ret;
};


export default {
    name: "FlowListView",

    data() {
        return {
            errorMsg: "",

            list: [],

            show: {
                notication: false,
            },

        };
    },

    methods: {
        /**
         * 查看流程
         */
        viewFlow(item, flow) {
            console.log(item)
            console.log(flow)
            this.$router.push({
                name: 'viewTransaction',
                query: {
                    // TODO:
                    // - 参数可能要修改
                    id: item.id
                }
            })
        },

        /**
         * 查看详情
         */
        viewDetail(item) {
            console.log(item)
            this.$router.push({
                name: 'viewTransaction',
                query: {
                    // TODO:
                    // - 参数可能要修改
                    id: item.id
                }
            })
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
        }
    },

    created() {
        // // 节流优化
        // this.debounceHandleCarNoInput = debounce(this.handleCarNoInput, 1000);
        listNotification().then(res => {
            console.log(res)
        })
    },
};
</script>
  
<style lang="scss" scoped>
// 通知栏
.notification-bar {
    margin: -15px -15px 15px -15px;
}

// .card--list {
//   background: white;
// }

.flow-list--view {
    background: #f5f5f5e3;
    min-height: 100vh;

}

.card--item {
    padding: 15px;
    background: #fff;
    border-radius: 0.625rem;

    p {
        margin-top: 0.625rem;
        margin-bottom: 0.625rem;
    }
}

// 流程步骤
.flow--step {
    position: relative;
    padding-right: 20px;
    color: #aaa;

    &.is--done {
        color: #008024;
    }

    &.is--waiting {
        color: #F59A23
    }

    &::after {
        position: absolute;
        content: "→";
    }

    &:last-child::after {
        content: "";
    }
}
</style>
  