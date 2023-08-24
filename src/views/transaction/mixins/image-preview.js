import { ImagePreview } from 'vant'

export default {
  methods: {
    sceneImg(images, index) {
      ImagePreview({
        images: images, //需要预览的图片 URL 数组
        showIndex: true, //是否显示页码
        loop: false, //是否开启循环播放
        startPosition: index //图片预览起始位置索引
      })
    },
  }
}