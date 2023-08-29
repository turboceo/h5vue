<template>
  <div id="app">
    <transition :name="transitionName">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view class="router"></router-view>
      </keep-alive>
      <router-view class="router" v-else></router-view>
    </transition>
  </div>
</template>

<script>
import defaultSetting from './settings'
export default {
  name: 'app',
  computed: {
    transitionName () {
      if (defaultSetting.needPageTrans) {
        return this.$store.state.direction
      }
      return ''
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  position: relative;
}

.router {
  max-width: 750px;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  position: absolute;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  // background-color: #fff;
}
</style>

<style lang="scss">
$default-gap: 15px;

.p-15 {
  padding: 15px;
}

.py-10 {
  padding-top: 10px;
  padding-bottom: 10px;
}

.pl-15 {
  padding-left: 15px;
}

.pr-15 {
  padding-right: 15px;
}

.my-10 {
  margin-top: 10px;
  margin-bottom: 10px;
}

.mb-15 {
  margin-bottom: 15px;
}

.fixed--bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

.flex {
  display: flex;

}

.column {
  flex-direction: column;
}

.justify-between {
  justify-content: space-between;
}

.justify-center {
  justify-content: center;
}

.align-items,
.items-center {
  align-items: center;
}

.overflow-x-auto {
  overflow-x: auto;
}

.space-between {
  justify-content: space-between;
}

.bg--card {
  // background: #e8e8e8;
  background: #f5f5f5;
}

.bg--white {
  background: #fff;
}

.bg--gray {
  background: #d5d5d5;
}

// Zindex
.z-2 {
  z-index: 2
}

.card-box--content {
  &.is--loading {
    background: #fff;
    min-height: 205px;
  }
}

.field--border {
  border: 1px solid #15151540;
}
</style>
