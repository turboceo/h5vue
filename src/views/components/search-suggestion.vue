<template>
    <div class="search-suggestion">
        <van-cell v-for="(item, index) in suggestions" :key="index" icon="search" :title="item.briefCont"></van-cell>
    </div>
</template>
<script>
import { listTransRole, getAllTransRole } from '@/api/system/transRole'
import { debounce } from 'lodash'

import { Cell } from 'vant'

export default {
    name: 'SearchSuggestion',

    data() {
        return {
            suggestions: [] // 联想建议数据列表
        }
    },

    components: {
        [Cell.name]: Cell
    },

    props: {
        searchText: {
            type: String,
            required: true
        }
    },

    watch: {
        // 监视的完整写法
        searchText: {
            // 当数据发生变化则会执行 handler处理函数
            handler: debounce(async function () {
                try {
                    const res = await listTransRole(this.searchText)
                    this.suggestions = res.rows.filter(item => item.briefCont.indexOf(this.searchText) > -1)
                } catch (error) {
                    console.log('log error:')
                    console.log(error)
                }
            }, 200),
            immediate: true // 该回调将会在侦听开始之后被立即调用
        }
    }
}
</script>

<style scoped></style>

