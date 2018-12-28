<template>
  <div id="wrapper">
        <div class="login-title">
            <!-- <h1>{{h1_title}}</h1>
            <h2>{{h2_des}}</h2>     -->
            <img src="./../../assets/image/login/SignUp_Img_TopBg@2x.png" alt="">
        </div>        
        <div v-if="showType === 'login'">            
            <group>
                <x-input v-stat="{key:'pho',blur:'pho',focus:'Cpho'}" name="loginNo" type="tel" ref="loginNo" placeholder="请输入手机号码" keyboard="number" :max="11" required is-type="china-mobile" v-model="formData.loginNo"></x-input>
                <x-input v-stat="{key:'pas',blur:'pas',focus:'Cpas'}" name="password" type="password" ref="password" placeholder="请输入账号密码" required :min="6" :max="20" v-model="formData.password"></x-input>
                <x-input v-if="inviteStat" name="inviteCode" ref="inviteCode" :placeholder="requiredText" :max="6" :required="isRequired" v-model="formData.inviteCode"></x-input>
            </group>
            <p class="login-link">
                <router-link v-stat="{key:'CfogPas',click:'CfogPas'}" to='/passwordForget'>忘记密码</router-link>
                <router-link v-stat="{key:'CautLog',click:'CautLog'}" :to='`/login/${this.$route.params.channelVal}`'>验证码登录</router-link>
            </p>  
        </div>
        <div v-else-if="showType === 'loginCode'">
            <group>
                <x-input v-stat="{key:'pho',blur:'pho',focus:'Cpho'}" name="loginNo" ref="loginNo" placeholder="请输入手机号码" type="tel" keyboard="number" :max="11" required is-type="china-mobile" v-model="formData.loginNo" @on-change="loginNoValid"></x-input>
                <x-input v-stat="{key:'graCor',blur:'graCor',focus:'Cgracor'}" placeholder="请输入图形验证码" name="verificationCode" v-if="viewCode" v-model="formData.verificationCode" class="img-code">
                    <img v-stat="{key:'CgetGracor',click:'CgetGracor'}" slot="right-full-height" :src="imgSrc" @click="refresh()">
                </x-input>
                <x-input v-stat="{key:'notCod',blur:'notCod',focus:'CnotCod'}" v-if="viewCode" placeholder="请输入手机短信验证码" class="weui-vcode" name="identifyCode" required v-model="formData.identifyCode" ref="identifyCode">
                    <x-button v-stat="{key:'CgetNotCod',click:'CgetNotCod'}" slot="right" type="default" mini class="send-code"  @click.native="getCode" :disabled="sendDisabled" :text="sendBtn"></x-button>
                </x-input>
                <x-input v-if="inviteStat" name="inviteCode" ref="inviteCode" :placeholder="requiredText" :required="isRequired" v-model="formData.inviteCode"></x-input>
            </group>
            <p class="login-link">
                <span v-stat="{key:'CgetVoiCod',click:'CgetVoiCod'}" v-if="isShowVoice">点击获取 <x-button slot="right" mini class="send-voice-code"  @click.native="getCode('voice')" :disabled="voiceBtnDisabled" :text="sendVoiceBtn"></x-button></span>        
                <router-link v-stat="{key:'CpasLog',click:'CpasLog'}" :to='`/loginPassword/${this.$route.params.channelVal}`'>密码登录</router-link>
            </p>        
        </div>
        <div v-else-if="showType === 'passwordSet'">
            <group>
                <x-input v-stat="{key:'setPas',blur:'setPas',focus:'CsetPas'}" name="password" type="password" ref="password" placeholder="请设置账号密码" required :min="6"  :max="20" v-model="formData.password"></x-input>
                <x-input v-stat="{key:'cofPas',blur:'cofPas',focus:'CcofPas'}" name="rePassword" type="password" ref="rePassword" placeholder="请确认账号密码" :equal-with="formData.password" :min="6"  :max="20" v-model="formData.rePassword"></x-input>
            </group>
        </div>
        <div v-else-if="showType === 'passwordForget'">
            <group>
                <x-input v-stat="{key:'pho',blur:'pho',focus:'Cpho'}" name="loginNo" ref="loginNo" type="tel" placeholder="请输入手机号码" keyboard="number" :max="11" required is-type="china-mobile" v-model="formData.loginNo" @on-change="loginNoValid"></x-input>
                <x-input v-stat="{key:'graCor',blur:'graCor',focus:'Cgracor'}" placeholder="请输入图形验证码" name="verificationCode" v-if="viewCode" v-model="formData.verificationCode" class="img-code">
                    <img v-stat="{key:'CgetGracor',click:'CgetGracor'}" slot="right-full-height" :src="imgSrc" @click="refresh()">
                </x-input>
                <x-input v-stat="{key:'notCod',blur:'notCod',focus:'CnotCod'}" v-if="viewCode" placeholder="请输入手机短信验证码" class="weui-vcode" name="identifyCode" required v-model="formData.identifyCode" ref="identifyCode">
                    <x-button v-stat="{key:'CgetNotCod',click:'CgetNotCod'}" slot="right" type="default" mini class="send-code"  @click.native="getCode" :disabled="sendDisabled" :text="sendBtn"></x-button>
                </x-input>                
                <x-input v-stat="{key:'newPas',blur:'newPas',focus:'CnewPas'}" name="password" type="password" ref="password" placeholder="请设置新密码" required :min="6"  :max="20" v-model="formData.password"></x-input>
                <x-input v-stat="{key:'secPas',blur:'secPas',focus:'CsecPas'}" name="rePassword" type="password" ref="rePassword" placeholder="请确认新密码" :equal-with="formData.password" :min="6"  :max="20" v-model="formData.rePassword"></x-input>
            </group>
            <p class="login-link">
                <span v-stat="{key:'CgetVoiCod',click:'CgetVoiCod'}" v-if="isShowVoice">点击获取 <x-button slot="right" mini class="send-voice-code"  @click.native="getCode('voice')" :disabled="voiceBtnDisabled" :text="sendVoiceBtn"></x-button></span>        
            </p>  
        </div>    
        <div class="login-btn">
            <x-button v-if="showType === 'login' || showType === 'loginCode'" v-stat="{key:'Clog',click:'Clog'}" @click.native="submit">{{btnTitle}}</x-button>
            <x-button v-else-if="showType === 'passwordSet'" v-stat="{key:'Cnex',click:'Cnex'}" @click.native="submit">{{btnTitle}}</x-button>
            <x-button v-else-if="showType === 'passwordForget'" v-stat="{key:'Csub',click:'Csub'}" @click.native="submit">{{btnTitle}}</x-button>
            <p v-if="isNewUser">新用户点击“登录”视为同意<a href='http://apk.boyacx.com/jifen/renxinyong_agreement.html'>《注册协议》</a></p>
        </div>
  </div>
