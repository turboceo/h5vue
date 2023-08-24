<template>
  <div class="card-box" :class="{ 'is--shrink': !init, 'is--simple': type === 'simple' }">
    <div class="flex justify-between items-center card-box__header" @click="handleClick">
      <span>{{ title }}</span>
      <template v-if="!$slots.right">
        <van-icon v-if="showToggler" :name="iconName" />
      </template>
      <slot name="right" :show-toggler="showToggler" :icon-name="iconName"></slot>
    </div>
    <slot :init="init" />
  </div>
</template>

<script>
export default {
  name: 'CardBox',

  // 组件级双向数据绑定
  model: {
    prop: 'init',
    event: 'toggle'
  },

  props: {
    type: {
      type: String,
      default: ''
    },

    title: {
      type: String,
      default: ''
    },

    init: {
      type: Boolean,
      default() {
        return true
      }
    },

    showToggler: {
      type: Boolean,
      default() {
        return true
      }
    }
  },

  data() {
    return {
      // init: true
    }
  },

  computed: {
    iconName() {
      return this.init ? 'arrow-down' : 'arrow-up'
    }
  },

  methods: {
    handleClick() {
      this.$emit('toggle', !this.init)
    }
  }
}
</script>

<style lang="scss" scoped>
// $card-bg: #5197df;
$card-bg: #2d8988;

$border-radius: 10px;

.card-box {
  position: relative;
  border-top-left-radius: $border-radius;
  border-top-right-radius: $border-radius;
  background: $card-bg;
  border: 1px solid $card-bg;
  transition: border-radius 0.15s ease-in;

  &.is--simple {
    background: transparent;
    border: 1px solid transparent;
  }

  &.is--shrink {
    border-radius: $border-radius;
  }

  &__header {
    font-size: 20px;
    color: #fff;
    padding: 10px;
    position: relative;

    @at-root .is--simple & {
      color: #151515;
      padding-left: 10px;
      margin-bottom: 10px;
      font-size: 16px;

      &::before {
        position: absolute;
        content: "";
        width: 5px;
        height: 22px;
        top: 50%;
        left: 0;
        bottom: 0;
        transform: translateY(-50%);
        background: #5469f6;
        border-radius: 10px;
        margin-right: 10px;
      }
    }
  }

  &~& {
    margin-top: 15px;
  }
}
</style>
