<!-- eslint-disable prettier/prettier -->
<template>
    <div class="drawer--wrapper" :class="{ 'is--show': show }">
        <slot></slot>
    <!-- <h1>
            <van-icon name="arrow-left" @click="close" />
            {{ title }}
                                                                    </h1> -->
    </div>
</template>

<script>
/* eslint-disable */
export default {
    name: "DrawerSearchIndexView",

    model: {
        prop: 'show',
        event: 'input'
    },

    props: {
        show: {
            type: Boolean,
            default: false
        },

        title: {
            type: String,
            default: ''
        }
    },

    methods: {
        close() {
            this.$emit('input', false);
        }
    }
};
</script>

<style lang="scss" scoped>
.drawer--wrapper {
    position: fixed;
    top: 0;
    left: 0%;
    height: 100vh;
    width: 100%;
    background: #fff;
    transform: translate3d(100%, 0, 0);
    transition: transform .2s ease-in-out;
    z-index: 2;

    &.is--show {
        transform: translate3d(0, 0, 0);
    }
}
</style>