</template>
<script>
import { XInput, Group, XButton} from 'vux'
import {Timer} from "./mixin/Timer"
import {GetChannel} from "./mixin/GetChannel"
export default {
    data(){
        return{
            h1_title: "极速分期·额度高·到账快",
            h2_des: "最高5万任“信”用",
            isNewUser: true, //判断是否是新注册用户
            viewCode: false,//是否显示验证码模块
            isShowVoice: false,//是否显示语音验证码模块           
            codeType: CODE_TYPE.MSG,// 默认短信验证
            isPwdEqual: true,//两次密码是否相同
            isRequired: true,//是否是必填项
            requiredText: "请输入邀请码",
            formData: { //用户填写的数据
                loginNo: "",
                password: "",
                identifyCode: "",
                verificationCode: "",
                rePassword:"",
                inviteCode:""
            },
            validTotal: false, //是否可以提交
            myErrorsTitle: {
                loginNo: "手机号",
                password: "密码",
                identifyCode: "验证码",
                verificationCode: "图形验证码",
                rePassword: "密码",
                inviteCode:"邀请码"
            },
            imgSrc:"",//图形验证码   
        }
    },
    props:["btnTitle", "showType"],
    components: {
        XInput,
        Group,
        XButton,
    }, 
    created() {
        if(this.showType !== 'passwordSet'){
            removeLocalStorage('token');
        }
        if(this.channelList.channelVal === "rxH5")  {
            this.isRequired = false//如果是任信用，邀请码选填
            this.requiredText = `${this.requiredText}(选填)`
        }
    },  
    mixins: [Timer, GetChannel], //混入倒计时组件,获取渠道
    methods:{        
        getCode(isVoice) { //点击获取验证码   
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
                            this.timer(isVoice)
                        }else{
                            this.timer();
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
        timer(isVoice) { //处理倒计时按钮
            if(isVoice !== 'voice'){ //短信验证码倒计时
               this.codeTimer()
            }else{ //语音验证码倒计时
               this.voiceTimer()
            } 
        },
        loginNoValid(){//验证码登录时检验手机号是否输入正确
            if(this.$refs["loginNo"].valid){
                this.refresh()
                this.viewCode = true
            }else{
                this.viewCode = false;
                this.formData.identifyCode = "";
                this.formData.verificationCode = "";
            }
        },
        refresh() {
            this.imgSrc = `${url.ImgCode}?phoneNo=${this.formData.loginNo}&random_num=${Math.random()}`
        },
        submit() { //点击提交按钮
            let that = this;
            let ref = that.$refs;              
            for (let i of Object.keys(ref)) {
                if(ref[i].valid){ 
                    if(that.showType === 'passwordSet' || that.showType === 'passwordForget') {
                        if(that.formData.rePassword){//判断第二次密码是否输入 
                            that.validTotal = true   
                        }else{
                            that.validTotal = false  
                            that.$vux.toast.text("密码必填哦", 'top');
                        }                                    
                    }else {   
                        if(that.channelList.inviteStatus) {
                            if(that.checkInviteCode()){ //判断邀请码是否符合格式
                                that.validTotal = true   
                            }else{
                                that.validTotal = false   
                            }
                        } else{
                             that.validTotal = true  
                        }

                    }
                }else{
                    that.validTotal = false
                    for(var j in ref[i].errors){
                        let msg = ref[i].errors[j];
                        if(j === 'required'){
                            msg = `${that.myErrorsTitle[i]}${msg}`;
                            that.$vux.toast.text(msg, 'top');
                        }else{
                            that.$vux.toast.text(msg, 'top');
                        }
                        break;                        
                    }
                   
                    break;
                }
            }
            if(that.validTotal) {
                that.$emit('submit',that.formData);
            }
        }
        
    }
}
</script>

<style lang="less">

</style>     