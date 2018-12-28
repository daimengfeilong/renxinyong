<style lang="less">

</style>

<template>
    <div class="box auth-step">
        <div class="flex-1" v-for="item in count" :key="item" :class="{'active':item <= step}">
            <div class="num">{{item}}</div>
            <div class="line"></div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        count: {
            type: Number,
            default: 3
        },
        step: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {};
    },
    mounted() {},
    methods: {}
};
</script>