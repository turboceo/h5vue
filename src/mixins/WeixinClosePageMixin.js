import { closePage } from 'utils/weixin'

const WeixinClosePageMixin = {
    methods: {
        closePage() {
            closePage.call(this)
        }
    }
}

export default WeixinClosePageMixin