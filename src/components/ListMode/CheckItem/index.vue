<template>
    <div class="c-checkitem">
        <div class="field--wrapper">
            <van-field v-model="form.briefCont" center readonly label="违规内容" placeholder="请输入">
            </van-field>
            <van-cell>
                <div class="flex justify-between">
                    <span style="color: #646566">是否异常</span>
                    <van-radio-group v-model="form.model" direction="horizontal">
                        <van-radio :name="0">合规</van-radio>
                        <van-radio :name="1">不适用</van-radio>
                        <van-radio :name="2">违规</van-radio>
                    </van-radio-group>
                </div>
            </van-cell>
            <van-field v-model="form.remark" center clearable :required="isRequired" rows="3" autosize type="textarea"
                placeholder="请输入违规描述">
            </van-field>
            <van-field center :required="isRequired" :readonly="true" placeholder="可拍照片、录视频、或上传文件">
                <template #button>
                    <div class="icon--group">
                        <VantCustomUplader class="icon-item" type="photo" @upload-success="handleUploadSuccess">
                        </VantCustomUplader>
                        <VantCustomUplader class="icon-item" type="video" @upload-success="handleUploadSuccess">
                        </VantCustomUplader>
                        <VantCustomUplader class="icon-item" type="file" @upload-success="handleUploadSuccess">
                        </VantCustomUplader>
                    </div>
                </template>
            </van-field>
            <div class="file--list" style="padding: 10px 16px;">
                <div class="flex justify-between file--item items-center my-10" v-for="item in form.fileList"
                    :key="item.ossId">
                    <span> {{ item.fileName }}</span>
                    <van-button type="danger" icon="clear" size="mini" @click="handleFileItemRemove(item)">删除</van-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Cell, Toast, Radio, RadioGroup } from 'vant'

import VantCustomUplader from './uploader.vue'

export default {
    name: "CheckItem",

    props: {
        form: {
            type: Object,
            required: true,
            default() {
                return {}
            }
        }
    },

    components: {
        VantCustomUplader,
        [Cell.name]: Cell,
        [Radio.name]: Radio,
        [RadioGroup.name]: RadioGroup,
    },

    computed: {
        // 是否为6+2必填
        isRequired() {
            return this.form.highRank === 2
        }
    },

    data() {
        return {
            // ...
        }
    },

    methods: {
        handleUploadSuccess(file) {
            debugger
            this.form.fileList.push(file);
        }
    }
}
</script>

<style lang="scss" scoped>
.field--wrapper {
    position: relative;
    border: 1px solid #ececec;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 20px;
}
</style>