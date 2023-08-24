<template>
    <van-uploader accept="" class="icon-item" :before-read="beforeRead" :after-read="afterRead">
        <van-button type="primary" icon="plus" size="mini">点击上传</van-button>
    </van-uploader>
</template>

<script>
import { uploadFile } from "@/api/system/oss";

import { Uploader, Toast } from 'vant';

let UploadMixin = {
    components: {
        Uploader,
        Toast
    },

    methods: {
        beforeRead(file) {
            if (file.type === "application/pdf") {
                return true;
            }
            this.$toast("请上传pdf文档");
            return false;
        },

        /**
         * OSS文件上传
         * @param {File} file 文件上传对象
         * @param {String} errorMsg 错误信息
         */
        uploadFile(file, errorMsg) {
            return new Promise((resolve, reject) => {
                let fd = new window.FormData();
                fd.append("file", file, file.name);
                uploadFile(fd)
                    .then((ossResponse) => {
                        resolve(ossResponse.data);
                    })
                    .catch(() => reject(errorMsg));
            });
        },

        async afterRead(file) {
            //文件读取完成后的回调函数
            try {
                this.$toast("文件上传中,请稍等...");
                let ossResponseData = await this.uploadFile(file.file, "文件上传失败");
                console.log(ossResponseData);
                this.$emit('upload-success', {
                    strategy: this.name,
                    file: ossResponseData
                })
            } catch (err) {
                console.log(`文件上传失败`)
                console.log(err);
                this.$toast(err);
            }
        },
    },
};

export default {
    name: 'VantCustomUploader',

    props: {
        // Uploader的key
        // 用作文件上传成功后做策略判断
        name: {
            type: String,
            default: ''
        }
    },

    computed: {
        iconName() {
            return NAME_ICON_MAP && NAME_ICON_MAP[this.type]
        }
    },

    mixins: [UploadMixin],

    data() {
        return {

        }
    },

    methods: {

    },
}
</script>

<style lang="scss" scoped>
.icon-item {
    font-size: 25px;

    &~& {
        margin-left: 10px;
    }
}
</style>