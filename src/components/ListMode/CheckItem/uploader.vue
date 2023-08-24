<template>
    <van-uploader class="icon-item" :before-read="beforeRead" :after-read="afterRead">
        <van-icon :name="iconName" />
    </van-uploader>
</template>

<script>
import { uploadFile } from "@/api/system/oss";
import { delOss } from "@/api/system/oss";

import { Uploader, Toast } from 'vant';

let UploadMixin = {
    components: {
        Uploader,
        Toast
    },

    methods: {
        beforeRead(file) {
            console.log('Log type: ', this.type)
            if (file.type === "image/jpeg" || file.type === "image/png") {
                return true;
            }
            this.$toast("请上传 jpg/png 格式的图片");
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
                this.$emit('upload-success', ossResponseData)
            } catch (err) {
                console.log(`文件上传失败`)
                console.log(err);
                this.$toast(err);
            }
        },

        handleFileItemRemove(item, $index) {
            this.$toast("正在删除...");
            let ossId = item.ossId;
            this.form.fileList.splice($index, 1);
            // item.fileList.splice($index, 1);
            delOss(ossId).then((res) => {
                if (res.code === 200) {
                    this.$toast("删除成功");
                    return;
                }
                this.$toast("删除失败");
            });
        },

        handleIconItemClicked(type) {
            debugger
            console.log("log type:");
            console.log(type);
        },
    },
};

const NAME_ICON_MAP = {
    photo: 'photo',
    video: 'video',
    file: 'column',
}

export default {
    name: 'VantCustomUploader',

    props: {
        // 上传类型
        type: {
            type: String,
            default() {
                return ''
            }
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