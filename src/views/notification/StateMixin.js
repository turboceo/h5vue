export let STATEMAP = {
    // 承运商
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

export default {
    methods: {
        getProgressStateDesc(state) {
            return (STATEMAP && STATEMAP[state]) || '未知状态';
        }
    }
}