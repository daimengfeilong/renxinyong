<style lang="less" scoped>

</style>

<template>
    <div v-transfer-dom class="captcha-dialog-wrap">
        <x-dialog v-model="isShow" :dialog-style="{'max-width': '90%','border-radius':'10px', width: '100%', height: '50%', 'background-color': 'transparent'}">
            <group>
                <h4 class="mt10">请输入当前手机短信验证码</h4>
                <x-input name="loginNo" placeholder="请输入手机号码" type="tel" :max="11" v-model="phoneNo" readonly></x-input>
                <x-input placeholder="请输入手机短信验证码" v-stat="{key:'aut',blur:'Caut',focus:'Caut'}" class="weui-vcode" name="identifyCode" v-model="identifyCode">
                    <x-button slot="right" type="default" mini class="send-code" v-if="disabledSms" disabled="disabled"><span>{{timeNumSms}}</span>秒后可重发</x-button>
                    <x-button slot="right" type="default" v-stat="{key:'CgetAut',click:'CgetAut'}" mini class="send-code" v-else @click.native="getCaptcha('sms')">获取验证码</x-button>
                </x-input>
                <div class="p10">
                    <a class="btn" @click="submit" :class="{'overlay':overlay}" v-stat="{key:'Caff',click:'Caff'}">确认</a>
                </div>
            </group>
            <x-icon type="ios-close-outline" @click="closeDialog" style="fill:#fff;margin-top:20px;width:45px;height:45px;"></x-icon>
        </x-dialog>
    </div>
</template>

<script>
import {XInput,XDialog,XButton,Group,TransferDomDirective as TransferDom} from "vux";
import { checkCaptcha,checkPhone } from "@/assets/js/utils.js"

export default {
    directives: {
        TransferDom
    },
    components: {
        XInput,
        XDialog,
        XButton,
        Group
    },
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        phoneNo: {
            type: String,
            default: getLocalStorage('phoneNo') || getUserInfo('phoneNo')
        }
    },
    data() {
        return {
            verificationCode:'',//图形验证码
            identifyCode:'',//短信验证码
            codeType: CODE_TYPE.MSG,// 默认短信验证
            imgSrc:'',//图形验证码图片
            disabledSms:false,//禁用图形验证码
            disabledVoice:false,//禁用语音验证码
            smsTimer:null,//图形验证码定时器
            voiceTimer:null,//语音验证码定时器
            overlay:false,//重复提交
            isVoice:false,//是否显示语音验证码
            timeNumSms:60,//短信验证码倒计时
            timeNumVoice:60//语音验证码倒计时
        };
    },
    mounted() {
//        let that = this;
//        that.refresh()
    },
    methods: {
        refresh() {
            this.imgSrc = `${url.ImgCode}?phoneNo=${this.phoneNo}&random_num=${Math.random()}`
        },
        getCaptcha () {
            let that = this;

            if(!checkPhone(that.phoneNo)){
                this.$vux.toast.text('手机号码不正确','top')
                return false;
            }

            that.$axios.post(url.zhongAnVCode,{params:{
              "loanNo": getLocalStorage("loanNo")
            }}).then((response) => {
                if (response.data.code == "0000") {
                  if (response.data.result.code == "0000") {
                    that.$vux.toast.text("验证码获取成功", 'top');
                    that.sendSmsCode()
                  } else {
                    that.$vux.toast.text(response.data.result.msg, 'top');
                  }
                }else{
//                    this.refresh();
                    this.$vux.toast.text(response.data.msg, 'top');
                }
            });

        },
        sendSmsCode () {
            let that = this;

            that.disabledSms = true;

            that.smsTimer = window.setInterval(() => {
                if((that.timeNumSms--) <= 1) {
                    window.clearInterval(that.smsTimer);
                    that.timeNumSms = 60
                    that.disabledSms = false;
                }
            }, 1000)
        },
        sendVocieCode () {
            let that = this;

            that.disabledVoice = true;

            that.voiceTimer = window.setInterval(() => {
                if((that.timeNumVoice--) <= 1) {
                    window.clearInterval(that.voiceTimer);
                    that.timeNumVoice = 60
                    that.disabledVoice = false;
                }
            }, 1000)
        },
        closeDialog(){
            let that = this

            that.verificationCode = ''
            that.identifyCode = ''
            that.disabledSms = false
            that.disabledVoice = false
            that.isVoice = false
            that.timeNumSms = 60
            that.timeNumVoice = 60

            //清除定时器，vue里面不加window会报错
            window.clearInterval(that.smsTimer)
            window.clearInterval(that.voiceTimer)

            that.$emit("closeCaptcha", false);
        },
        submit() {
            let that = this

            if(!checkPhone(that.phoneNo)){
                this.$vux.toast.text('手机号码不正确','top')
                return false;
            }else if(!that.identifyCode){
                this.$vux.toast.text('请输入短信验证码','top')
                return false;
            }

            that.overlay = true

            //绑卡
            that.$axios.post(url.zhongAnBind,{params:{
                verCode: that.identifyCode,
                loanNo: getLocalStorage('loanNo')
            }}).then(res => {
                if(res.data.code == '0000'){
                    //绑卡完成
                    that.$emit("captchaSubmit");
                }else{
                    that.$vux.toast.text(res.data.msg,'top')
                }
                that.overlay = false
            })
        }
    }
};
</script>
