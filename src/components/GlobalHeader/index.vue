<template>
  <van-nav-bar
    :title="pageTitle"
    :left-arrow="showLeft"
    :right-arrow="false"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  >
    <template #left>
      <van-icon v-if="showLeft" :name="iconName" size="18" />
    </template>
    <!-- <template #right>
      <van-icon name="ellipsis" size="18" />
    </template> -->
  </van-nav-bar>
</template>

<script>
export default {
  name: "GlobalHeader",

  computed: {
    pageTitle() {
      return this.$store.state.title;
    },

    iconName() {
      return this.$store.state.iconName;
    },

    showLeft() {
      return this.$store.state.showLeft;
    },
  },

  methods: {
    onClickLeft() {
      let { iconName } = this.$route.meta
      if(iconName === 'wap-home') {
        this.$router.push({
          // name: 'home'
          name: 'entry'
        })
      }
    },

    onClickRight() {},
  },
};
</script>

<style lang="scss" scoped>
// .page--header {
//   display: flex;
//   justify-content: space-between;
// }
</style>
