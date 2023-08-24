<template>
  <div class="card-section" :class="{ 'is--disabled': disabled }">
    <div class="card-section--header">{{ title }}</div>
    <div class="card-section--body">
      <slot :disabled="disabled" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',

  props: {
    title: {
      type: String,
      default: '',
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
.card-section {
  &.is--disabled {
    filter: grayscale(0.95);
  }

  & ~ & {
    margin-top: 1.25rem;
  }

  &--header {
    font-size: 1.25rem;
    position: relative;
    padding-left: 1.25rem;
    margin-bottom: 0.625rem;

    &::before {
      position: absolute;
      content: '';
      width: 5px;
      height: 100%;
      background: #0022ff90;
      border-radius: 10px;
      margin-right: 10px;
      left: 0;
      bottom: 0;
    }
  }

  &--label {
    width: 6em;
    color: #888;
    font-weight: 500;
  }
}
</style>
