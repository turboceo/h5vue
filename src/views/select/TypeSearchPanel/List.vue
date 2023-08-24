<template>
    <ul class="dropdown--list">
        <li class="dropdown--item" v-for="(item, $index) in list" :key="$index" @click="handleItemClick(item, list)">
            <div class="dropdown--item__selection">
                <van-checkbox style="pointer-events: none;" v-model="item.checked"></van-checkbox>
            </div>
            <div class="dropdown--item__info">
                <!-- <p> <svg-icon class="icon" icon-class="car" />{{ item.vehiNo }}</p> -->
                <p><van-icon name="star-o" />{{ item.briefCont }}</p>
                <p><van-icon name="notes-o" /> {{ item.ruleCont }}</p>
                <p><van-icon name="warning-o" /> 是否为6+2:
                    <span class="is--highRank" v-if="item.highRank === 2">
                        是
                    </span>
                    <span class="is--not--highRank" v-else>
                        否
                    </span>
                </p>
            </div>
        </li>
    </ul>
</template>

<script>
import { Checkbox } from 'vant';

export default {
    name: 'CarInfoList',

    props: {
        list: {
            type: Array,
            default() {
                return []
            }
        }
    },

    components: {
        [Checkbox.name]: Checkbox
    },

    methods: {
        handleItemClick(item, list) {
            this.$emit('item-click', {
                item,
                list
            })
        }
    }
}
</script>

<style lang="scss" scoped>
$dropdown-bg: #f7f8fa;

.dropdown--item {
    display: flex;
    padding: 5px 10px;
    background: $dropdown-bg;
    align-items: flex-start;
    color: #323233;
    border-radius: 99px;

    border-radius: 5px;
    margin-bottom: 10px;

    &__selection {
        position: relative;
        top: 10px;
    }

    &__info {
        flex: 1;
        margin-left: 10px;
        font-size: 15px;

        p {
            margin: 0;
            margin-bottom: 4px;
        }

        p:nth-child(1) {
            font-size: 20px;
            font-weight: bold;
        }
    }
}

.is--highRank {
    color: rgb(24, 245, 43);
    font-weight: 600;
}

.is--not--highRank {
    color: #cf8d12;
    font-weight: 600;
}
</style>
  