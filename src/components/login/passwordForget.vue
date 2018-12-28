<template>
    <div>
        <div class="login-title">
            <img src="./../../assets/image/login/SignUp_Img_TopBg@2x.png" alt="">
        </div>
        <group>
            <x-input v-stat="{key:'pho',blur:'pho',focus:'Cpho'}" name="loginNo" type="tel" placeholder="请输入手机号码" keyboard="number" :max="11" v-model="formData.loginNo" @on-change="loginNoValid"></x-input>
            <x-input v-stat="{key:'graCor',blur:'graCor',focus:'Cgracor'}" placeholder="请输入图形验证码" name="verificationCode" v-if="viewCode" v-model="formData.verificationCode" class="img-code">
                <img v-stat="{key:'CgetGracor',click:'CgetGracor'}" slot="right-full-height" :src="imgSrc" @click="refresh()">
            </x-input>
            <x-input v-stat="{key:'notCod',blur:'notCod',focus:'CnotCod'}" v-if="viewCode" placeholder="请输入手机短信验证码" class="weui-vcode" name="verifyCode" v-model="formData.verifyCode">
                <x-button v-stat="{key:'CgetNotCod',click:'CgetNotCod'}" slot="right" type="default" mini class="send-code"  @click.native="getCode" :disabled="sendDisabled" :text="sendBtn"></x-button>
            </x-input>                
            <x-input v-stat="{key:'newPas',blur:'newPas',focus:'CnewPas'}" name="password" type="password" placeholder="请设置新密码" :min="6" :max="20" v-model="formData.password"></x-input>
            <x-input v-stat="{key:'secPas',blur:'secPas',focus:'CsecPas'}" name="rePassword" type="password" placeholder="请确认新密码" :equal-with="formData.password" :min="6" :max="20" v-model="formData.rePassword"></x-input>
        </group>
        <p class="login-link">
            <span v-stat="{key:'CgetVoiCod',click:'CgetVoiCod'}" v-if="isShowVoice">点击获取 <x-button slot="right" mini class="send-voice-code"  @click.native="getCode('voice')" :disabled="voiceBtnDisabled" :text="sendVoiceBtn"></x-button></span>        
        </p>  
        <div class="login-btn">
            <x-button v-stat="{key:'Csub',click:'Csub'}" @click.native="submit">提交</x-button>
            <p>新用户点击“登录”视为同意<a href='http://apk.boyacx.com/jifen/renxinyong_agreement.html'>《注册协议》</a></p>
        </div>
    </div>
</template>
<script>
import { XInput, Group, XButton} from 'vux'
import { checkPhone, checkPassWord } from "@/assets/js/utils.js"
import {Timer} from "../common/mixin/Timer"
import {GetChannel} from "../common/mixin/GetChannel"
export default {
    data(){
        return {
            formData: { //用户填写的数据
                loginNo: "",
                password: "",
                verifyCode: "",
                verificationCode: "",
                rePassword:"",
            },
            viewCode: false,//是否显示验证码模块
            isShowVoice: false,//是否显示语音验证码模块   
            imgSrc:"",//图形验证码 
            codeType: CODE_TYPE.MSG// 默认短信验证         
        }
    },
    mixins: [Timer], //混入倒计时组件,获取渠道
    components:{
        XInput,
        Group,
        XButton
    },
    created() {
        removeLocalStorage('token');
    }, 
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
                this.formData.verifyCode = "";
                this.formData.verificationCode = "";
            }
        },
        submit() {
            if(!checkPhone(this.formData.loginNo)){
                this.$vux.toast.text("请输入有效的手机号码！")
                return false
            }   
            if(!this.formData.verifyCode){
                this.$vux.toast.text("请输入有效的验证码！")
                return false
            }     
            if(!checkPassWord(this.formData.password)){
                this.$vux.toast.text("密码为6-20位数字字母组合,请输入有效密码！")
                return false
            }   
            if(this.formData.password !== this.formData.rePassword){
                this.$vux.toast.text("密码不一致！")
                return false
            }   
            let that = this;
            that.$axios.post(url.findPsw,{params: that.formData}).then((response) => {
                if (response.data.code == "0000") {
                    that.$vux.toast.show({
                        text: response.data.msg,
                        onHide(){
                            //解决微信路由不刷新
                            window.location.href = `${window.location.origin}/#/loginPassword/${getLocalStorage('channelVal')}`
                        }
                    })
                }else{
                    that.$vux.toast.text(response.data.msg, 'top');
                }
            });  
        }
    }
}
</script>
