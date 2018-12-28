<style lang="less">

</style>

<template>
    <div id="wrapper">
        <div class="text-center mt50">
            <img style="width:100px" src="@/assets/image/person/order_icon_success.png" alt="">
            <p class="mt20">我们正在快马加鞭处理您的需求，敬请期待~</p>
        </div>
        <div class="p10 mt70">
            <a class="btn" @click="goHome()" v-stat="{key:'Cretu',click:'Cretu'}">返回</a>
            <p class="text-center mt30">
                <a class="bule-link fs16" @click="goYinliu()" v-stat="{key:'CappOthLen',click:'CappOthLen'}">申请其他贷款</a>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    mounted () {

    },
    methods: {
        goHome(){
            let that = this
            
            that.$router.push(`prodIntrod/${getLocalStorage('channelVal')}`)
        },
        goYinliu(){
            window.location.href = `${suc_yinliu_URL}?mobile=${getLocalStorage("phoneNo")}&token=${getLocalStorage("token")}&target=h5`
        }
    }
}
</script>