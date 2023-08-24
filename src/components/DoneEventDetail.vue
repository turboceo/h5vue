<template>
    <div class="check--view">
        <div class="p-15">
            <div class="bg--white content--area">
                <van-field v-model="item.truckNo" input-align="right" center clearable label="车牌号:" placeholder=""
                    :readonly="true">
                </van-field>
                <van-field v-model="item.briefCont" input-align="right" center clearable label="违规项:" placeholder=""
                    :readonly="true">
                </van-field>
                <van-field v-model="item.moniterId" input-align="right" center clearable label="违规ID:" placeholder=""
                    :readonly="true">
                </van-field>
                <van-field v-model="item.updateTime" input-align="right" center clearable label="完成时间:" placeholder=""
                    :readonly="true">
                </van-field>
            </div>
        </div>
        <div class="safe-palceholder"></div>
    </div>
</template>
  
<script>
export let STATEMAP = {
    // 承运商
    0: '监查记录',
    1: '确认',
    3: '签收通知书',
    4: '申述',
    6: '整改',
    // 执行岗
    2: '签发通知书',
    5: '处理申述',
    7: '验收',
    8: '结束',
};

const PreNodeMixin = {
    computed: {
        preNode() {
            return (STATEMAP && STATEMAP[this.item.preNode]) || '未知状态';
        }
    },
}

export default {
    name: 'Done',

    props: {
        item: {
            type: Object,
            default() {
                return {

                }
            }
        }
    },

    mixins: [PreNodeMixin],
}
</script>
  
<style lang="scss" scoped>
// 通知栏
.high--contract {
    border-bottom: 1px solid #15151540;
}

.check--view {
    background: #f7f7f7;
}

.video--grallery {
    padding: 10px 16px;
}

.video--file {
    width: 100%;
    height: 160px;
}

.image--container {
    padding: 10px;
}

.grid-item {
    width: 100%;
    height: 100px;
    box-sizing: border-box;
    padding: 5px;
    background-size: cover;
}

.viewmore--trigger {
    position: absolute;
    bottom: -30px;
    left: 15px;
    font-weight: 500;
    color: #5469f6;
    z-index: 2;
    font-size: 16px;
}

.safe-palceholder {
    padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
    padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
}
</style>
  