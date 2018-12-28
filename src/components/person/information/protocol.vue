<style lang="less" scoped>
.fixed-btn{
    background:#3477FF;padding: 15px;
    a{
        color: #fff;font-size: 14px;
    }
}

</style>

<template>
    <div id="wrapper" class="pb70">
        <group v-if="source">
            <cell v-for="(item,index) in contractList" :key="index" :title="item.contrName" :link="item.contrUrl"></cell>
        </group>
        <group v-else>
            <cell v-for="item in contractList" :key="item.id" :title="item.signName" :link="item.signLink"></cell>
        </group>
    </div>
</template>

<script>
import { Cell,Group } from 'vux'

export default {
    data () {
        return {
            contractList:[],
            type:this.$route.query.type || '1',//获取协议类型
            source:this.$route.query.source//订单详情-查看合同
        }
    },
    components:{
        Cell,
        Group
    },
    created(){
        let that = this
        
        if(that.source == 'orderDetail'){
            document.title = '查询合同'
        }
    },
    mounted () {
        let that = this
        
        that.source == 'orderDetail' ? that.querySignedLoanInfo() : that.queryLoanSignInfo()
    },
    methods: {
        queryLoanSignInfo(){
            let that = this

            //获取合同服务协议
            that.$axios.post(url.queryLoanSignInfo,{params: {
                "prodNo":getLocalStorage('prodNo'),
                "signType":that.type
            }}).then(res => {
                that.contractList = res.data.result
            })
        },
        querySignedLoanInfo(){
            let that = this
            
            //获取客户已签约的合同列表
            that.$axios.post(url.querySignedLoanInfo,{params: {
                "loanNo":getLocalStorage('loanNo')
            }}).then(res => {
                that.contractList = res.data.result
            })
        }
    }
}
</script>
