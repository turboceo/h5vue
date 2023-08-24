export default [
    {
        path: '/notification',
        name: 'notification',
        component: () => import(/* webpackChunkName: "flow-list" */ 'views/notification/index.vue'),
        meta: {
            title: '通知列表',
            auth: true,
            iconName: 'arrow-left',
        },
    },
    {
        path: '/operateFlow',
        name: 'operateFlow',
        component: () => import(/* webpackChunkName: "flow-list" */ 'views/notification/operate.vue'),
        meta: {
            title: '流程列表',
            auth: true,
            iconName: 'arrow-left',
        },
    }
]