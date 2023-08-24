import Vue from 'vue'
import 'lib-flexible'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import 'utils/permission'
import SvgIcon from 'components/SvgIcon'
import '@/icons' // icon
import '@/style/common.scss'

import { Row, Col, Lazyload, Button, Icon, Toast, NavBar, DropdownMenu, DropdownItem, Popover, Field, Checkbox, Empty, Skeleton, Popup, NoticeBar, Divider, Dialog, Grid, GridItem, Image, Uploader, ActionSheet } from 'vant'
import defaultSettings from '@/settings'
import DirectiveInstall from '@/directive'

// import * as fundebug from "fundebug-javascript";
// import FundebugVue from "fundebug-vue";

// let isDev = process.env.NODE_ENV === 'development'
// if(!isDev) {
//   fundebug.init({
//     apikey: "fb11642bf4ece2267df6e10ee88d1d15e8e2d1e29a71bb04b8fef3918093861d"
//   })
//   new FundebugVue(fundebug).installVueErrorHandler(Vue); // Vue 2.x 
// }

Vue.use(DirectiveInstall)

Vue.use(Row)
Vue.use(Col)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Toast)
Vue.use(NavBar)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Popover)
Vue.use(Field)
Vue.use(Checkbox)
Vue.use(Empty)
Vue.use(Skeleton)
Vue.use(Popup)
Vue.use(NoticeBar)
Vue.use(Divider)
Vue.use(Dialog)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(Image)
Vue.use(Uploader)
Vue.use(ActionSheet)

// options 为可选参数，无则不传
Vue.use(Lazyload)

Vue.component('svg-icon', SvgIcon)

import DrawerSearch from 'components/DrawerSearch'
Vue.component('DrawerSearch', DrawerSearch)

Vue.prototype.$delay = (second) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, second * 1000);
  });
};

import debounce from "lodash/debounce";
Vue.prototype.$debounce = debounce

// if (process.env.NODE_ENV === 'development' && defaultSettings.vconsole) {
//   const VConsole = require('vconsole')
//   // eslint-disable-next-line
//   const my_console = new VConsole()
// }

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
