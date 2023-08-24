import { RadioGroup, Radio } from 'vant'

const RectificationRequirementMixin = {
    components: {
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio
    },

    data() {
        return {
            radio: '立即整改',
            content: '',
            showRectificationRequirementError: false,
        }
    },

    computed: {
        isOtherRectificationRequirementType() {
            return this.radio === '其他'
        }
    },

    methods: {
        /**
         * 验证整改需求表单是否完整
         */
        isRectificationRequirementValidate() {
            let content = this.content.trim();
            // 校验
            if (this.isOtherRectificationRequirementType && content === '') {
                return false
            }
            return true
        },
    },

    created() {
        console.log('Log State:')
        console.log(this.state)
    }
}

export default RectificationRequirementMixin