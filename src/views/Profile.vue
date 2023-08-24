<template>
  <div class="container">
    <div class="card is--profile">
      <div>
        <div class="user-avatar">
          <img class="user-avatar--img" :src="user.avatar" alt="用户头像" />
        </div>

        <div class="list-group list-group-striped">
          <van-field v-model="user.userName" left-icon="manager-o" label="用户名称:" input-align="right" placeholder=""
            :readonly="true">
          </van-field>
          <van-field v-model="user.phonenumber" left-icon="phone" label="手机号码:" input-align="right" placeholder=""
            :readonly="true">
          </van-field>

          <van-field v-model="user.email" left-icon="manager-o" label="用户邮箱:" input-align="right" placeholder=""
            :readonly="true">
          </van-field>

          <div class="van-cell van-cell--center van-field justify-between">
            <div class="left">
              <van-icon name="friends-o" />
              <span>所属部门:</span>
            </div>
            <span>
              {{ user.dept && user.dept.deptName }} / {{ postGroup }}
            </span>
          </div>

          <van-field v-model="roleGroup" left-icon="diamond-o" label="所属角色:" input-align="right" placeholder=""
            :readonly="true">
          </van-field>

          <van-field v-model="user.createTime" left-icon="calendar-o" label="创建日期:" input-align="right" placeholder=""
            :readonly="true">
          </van-field>
        </div>
      </div>
    </div>

    <div class="buttons">
      <van-button type="warning" @click="handleUserLogout" :loading="isLogouting" loading-text="正在退出...">退出登录</van-button>
    </div>

    <footer-tabbar />
  </div>
</template>

<script>
import { mapMutations } from 'vuex' // createNamespacedHelpers

import { getUserProfile } from "@/api/system/user";

import { Tabbar, TabbarItem } from 'vant'
import FooterTabbar from 'components/FooterTabbar'

import debounce from 'lodash/debounce';

export default {
  name: 'home',

  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    FooterTabbar,
  },

  data() {
    return {
      user: {},
      roleGroup: '',
      postGroup: '',
      isLogouting: false
    };
  },

  methods: {
    ...mapMutations({
      logout: 'user/LOGOUT'
    }),

    getUser() {
      getUserProfile().then(response => {
        let user = response.data.user;
        // 设置默认头像
        user.avatar = user.avatar ? user.avatar : require("@/assets/profile.png")
        this.user = user
        this.roleGroup = response.data.roleGroup;
        this.postGroup = response.data.postGroup;
      });
    },

    handleUserLogout() {
      this.isLogouting = true
      this.logout().then(() => {
        this.isLogouting = false
      }).catch(() => {
        this.isLogouting = false
      })
    }
  },

  created() {
    this.deboucneUserLogout = debounce(this.handleUserLogout, 250);
    this.getUser();
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: auto;
  width: 100%;
  padding-bottom: 50px;
  padding-top: 40px;
}

.user-avatar {
  text-align: center;
  margin-bottom: 20px;

  &--img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
}


.buttons {
  margin-top: 20px;
  padding: 0 15px;
  font-size: 18px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;

  a {
    color: #333;
  }
}
</style>
