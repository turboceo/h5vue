<template>
  <div>
    <div class="header">
      <div class="logo">
        <img src="https://img01.yzcdn.cn/vant/logo.png" alt="default_logo">
      </div>
    </div>
    <div class="content">
      <van-field placeholder="帐号" v-model="username" left-icon="manager-o" :error-message="usernameError" />
      <!-- eye -->
      <van-field v-if="loginWay === 'password'" placeholder="登录密码" v-model="password" left-icon="lock"
        :type="passwordType">
        <van-icon slot="right-icon" @click="switchPasswordType" :name="passwordIcon" />
      </van-field>
      <div class="button-wrap">
        <van-button size="large" :loading="isUserLogining" @click="debounceHandleLogin" type="info">登录</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import debounce from 'lodash/debounce'
import { Field, Icon, Button } from 'vant'
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      code: '',
      loginWay: 'password',
      passwordType: 'password',
      usernameError: '',
      openId: '',

      isUserLogining: false
    }
  },
  methods: {
    switchPasswordType () {
      this.passwordType = this.passwordType === 'password' ? 'text' : 'password'
    },

    async handleLogin () {
      let username = this.username.trim()
      let password = this.password.trim()
      if (username === '') {
        this.errorMsg = '请输入帐号'
        return
      }
      if (password === '') {
        this.errorMsg = '请输入密码'
        return
      }

      const data = {
        username: username,
        password: password,
        openId: this.openId,
        $router: this.$router,
        $route: this.$route
      }

      try {
        this.isUserLogining = true
        await this.login(data)
        this.isUserLogining = false
      } catch (error) {
        this.isUserLogining = false
      }
    },
    ...mapActions({
      login: 'user/login'
    })
  },
  computed: {
    loginWayObj: function () {
      if (this.loginWay === 'password') {
        return {
          icon: 'closed-eye',
          toggleMsg: '验证码登录'
        }
      }
      return {
        icon: 'eye',
        toggleMsg: '密码登录'
      }
    },
    passwordIcon: function () {
      return this.passwordType === 'password' ? 'closed-eye' : 'eye'
    }
  },

  components: {
    [Field.name]: Field,
    [Icon.name]: Icon,
    [Button.name]: Button
  },

  created () {
    // if (process.env.NODE_ENV === 'development') {
    //   this.username = 'admin@pyzl'
    //   this.password = '123456'
    // }
    // 节流优化
    this.debounceHandleLogin = debounce(this.handleLogin, 500)
    let q = this.$route.query
    if (q.openId) {
      this.openId = q.openId
      return
    }
    let opendIdQueryArr = location.search.match(/\?openId=(.+)\&?/)
    if (opendIdQueryArr && opendIdQueryArr[1]) {
      let openId = opendIdQueryArr[1]
      location.replace(location.origin + '/#/login?openId=' + openId)
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 165px;
  display: flex;
  justify-content: center;
  align-items: center;

  .logo {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
    }
  }
}

.content {
  width: 100%;
  height: auto;
  padding: 0 15px;
  box-sizing: border-box;

  .button-wrap {
    width: 100%;
    height: auto;
    margin-top: 15px;
  }
}

.more-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
  font-size: 14px;

  a.link {
    color: #1989fa;
  }

  .switch-way {
    color: #333;
  }
}
</style>
