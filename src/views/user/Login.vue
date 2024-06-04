<template>
  <div>
    <div class="header">
      <div class="logo">
        <img src="https://img01.yzcdn.cn/vant/logo.png" alt="default_logo" />
      </div>
    </div>
    <div class="content">
      <van-field
        placeholder="帐号"
        v-model="username"
        left-icon="manager-o"
        :error-message="usernameError"
      />
      <!-- eye -->
      <van-field
        v-if="loginWay === 'password'"
        placeholder="登录密码"
        v-model="password"
        left-icon="lock"
        :type="passwordType"
      >
        <van-icon
          slot="right-icon"
          @click="switchPasswordType"
          :name="passwordIcon"
        />
      </van-field>
      <div class="button-wrap">
        <van-button
          size="large"
          :loading="loading.getYZMCode"
          @click="debounceHandleLogin"
          type="info"
          icon="arrow"
          >获取验证码</van-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import debounce from "lodash/debounce";
import { Field, Icon, Button } from "vant";
import { mapActions } from "vuex";

import { login as apiLogin, getCodeSms } from "@/api/login";
import pick from "lodash/pick";

import to from "await-to-js";

import { Notify } from "vant";

const LoginMixin = {
  data() {
    return {
      // 场景
      scene: 1,
      loading: {
        getYZMCode: false,
        login: false,
        // 重新获取验证码
        reGetYZMCode: false
      },

      // 手机号码
      tel: "",

      // 验证码
      yzmcode: ""
    };
  },

  methods: {
    goBack() {
      this.scene = 1;
      // 重置验证码
      this.yzmcode = "";
    },

    /**
     * 跳转到获取验证码的场景
     */
    toGetVerificationCodeScene() {
      this.scene = 2;
    },

    /**
     * 获取验证码
     */
    fetchSmsCode() {
      let data = pick(this, ["username", "password"]);
      return getCodeSms(data);
    }
  }
};

export default {
  name: "Login",

  mixins: [LoginMixin],

  data() {
    return {
      username: "",
      password: "",
      code: "",
      loginWay: "password",
      passwordType: "password",
      usernameError: "",
      openId: ""
    };
  },
  methods: {
    switchPasswordType() {
      this.passwordType =
        this.passwordType === "password" ? "text" : "password";
    },

    async handleLogin() {
      let loginStrategies = {};
      loginStrategies["1"] = async function() {
        this.loading.getYZMCode = true;
        // 发送验证码
        let [err, res] = await to(this.fetchSmsCode());
        this.loading.getYZMCode = false;
        if (err) {
          return;
        }
        this.tel = res.data.tel;
        debugger;

        Notify({
          type: "success",
          message: "验证码发送成功，请注意查收"
          // title: "提示",
          // position: "bottom",
        });

        this.toGetVerificationCodeScene();
      };

      loginStrategies["2"] = async function() {
        // 默认Cookie政策
        let defaultCookiePolicy = { expires: 30 };
        let { username, password } = this.loginForm;
        Cookies.set("username", username, defaultCookiePolicy);
        Cookies.set("password", encrypt(password), defaultCookiePolicy);
        let data = pick(this.loginForm, ["username", "password", "yzmcode"]);
        this.loading.login = true;
        this.$store
          .dispatch("Login", data)
          .then(() => {
            this.loading.login = false;
            this.$router.push({ path: this.redirect || "/" }).catch(() => {});
          })
          .catch(() => {
            this.loading.login = false;
          });
      };

      let loginStrategy = loginStrategies && loginStrategies[this.scene];
      if (!loginStrategy) return;
      // 执行策略
      loginStrategy && loginStrategy.call(this);
    },
    ...mapActions({
      login: "user/login"
    })
  },
  computed: {
    loginWayObj: function() {
      if (this.loginWay === "password") {
        return {
          icon: "closed-eye",
          toggleMsg: "验证码登录"
        };
      }
      return {
        icon: "eye",
        toggleMsg: "密码登录"
      };
    },
    passwordIcon: function() {
      return this.passwordType === "password" ? "closed-eye" : "eye";
    }
  },

  components: {
    [Field.name]: Field,
    [Icon.name]: Icon,
    [Button.name]: Button
  },

  created() {
    if (process.env.NODE_ENV === "development") {
      this.username = "admin@pyzl";
      this.password = "123456";
    }
    // 节流优化
    this.debounceHandleLogin = debounce(this.handleLogin, 500);
    let q = this.$route.query;
    if (q.openId) {
      this.openId = q.openId;
      return;
    }
    let opendIdQueryArr = location.search.match(/\?openId=(.+)\&?/);
    if (opendIdQueryArr && opendIdQueryArr[1]) {
      let openId = opendIdQueryArr[1];
      location.replace(location.origin + "/#/login?openId=" + openId);
    }
  }
};
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
