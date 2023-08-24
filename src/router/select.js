export default [
  {
    path: '/select',
    name: 'select',
    component: () => import(/* webpackChunkName: "select" */ 'views/select/index.vue'),
    meta: {
      auth: true,
      title: '填写检查项',
      keepAlive: true
    }
  }
]
