<template>
  <div class="app-footer p-15 flex space-between">
    <div class="dropdown" v-for="item in list" :key="item.id">
      <div class="dropdown-item pl-15 pr-15" @click="handleNavTriggerClick(item)">
        {{ item.list[0].name }}
      </div>
      <nav class="dropdown-nav" :class="{ 'is--show': item.show }">
        <ul>
          <li class="dropdown-item" v-for="child in item.list" :key="child.id">
            {{ child.name }}
          </li>
        </ul>
      </nav>
    </div>
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
              name: "管理公告",
            },
            {
              id: "c001",
              name: "管理公告1",
            },
            {
              id: "c002",
              name: "管理公告2",
            },
          ],
        },
        {
          id: "c01",
          show: false,
          list: [
            {
              id: "c010",
              name: "配送安全事务",
            },
            {
              id: "c011",
              name: "管理公告1",
            },
            {
              id: "c012",
              name: "管理公告2",
            },
          ],
        },
        {
          id: "c02",
          show: false,
          list: [
            {
              id: "c020",
              name: "我的",
            },
            {
              id: "c021",
              name: "登录状态",
            },
          ],
        },
      ],
    };
  },

  methods: {
    handleNavTriggerClick(item) {
      let __currentItemId__ = item.id
      this.list.forEach(item => {
        if(item.id !== __currentItemId__) {
          item.show = false
          return
        } 
        item.show = !item.show
      })
    },

    handleDropdownItemClick(type) {
      // ...
      console.log("click...", type);
    },
  },
};
</script>

<style lang="scss" scoped>
.app-footer {
  background: #e8e8e8;
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
    transition: transform .2s ease-in-out;
    background: #f0f8ff;
    padding: 15px;
    width: 200px;

    &.is--show {
      transform: scale(1) translateY(-100%);
    }
  }
}
</style>