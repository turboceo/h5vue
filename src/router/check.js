export default [
  {
    path: '/check',
    name: 'check',
    component: () => import(/* webpackChunkName: "check" */ 'views/check/index.vue'),
    meta: {
      auth: true,
      title: '执行检查',
      keepAlive: false
    }
  }
]
