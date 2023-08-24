<template>
  <van-uploader :accept="accept" :before-read="beforeRead" :after-read="afterRead">
    <slot>
      <van-button icon="plus" plain size="small" type="primary">上传</van-button>
    </slot>
  </van-uploader>
</template>

<script>
import { Uploader } from 'vant'
import { uploadFile } from '@/api/system/oss';
import { Toast } from 'vant';

const UploaderMixin = {
  components: {
    [Uploader.name]: Uploader,
  },

  props: {
    accept: {
      type: String,
      default: 'image/*'
    }
  },

  data() {
    return {
      isUploading: false,
      list: [],
    }
  },

  methods: {
    beforeRead(file) {
      // TODO:
      // - 是否只能上传一张图片
      let fileType = file.type
      if (
        [
          'image/jpg',
          'image/jpeg',
          'image/png',
          'application/pdf',
          'video/mp4'
        ].indexOf(fileType) === -1
      ) {
        Toast('文件类型只支持jpeg/jpg/png/pdf/mp4');
        return false;
      }
      if (this.isOverSize(file)) {
        Toast('文件大小不能大于100M');
        return false
      }
      return true;
    },

    afterRead(file, detail) {
      Toast('文件上传中...');
      let fd = new window.FormData();
      fd.append('file', file.file, file.name);
      uploadFile(fd)
        .then((res) => {
          Toast.clear();
          this.list.push(res.data);
          this.$emit('upload-success', {
            file: res.data,
            list: this.list
          })
        })
        .catch((err) => {
          Toast('文件上传失败...')
          console.log('error');
          this.$emit('upload-error', err);
        });
    },

    isOverSize(file) {
      // 100M大小
      const maxSize = 100 * 1000 * 1024;
      return file.size >= maxSize;
    },
  }
}

export default {
  name: 'Uploader',

  mixins: [UploaderMixin],

  methods: {
    handleFileRemove(file, fileList) {
      let index = this.list.indexOf(file);
      if (index > -1) {
        this.list.splice(index, 1);
      }
    },
  },
};
</script>
