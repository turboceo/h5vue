<template>
  <div class="container">
    <div class="home--view p-15">
      <!-- 卡片 -->
      <CardBox v-model="transaction.init" title="配送安全事务">
        <template #default>
          <div class="bg--card p-15 card-box--content" :class="{ 'is--loading': transaction.loading }"
            v-show="transaction.init" style="position: relative;">
            <template v-if="transaction.loading">
              <van-skeleton title :row="3" />
            </template>
            <template v-else>
              <div class="flex space-between w25 table-row" @click="goNotificationList">
                <span> 待办
                  <i>{{ total }}</i>
                </span>
              </div>
            </template>
          </div>
        </template>
      </CardBox>

      <!-- 卡片 -->
      <CardBox title="你已经完成的事务" :show-toggler="false">
        <div class="bg--card p-15 card-box--content log--container" :class="{ 'is--loading': log.loading }">
          <template v-if="log.loading">
            <van-skeleton title :row="3" />
          </template>
          <template v-else-if="log.isEmpty">
            <div class="empty--container">
              <svg-icon class="icon" icon-class="nomoredata" />
              <p>暂无数据</p>
            </div>
          </template>
          <template v-else>
            <div class="log--item" v-for="(item, $index) in log.data" :key="$index" @click="handleLogItemClick(item)">
              <span> {{ (item.updateTime || '').slice(11, 16) }} </span>
              <span> 提交了对[ </span>
              <span>
                {{ item.truckNo }}
              </span>
              <span> ]的安全检查 </span>
            </div>
          </template>
        </div>
      </CardBox>
    </div>

    <div class="page--action" v-show="hasAddPrivillage">
      <van-button type="primary" icon="add" class="btn--add" @click="debounceAddTransaction"
        style="background: #2d8988; border-color: #2d8988">执行检查</van-button>
    </div>

    <footer-tabbar />

    <van-popup v-model="showAddEventPopup" position="bottom" :style="{ height: 40 * eventActions.length + 20 + 'px' }">
      <div class="height: 20px;">&nbsp;</div>
      <div class="action--item" v-for="item in eventActions" :key="item.type" @click="onSelectEventOption(item)">{{
        item.name }}</div>
    </van-popup>

    <van-action-sheet v-model="showDoneEventDetail" title="事务信息">
      <DoneEventDetail :item="currentDoneEventItem" />
    </van-action-sheet>
  </div>
</template>

<script>
import DoneEventDetail from '@/components/DoneEventDetail.vue'
import { mapActions, mapMutations, mapState } from 'vuex' // createNamespacedHelpers
import { Tabbar, TabbarItem } from 'vant'
import FooterTabbar from '@/components/FooterTabbar'

import { checkUser } from '@/api/user'

import { getCompletedNotification } from '@/api/notification'

// const { mapActions } = createNamespacedHelpers('test') // 可使用这种方式直接获得test模板

const DefaultMixin = {
  name: 'home',

  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    FooterTabbar,
  },

  computed: {
    ...mapState({
      loading: state => state['@@loading'].effects['test/onePlusAsync']
    })
  },

  methods: {
    ...mapMutations({
      logout: 'user/LOGOUT'
    })
  }
}

import debounce from "lodash/debounce";
import { getNotificationReport } from "@/api/system/notification";

import CardBox from 'components/CardBox/IndexView'

let __actions__ = [{
  name: '应急指挥中心监察',
  type: 'real'
}, {
  name: '属地检查',
  type: 'dep'
}, {
  name: '第三方检查',
  type: 'sgs'
}]


const UserRoleMixin = {
  data() {
    return {
      role: 0
    }
  },

  computed: {
    eventActions() {
      if (this.role === 1) return [__actions__[0]]
      if (this.role === 2) return [__actions__[2]]
      if (this.role === 3) return [__actions__[1]]
      return __actions__
    }
  }
}

const AddEventMixin = {
  data() {
    return {
      showAddEventPopup: false,
    }
  },

  methods: {
    onSelectEventOption(item) {
      console.log(item)
      this.showAddEventPopup = false;
      this.$router.push({
        name: 'check',
        query: {
          type: item.type
        }
      })
    }
  }
}

