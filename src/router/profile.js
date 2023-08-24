export default [
  {
    path: '/profile',
    name: 'profile',
    component: () => import(/* webpackChunkName: "profile" */ 'views/Profile.vue'),
    meta: {
      auth: true,
      title: '个人中心',
      keepAlive: true
    }
  }
]
