<style lang="less">
</style>

<template>
    <div id="wrapper">
        <p class="serviceCaptcha-tit">请输入手机{{signApplyParams.signPhoneNo}}收到的短信验证码</p>
        <group label-width="6.5em" class="service">
            <x-input title="验证码" :max="6" placeholder="请输入验证码" v-model="signConfirmParams.verifyCode" v-stat="{key:'autCod',blur:'autCod',focus:'CautCod'}">
                <a slot="right" class="btn-outline disabled bor0" v-if="disabledSms" v-stat="{key:'Cresen',click:'Cresen'}">重发（
                    <span>{{timeNumSms}}s）</span>
                </a>
                <a slot="right" class="btn-outline" v-else @click="signApply" v-stat="{key:'CgetAutCod',click:'CgetAutCod'}">获取验证码</a>
            </x-input>
        </group>
        <div class="mt70 pt70 pl15 pr15">
            <a class="btn" @click="signConfirm" v-stat="{key:'CnexSte',click:'CnexSte'}">下一步</a>
        </div>
    </div>
</template>

<script>
import { XInput, Group } from "vux";
import { checkPhone,saveAuth,checkCaptcha } from "@/assets/js/utils.js"

export default {
    components: {
      XInput,
      Group
    },
    data() {
        return {
            params:{},
            authType: AUTH_TYPE.bank,//认证状态码
            disabledSms:false,
            timeNumSms:60,//倒计时时间
            smsTimer:null,//倒计时定时器
            signApplyParams:{//用户签约申请接口参数
                signPhoneNo:getLocalStorage("bankPhoneNo"),
                certNo:getUserInfo("certNo"),
                prodNo:getLocalStorage('prodNo'),
                bankCardNo:""
            },
            signConfirmParams:{//用户签约确认接口参数
                chanNo:"",
                verifyCode:"",
                signTransNo:""
            }
        };
    },
    created(){
        let that = this

        that.params = JSON.parse(that.$route.query.params)
    },
    mounted() {
        let that = this

        that.signApply()
    },
    methods: {
        sendSmsCode () {
            let that = this;

            that.disabledSms = true;

            that.smsTimer = window.setInterval(() => {
                if((that.timeNumSms--) <= 1) {
                    window.clearInterval(that.smsTimer);
                    this.timeNumSms = 60
                    this.disabledSms = false;
                }
            }, 1000)
        },
        signApply(){
            let that = this

            //玖富用户签约申请-验证码
            that.signApplyParams.bankCardNo = that.params.acctNo

            that.$axios.post(url.signApply,{params: that.signApplyParams})
            .then(res => {
                let {code,msg,result} = res.data

                if(code == '0000'){
                    if(result.sts == '000000'){
                        that.$vux.toast.text(result.msg, "top");
                        that.signConfirmParams.chanNo = result.chanNo
                        that.signConfirmParams.signTransNo = result.signTransNo
                        that.sendSmsCode()
                    }else{
                        that.$vux.toast.text(result.msg, "top");
                    }
                }else{
                    that.$vux.toast.text(msg, "top");
                }
            })
        },
        signConfirm(){
            let that = this

            //是否点击获取验证码
            if(!that.signConfirmParams.verifyCode){
                this.$vux.toast.text('请输入短信验证码','top')
                return false;
            }else if(!checkCaptcha(that.signConfirmParams.verifyCode)){
                this.$vux.toast.text('请输入6-8位短信验证码','top')
                return false;
            }

            that.$axios.post(url.signConfirm,{params: that.signConfirmParams})
            .then(res => {
                let {code,msg,result} = res.data

                if(code == '0000'){
                    if(result.sts == '000000'){
//                      if (getLocalStorage("isCheckPolicy") == "13900001") {
//                        that.checkZhongAn()
//                      } else {
                        that.submit()
//                      }
                    }else{
                        that.$vux.toast.text(result.msg, "top");
                    }
                }else{
                    that.$vux.toast.text(msg, "top");
                }
            })

        },
        submit() {
            let that = this;
            let source = getLocalStorage('returnSource')
            let sUrl = url.saveCardInfo

            //订单详情跳转过来的重新绑卡
            if(source){
                that.params.loanNo = getLocalStorage('loanNo')
                that.params.bankType = '42800001'
                sUrl = url.saveSyncInfo
            }

            that.$axios.post(sUrl, {
                params: that.params
            }).then(res => {
                if (res.data.code === "0000") {
                    saveAuth(that.authType,(data) => {
                        that.$vux.toast.show({
                            text: "认证成功",
                            onHide() {
                                setLocalStorage('bankNo',that.params.acctNo)

                                if(source){
                                    that.$router.push(source)
                                }else{
                                    that.$router.push('authentication')
                                }

                            }
                        });
                    });
                }else{
                    that.$vux.toast.text(res.data.msg, "top");
                }
            });
        },
      checkZhongAn () {
        //核保众安保险是否成功
        const that = this
        that.$axios.post(url.zhongAnCheck, {
          params: {
            "loanNo": getLocalStorage("loanNo"),
            "prodNo": getLocalStorage("prodNo")
          }
        }).then(function (res) {
          let result = res.data
          if (result.code == "0000") {
            if (result.result.code == "0000") {
              that.$router.push({
                path: '/confirmInsurance',
                query: {
                  params: JSON.stringify(that.params)
                }
              })
            } else {
              that.$vux.toast.show({
                text: result.result.msg,
                onHide() {
                  that.submit()
                }
              });
            }
          } else {
            that.$vux.toast.text(result.msg, "top");
          }
        })
      }
    }
};
</script>
