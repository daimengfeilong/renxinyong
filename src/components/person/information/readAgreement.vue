<style lang="less" scoped>
.sub-btn{
    background:#3477FF;padding: 15px;
    a{
        color: #fff;font-size: 14px;
    }
    &.gray{
        background:gray
    }
}

</style>

<template>
    <div id="wrapper" class="pb70">
        <div class="checkbox-list bg-white overhide">
            <div class="item" v-for="(item,index) in contractList" :key="item.id">
                <span @click="itemChose(item)" v-stat="{key:`Cprot${index+1}`,click:`Cprot${index+1}`}">
                    <img src="@/assets/image/person/check_Icon_Chose@2x.png" v-if="item.isChose" alt="">
                    <img src="@/assets/image/person/check_Icon_Default@2x.png" v-else alt="">
                </span>
                <label for=""><a :href="item.signLink" class="bule-link fs14">《{{item.signName}}》</a></label>
            </div>
        </div>
        <div class="fixed-bottom bg-white">
            <div class="box box-items">
                <div class="flex-1 ml15">
                    <span @click="allChoseFn">
                        <img src="@/assets/image/person/check_Icon_Chose@2x.png" style="width:14px;" v-if="allChose" alt="">
                        <img src="@/assets/image/person/check_Icon_Default@2x.png" style="width:14px;" v-else alt="">
                        <label class="middle">全选</label>
                    </span>
                </div>
                <div class="sub-btn" :class="{'gray':!allChose}">
                    <a @click="submit" v-if="allChose" v-stat="{key:'Cagre', click:'Cagre'}">同意协议并确认借款</a>
                    <a v-else>同意协议并确认借款</a>                    
                </div>
            </div>
        </div>
        <captcha :is-show="isShowCaptcha" @closeCaptcha="closeCaptcha" @captchaSubmit="submitOrder"></captcha>
    </div>
</template>

<script>
import Captcha from '../../../components/common/person/Captcha'

export default {
    data () {
        return {
            phoneNo:localStorage.getItem('phoneNo') || getUserInfo('phoneNo'),
            contractList:[],
            allChose:false,
            isShowCaptcha:false
        }
    },
    components:{
        Captcha
    },
    mounted () {
        let that = this
        
        that.queryLoanSignInfo()
    },
    methods: {
        queryLoanSignInfo(){
            let that = this

            //获取合同服务协议
            that.$axios.post(url.queryLoanSignInfo,{params: {
                "prodNo":localStorage.getItem('prodNo')
            }}).then(res => {
                let _data = res.data.result

                _data.map(item => item.isChose = false)

                that.contractList = _data
            })        
        },
        itemChose(item){
            let that = this

            item.isChose = !item.isChose

            that.allChose = that.contractList.every(item => item.isChose)
        },
        allChoseFn(){
            let that = this
            
            that.allChose = !that.allChose
            that.contractList.map(item => item.isChose = that.allChose)
        },
        closeCaptcha(v){
            this.isShowCaptcha = v
        },
        submit(){
            let that = this

            if(!that.allChose){
                that.$vux.toast.text("请确认勾选相关须知和条款协议", "top");
                return false;
            }

            that.isShowCaptcha = true
        },
        submitOrder(){
            let that = this;

            //进件
            that.$axios
                .post(url.submitOrder, {
                    params: {
                        loanNo: getLocalStorage("loanNo"),
                        phoneNo: getLocalStorage("phoneNo"),
                        remark: "无",
                        channelCode: getLocalStorage("channelCode"),
                        invitecode: getLocalStorage("inviteCode") || ""
                    }
                })
                .then(res => {
                    if (res.data.code == "0000") {
                        that.$vux.toast.show({
                            text: "提交订单成功",
                            onHide() {
                                //清除认证项
                                localStorage.removeItem("authItems");
                                //清除开户操作次数
                                localStorage.removeItem("openBankAcctState");

                                that.$router.push("orderSuccess");
                            }
                        });
                    } else {
                        that.$vux.toast.text(res.data.msg, "top");
                    }
                });
        }
    }
}
</script>
