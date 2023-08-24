<template>
  <div class="app-footer flex space-between">
    <van-popover
      v-model="item.show"
      trigger="click"
      :actions="item.list"
      @select="onSelect"
      v-for="item in list"
      :key="item.id"
      placement="top"
    >
      <template #reference>
        <van-button type="info" @click="handleNavTriggerClick(item)">{{ item.list[0].text }}</van-button>
      </template>
    </van-popover>
  </div>
</template>

<script>
export default {
  name: "GlobalFooter",

  data() {
    return {
      list: [
        {
          id: "c00",
          show: false,
          list: [
            {
              id: "c000",
              text: "管理公告",
            },
            {
              id: "c001",
              text: "安全手册",
            },
            {
              id: "c002",
              text: "安环政策",
            },
          ],
        },
        {
          id: "c01",
          show: false,
          list: [
            {
              id: "c010",
              text: "配送安全事务",
            },
            {
              id: "c011",
              text: "自提业务检查",
            },
            {
              id: "c012",
              text: "配送业务检查",
            },
          ],
        },
        {
          id: "c02",
          show: false,
          list: [
            {
              id: "c020",
              text: "我的",
            },
            {
              id: "c021",
              text: "登录状态",
            },
          ],
        },
      ],
    };
  },

  methods: {
    handleNavTriggerClick(item) {
      // 当前点击项的Id
      let __currentItemId__ = item.id;
      this.list.forEach((item) => {
        // 互斥逻辑
        if (item.id !== __currentItemId__) {
          item.show = false;
          return;
        }
        // item.show = !item.show;
      });
    },

    onSelect(action) {
      console.log("log action...");
      console.log(JSON.stringify(action));
      // TODO:
      // - 接入跳转逻辑
      this.$toast('点击了: ' + action.text)
    },
  },
};
</script>

<style lang="scss" scoped>
.app-footer {
  background: #e8e8e8;
  padding: 10px 20px;
}

.dropdown {
  position: relative;

  &-item {
    color: #2c7fec;
    flex: 1;
    cursor: pointer;
  }

  &-nav {
    position: absolute;
    transform: scale(0);
    top: 0;
    transition: transform 0.2s ease-in-out;
    background: #f0f8ff;
    padding: 15px;
    width: 200px;

    &.is--show {
      transform: scale(1) translateY(-100%);
    }
  }
}
</style>