export default {
  name: "HomeView",

  components: {
    CardBox,
    DoneEventDetail
  },

  mixins: [DefaultMixin, AddEventMixin, UserRoleMixin],

  data() {
    return {
      init: true,

      total: 0,

      transaction: {
        loading: true,
        init: true,
        data: [],
      },

      // 日志列表
      log: {
        loading: true,
        init: true,
        data: [],
      },

      hasAddPrivillage: false,

      showDoneEventDetail: false,

      currentDoneEventItem: {}
    };
  },

  methods: {

    handleLogItemClick(item) {
      this.currentDoneEventItem = item
      this.showDoneEventDetail = true
    },

    goNotificationList() {
      this.$router.push({
        name: "notification",
        // query: {
        //   isOutDate: 0,
        //   getPreNode: item.getPreNode
        // }
      });
    },

    addTransaction() {
      this.showAddEventPopup = true
    },

    computeRowClassName(item) {
      if (item.todo > 0 || item.outdate > 0) return true;
      return false;
    },

    handleItemTodoClicked(item) {
      if (item.todo > 0) {
        this.$router.push({
          name: "notification",
          query: {
            isOutDate: 0,
            getPreNode: item.getPreNode
          }
        });
      }
    },

    handleItemOutdateClicked(item) {
      if (item.outdate > 0) {
        this.$router.push({
          name: "notification",
          query: {
            isOutDate: 1,
            getPreNode: item.getPreNode
          }
        });
      }
    },
  },

  async created() {
    this.debounceAddTransaction = debounce(this.addTransaction, 250);

    this.transaction.loading = true;

    const TEMPLATE_LIST = [
      {
        name: '违规认定',
        todo: 0,
        outdate: 0,
        getPreNode: 1
      },
      {
        name: '申诉处理',
        todo: 0,
        outdate: 0,
        getPreNode: 2
      },
      {
        name: '整改通知',
        todo: 0,
        outdate: 0,
        getPreNode: 3
      },
      {
        name: '整改验收',
        todo: 0,
        outdate: 0,
        getPreNode: 4
      },
    ];

    let total = 0
    // 获取报表信息
    getNotificationReport().then((res) => {
      let data = res.data
      if (data && data[0]) {
        let dataset = data[0]
        Object.keys(dataset).forEach((key) => {
          let value = dataset[key];
          // 计算总事件数量
          if (value > 0) {
            total += value;
          }
          let index = +key - 1;
          TEMPLATE_LIST[index].todo = value;
        });
        this.total = total;

        // 当数据为0的时候将面板折叠
        if (total === 0) {
          this.transaction.init = false
        }
        this.transaction.data = TEMPLATE_LIST;
        this.transaction.loading = false;
      }
    });

    // 新增权限判断
    let CHECK_PRIVILLAGE = ['residentoffice', 'sgs', 'checker', 'admin']
    let roles = this.$store.state.user.user.roles

    console.log('log roles:');
    console.log(roles);

    let ret = roles.filter(role => {
      if (CHECK_PRIVILLAGE.includes(role)) return true
      return false
    })

    // 驻厂办	residentoffice       SGS	sgs   监查员	checker
    // 移动端新增按钮授权控制，目前只有应急中心检查员、SGS、驻厂办有新增权限，
    // 且应急中心检查员对应应急指挥中心检查，驻厂办对应属地检查, SGS对应第三方检查，
    if (ret.length > 0) {
      this.hasAddPrivillage = true
    } else {
      this.hasAddPrivillage = false
    }

    try {
      let checkUserResponse = await checkUser()
      this.role = checkUserResponse.data.roles

      this.log.loading = true;

      let completednotificationResponse = await getCompletedNotification({
        pageNum: 1,
        pageSize: 10
      })

      this.log.data = completednotificationResponse.rows
      this.log.isEmpty = completednotificationResponse.total === 0
      this.log.loading = false;
    } catch (error) {
      console.log('api  error:')
      console.log(error)
    }
  },
};
</script>

<style lang="scss" scoped>
.home--view {
  padding-bottom: 100px;
}

.empty--container {
  display: flex;
  // justify-content: center;
  flex-direction: column;
  align-items: center;

  .icon {
    font-size: 90px;
  }

  p {
    font-size: 14px;
    margin: 0;
    color: #aeaeae;
    font-weight: 400;
  }
}

// 新增按钮
.btn--add {
  width: 52%;
}

.table-row {
  span {
    background: #fff;
    width: 100%;
    height: 100px;
    font-size: 30px;

    display: flex;
    justify-content: center;
    align-items: center;

    color: #2b8887;
    font-weight: 450;

    i {
      background: #e1e1e1;
      border-radius: 10px;
      text-align: center;
      margin-left: 10px;
      font-style: normal;
      padding: 5px 8px;
    }

    &.is--important {
      color: #be0004;
    }

    &.hidden {
      visibility: hidden;
    }
  }
}

.log--item {
  color: #2500ff;
  font-size: 15px;
  cursor: pointer;

  &~& {
    margin-top: 5px;
  }
}

.page--action {
  position: fixed;
  bottom: 70px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
}

.action--item {
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 18px;
  position: relative;

  &:after {
    position: absolute;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    right: 16px;
    bottom: 0;
    left: 16px;
    border-bottom: 1px solid #ebedf0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
}
</style>