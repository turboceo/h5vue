/**
 * Upload Mixin
 */
import { uploadFile } from '@/api/system/oss';

let UploadMixin = {
  data() {
    return {};
  },

  methods: {
    beforeUpload(file) {
      let fd = new window.FormData();
      fd.append('file', file, file.name);

      uploadFile(fd).then((res) => {
        this.item.fileList.push({
          name: res.data.fileName,
          url: res.data.url,
        });
      });
      return false; // 返回false不会自动上传
    },
  },
};

export default UploadMixin
