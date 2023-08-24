export default [
    {
        path: '/transaction',
        name: 'transaction',
        component: () => import(/* webpackChunkName: "transaction" */ 'views/transaction/index.vue'),
        meta: {
            auth: true,
            title: '流程明细',
            keepAlive: true
        }
    }
]
