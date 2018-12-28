<template>
    <div>
        <div class="login-title">
            <img src="./../../assets/image/login/SignUp_Img_TopBg@2x.png" alt="">
        </div>
        <group>
            <x-input v-stat="{key:'pho',blur:'pho',focus:'Cpho'}" name="loginNo" placeholder="请输入手机号码" type="tel" keyboard="number" :max="11" v-model="formData.loginNo" @on-change="loginNoValid"></x-input>
            <x-input v-stat="{key:'graCor',blur:'graCor',focus:'Cgracor'}" placeholder="请输入图形验证码" name="verificationCode" v-if="viewCode" v-model="formData.verificationCode" class="img-code">
                <img v-stat="{key:'CgetGracor',click:'CgetGracor'}" slot="right-full-height" :src="imgSrc" @click="refresh()">
            </x-input>
            <x-input v-stat="{key:'notCod',blur:'notCod',focus:'CnotCod'}" v-if="viewCode" placeholder="请输入手机短信验证码" class="weui-vcode" name="identifyCode" v-model="formData.identifyCode">
                <x-button v-stat="{key:'CgetNotCod',click:'CgetNotCod'}" slot="right" type="default" mini class="send-code"  @click.native="getCode" :disabled="sendDisabled" :text="sendBtn"></x-button>
            </x-input>
        </group>
        <p class="login-link">
            <span v-stat="{key:'CgetVoiCod',click:'CgetVoiCod'}" v-if="isShowVoice">点击获取 <x-button slot="right" mini class="send-voice-code"  @click.native="getCode('voice')" :disabled="voiceBtnDisabled" :text="sendVoiceBtn"></x-button></span>
            <router-link v-stat="{key:'CpasLog',click:'CpasLog'}" :to='`/loginPassword/${this.$route.params.channelVal}`'>密码登录</router-link>
        </p>
        <div class="login-btn">
            <x-button v-stat="{key:'Clog',click:'Clog'}" @click.native="submit">登录</x-button>
            <p>新用户点击“登录”视为同意<a href='http://apk.boyacx.com/jifen/renxinyong_agreement.html'>《注册协议》</a></p>
        </div>
    </div>
</template>
<script>
import { XInput, Group, XButton} from 'vux'
import { initGlobal, checkPhone } from "@/assets/js/utils.js"
import {Timer} from "../common/mixin/Timer"
import {GetChannel} from "../common/mixin/GetChannel"
export default {
     data(){
        return {
            formData: { //用户填写的数据
                loginNo: "",
                identifyCode: "",
                verificationCode: "",
                channelCode: '',
                loginType: LOGIN_TYPE,
                sourceOsType: ''
            },
            viewCode: false,//是否显示验证码模块
            isShowVoice: false,//是否显示语音验证码模块
            imgSrc:"",//图形验证码
            codeType: CODE_TYPE.MSG,// 默认短信验证
        }
    },
    created() {
        removeLocalStorage('token');
    },
    mounted(){
        this.formData.channelCode = getLocalStorage('channelCode')
        this.formData.sourceOsType = getLocalStorage('sourceOsType')
    },
    components:{
        XInput,
        Group,
        XButton
    },
    mixins: [Timer, GetChannel], //混入倒计时组件,获取渠道
    methods: {
        /*
        * 点击获取验证码
        */
        getCode(isVoice) {
            if(this.formData.verificationCode) {
                if(isVoice === 'voice' && !this.voiceBtnDisabled){
                    this.codeType = CODE_TYPE.VOICE
                }else{
                    this.codeType = CODE_TYPE.MSG
                }
                let data = {
                    phone: this.formData.loginNo,
                    sourceOsType: "30500005",
                    verificationCode: this.formData.verificationCode,
                    isVoice: this.codeType
                }
                this.$axios.post(url.sendSms,{params:data}).then((response) => {
                    if (response.data.code == "0000") {
                        this.$vux.toast.text("验证码获取成功", 'top');
                        if(isVoice === 'voice'){
                            this.timer(this.voice)
                        }else{
                            this.timer(this.msg);
                            setTimeout(()=>{
                                this.isShowVoice = true
                            },15000)  //点击获取验证码15秒之后出现语音验证码
                        }
                    }else{
                        this.refresh();
                        this.$vux.toast.text(response.data.msg, 'top');
                    }
                });
            }else{
                this.refresh();
                this.$vux.toast.text("图形验证码不能为空", 'top');
            }
        },
        /*
        * 刷新图形验证码
        */
        refresh() {
            this.imgSrc = `${url.ImgCode}?phoneNo=${this.formData.loginNo}&random_num=${Math.random()}`
        },
        /*
        * 验证码登录时检验手机号是否输入正确
        */
        loginNoValid(){
            if(checkPhone(this.formData.loginNo)){
                this.refresh()
                this.viewCode = true
            }else{
                this.viewCode = false;
                this.formData.identifyCode = "";
                this.formData.verificationCode = "";
            }
        },
        submit() {
            if(!checkPhone(this.formData.loginNo)){
                this.$vux.toast.text("请输入有效的手机号码！")
                return false
            }
            if(!this.formData.identifyCode){
                this.$vux.toast.text("请输入有效的验证码！")
                return false
            }
            let that = this;
            that.$axios.post(url.loginCode,{params: that.formData}).then((response) => {
                if (response.data.code == "0000") {
                    let message = (response.data.result.isHaveRegist === LOGINED) ? "登录成功!" : "恭喜你，注册成功!"

                    setLocalStorage("phoneNo", that.formData.loginNo);
                    setLocalStorage("code", response.data.result.identifyCode); //首次注册的密码默认是验证码
                    setLocalStorage("token", response.headers.authorization);

                    //登录初始化
                    initGlobal()

                    that.$vux.toast.show({
                        text: message,
                        onHide(){//已经注册 直接进入home 否则 进入设置密码页面
                            if(response.data.result.isHaveRegist === LOGINED)
                            {
                                that.$router.push({path:`/prodIntrod/${getLocalStorage('channelVal')}`})
                            }
                            else
                            {
                                that.$router.push({"path": "/passwordSet"})
                            }
                        }
                    });
                }else{
                    that.$vux.toast.text(response.data.msg, 'top');
                }
            });
        }
    }
}
</script>
