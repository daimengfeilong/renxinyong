<style lang="less">

</style>

<template>
    <div id="wrapper">
      <p class="serviceCaptcha-tit">请输入手机{{phoneNo}}收到的短信验证码</p>
        <group label-width="6.5em" class="service">
            <!--<x-input title="手机号:" v-stat="{key:'phoNum',blur:'phoNum',focus:'CphoNum'}" :max="11" readonly type="tel" placeholder="请输入手机号" v-model="params.account"></x-input>-->
            <x-input title="验证码" v-stat="{key:'aut',blur:'aut',focus:'Caut'}" :max="6" placeholder="请输入验证码" v-model="params.captcha">
                <a slot="right" class="btn-outline disabled bor0" v-if="disabled">重发（<span>{{timeNum}}</span>s）</a>
                <a slot="right" class="btn-outline" v-stat="{key:'CgetAut',click:'CgetAut'}" v-else @click="getCaptcha">获取验证码</a>
            </x-input>
            <x-input title="新的密码" v-stat="{key:'newPas',blur:'newPas',focus:'CnewPas'}" :max="20" v-model="params.password" placeholder="请输入新密码"></x-input>
            <x-input title="确认密码" v-stat="{key:'verPas',blur:'verPas',focus:'CverPas'}" :max="20" v-model="params.repassword" placeholder="请再次输入密码"></x-input>
        </group>
        <div class="p10 mt70">
            <a class="btn" @click="submit" v-stat="{key:'Csub',click:'Csub'}">下一步</a>
        </div>
    </div>
</template>

<script>
import { XInput, Group, PopupPicker } from "vux";
import { checkPhone,saveAuth } from "../../../assets/js/utils.js"

export default {
    components: {
        XInput,
        Group
    },
    data() {
        return {
          phoneNo: "",
            params : {
                token:getLocalStorage("forgetPwdToken"),
                account:getLocalStorage("phoneNo"),
                type:"", //固定值
                captcha: "",
                password: "",
                repassword:""
            },
            disabled:false,
            timeNum:60,
        };
    },
  created () {
    const that = this, localPhoneNo = getLocalStorage('phoneNo')
    that.phoneNo = localPhoneNo.substr(0, 3) + "****" + localPhoneNo.substr(localPhoneNo.length - 4, localPhoneNo.length)
  },
    mounted() {
        let that = this;
    },
    methods: {
        getCaptcha () {
            let that = this;

            if(!checkPhone(that.params.account)){
                this.$vux.toast.text('手机号码不正确','top')
                return false;
            }

            that.params.type = 'RESEND_RESET_PWD_CAPTCHA'

            that.$axios.post(url.dsjResstPwd,that.params).then(res => {
                if(res.data.success){
                    that.sendCode()
                    that.$vux.toast.text('发送验证码成功','top')
                }else{
                    that.$vux.toast.text(res.data.msg,'top')
                }
            })

        },
        submit(){
            let that = this
            let {account,captcha,password,repassword} = that.params

            if(!checkPhone(account)){
                that.$vux.toast.text('手机号码不正确','top')
                return false;
            }else if(!captcha){
                that.$vux.toast.text('请输入验证码','top')
                return false;
            }else if(!password){
                that.$vux.toast.text('请输入新密码','top')
                return false;
            }else if(!repassword){
                that.$vux.toast.text('请输入确认密码','top')
                return false;
            }else if(repassword != password){
                that.$vux.toast.text('密码不一致','top')
                return false;
            }

            that.params.type = 'SUBMIT_RESET_PWD'

            that.$axios.post(url.dsjResstPwd,that.params).then(res => {
                if(res.data.success){
                    if(res.data.data.reset_success){
                        that.$vux.toast.show({
                            text: "修改密码成功",
                            onHide() {
                                that.$router.push('service')
                            }
                        });
                    }
                }else{
                    that.$vux.toast.text(res.data.msg,'top')
                }

            })
        },
        sendCode () {
            let that = this;

            if (that.timeNum == 0) {
                that.disabled = false;
                that.timeNum = 60;
            } else {
                that.disabled = true;
                that.timeNum--;
                setTimeout(function () {
                    that.sendCode()
                },1000)
            }
        }
    }
};
</script>
