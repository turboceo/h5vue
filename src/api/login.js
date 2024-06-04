import request from "@/utils/request";

let isDev = process.env.NODE_ENV === "development";

//
/**
 * 登录方法
 * @param userInfo
 * @returns {Promise}
 */
export function login(userInfo) {
  debugger;
  if (isDev) {
    let fakeResponse = {
      code: 200,
      msg: "操作成功",
      data: {
        token:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJzeXNfdXNlcjoxIiwicm5TdHIiOiJkUk9HNGNwVUNFMWtkYTZTc0x2V0RESkwwZXdVUWFqVSJ9.t9ovMgubx_zZsgS5PyTvTrC5fQkAU8TF8vq2hZ4BHDo"
      }
    };
    return Promise.resolve(fakeResponse);
  }
  return request({
    url: "/loginbyyzm",
    headers: {
      isToken: false
    },
    method: "post",
    data: userInfo
  });
}

/**
 * 短信验证码
 * @param data
 * @returns {Promise}
 */
export function getCodeSms(data) {
  console.log(`getCodeSms::`);
  console.log(data);
  if (isDev) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          code: 0,
          msg: "获取成功",
          data: {
            tel: "13*****1876"
          }
        });
      }, 100);
    });
  }
  return request({
    url: "/logingetyzm",
    headers: {
      isToken: false
    },
    method: "post",
    data
  });
}

// Wechat登录
export function xclogin(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  };
  return request({
    url: "/xcxLogin",
    headers: {
      isToken: false
    },
    method: "post",
    data: data
  });
}

// 注册方法
export function register(data) {
  return request({
    url: "/register",
    headers: {
      isToken: false
    },
    method: "post",
    data: data
  });
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: "/getInfo",
    method: "get"
  });
}

// 退出方法
export function logout() {
  return request({
    url: "/Applogout",
    method: "post"
  });
}
