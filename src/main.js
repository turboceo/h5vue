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

import DrawerSearch from 'components/DrawerSearch'

import debounce from 'lodash/debounce'

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
Vue.component('DrawerSearch', DrawerSearch)

Vue.prototype.$debounce = debounce
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
