
<style lang="less">
@import "./less/main.less";
</style>
<template>

    <div id="viewport" class="viewport">

        <!-- main page frame-->
        <router-view></router-view>

        <!-- 尾部-->
        <app-footer></app-footer>

    </div>

</template>

<script>
import "./assets/js/common.js";
import "./assets/js/config.js";
import "./assets/js/url.js";
import store from "./vuex/store.js";
import Footer from "components/common/Footer";

export default {
    components: {
        "app-footer": Footer
    },
    store: store,
    data() {
        return {};
    },
    created() {
        let that = this;

    },
    methods: {}
};
</script>
