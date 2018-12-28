<style lang="less">
</style>

<template>
    <router-link :to="link" class="react">
        <div class="apt-item" v-if="isAuth">
            <div class="apt-row box box-items">
                <div class="pic">
                    <img :src="icon" alt="">
                </div>
                <div class="flex-1 ml15">
                    <p class="fs14">{{name}}认证</p>
                    <p class="color-9 mt5" v-if="cardId">{{cardId | toBankNum}}</p>
                </div>
                <div class="state">
                    <i></i>
                    <span class="green">已认证</span>
                </div>
            </div>
        </div>
        <div class="apt-item" v-else>
            <div class="apt-row box box-items">
                <div class="pic">
                    <img :src="icon" alt="">
                </div>
                <div class="flex-1 ml15">
                    <p class="fs14">{{name}}认证</p>
                </div>
                <div class="back">
                    <img src="@/assets/image/person/Prove_Arrow_Right_Gray@2x.png" alt="">
                </div>
            </div>
            <div class="handler box box-items">
                <label class="flex-1">{{tips}}</label>
                <div class="state">
                    <i class="imgGray"></i>
                    <span>未认证</span>
                </div>
            </div>
        </div>
    </router-link>
</template>

<script>
export default {
    props: {
        isAuth: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            default: ""
        },
        name: {
            type: String,
            default: ""
        },
        cardId: {
            type: String,
            default: ""
        },
        tips: {
            type: String,
            default: ""
        },
        link: {
            type: String,
            default: ""
        }
    },
    data() {
        return {};
    },
    filters:{
        toBankNum(v){
            return v ? v.slice(0,4)+ " **** **** "+v.slice(-4) : ''
        }
    },
    mounted() {},
    methods: {}
};
</script>