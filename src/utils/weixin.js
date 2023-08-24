/**
 * 关闭页面
 */
export let closePage = function () {
    let q = this.$route.query
    // 判断消息来源
    if (q && q.from == 'list') {
        location.replace('/#/notification')
        return
    }
    let t = setTimeout(() => {
        t && clearTimeout(t)
        //不需要jssdk 两种方法都行
        document.addEventListener('WeixinJSBridgeReady', function () {
            WeixinJSBridge.call('closeWindow');
        }, false);
        //这个可以关闭ios系统的手机
        WeixinJSBridge.call('closeWindow');
        // //需要jssdk
        // wx.closeWindow()
    }, 100)
}