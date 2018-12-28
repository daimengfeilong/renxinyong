<style lang="less">

</style>

<template>
    <div id="wrapper" class="service-module">
      <div class="service-img">
        <img src="../../../assets/image/person/personImg.png" alt="">
      </div>
        <group label-width="8em" class="service">
            <x-input title="手机号" v-stat="{key:'phoNum',blur:'phoNum',focus:'CphoNum'}" type="tel" readonly :max="11" placeholder="请输入手机号" v-model="params.user_info.account"></x-input>
            <x-input title="手机号服务密码" v-stat="{key:'phoSerPas',blur:'phoSerPas',focus:'CphoSerPas'}" :max="8" placeholder="请输入服务密码" type="password" v-model="params.user_info.password">
              <a slot="right" @click="forget" class="color-9 forgetPwd" v-stat="{key:'CforPas',click:'CforPas'}">忘记密码</a>
            </x-input>
            <!--<x-input title="验证码:" v-stat="{key:'aut',blur:'aut',focus:'Caut'}" :max="6" placeholder="请输入验证码" v-model="params.user_info.captcha" v-if="isCaptcha">-->
                <!--<a slot="right" class="btn-outline disabled bor0" v-if="disabled"><span>{{timeNum}}</span>秒后可重发</a>-->
                <!--<a slot="right" class="btn-outline" v-stat="{key:'CgetAut',click:'CgetAut'}" v-else @click="getCaptcha">获取验证码</a>-->
            <!--</x-input>-->
        </group>
        <!--<p class="p15 text-right">-->
            <!--<a @click="forget" class="color-9" v-stat="{key:'CforPass',click:'CforPass'}">忘记服务密码？</a>-->
        <!--</p>-->
      <p class="p20 check-tr">
        <i class="unChecked" :class="{checked: isChecked}" @click="selected" v-stat="{key:'ChavRea',click:'ChavRea'}"></i>
        <span style="vertical-align: middle;">我已阅读并同意<router-link to="serviceAgreement" class="color" v-stat="{key:'Cproto',click:'Cproto'}">《通话记录授权协议》</router-link></span>
      </p>

        <div class="p10">
            <a class="btn" @click="submit" v-stat="{key:'CnexSte',click:'CnexSte'}">下一步</a>
        </div>
      <div class="p15">
        <p class="color-9 mb5">温馨提示</p>
        <p class="color-9 mb5">1.授权后将收到运营商通知短信，无需回复</p>
        <p class="color-9 mb5">2.服务密码为您的手机号在运营商端获取信息时的凭证</p>
        <p class="color-9 mb5">3.请授权本人手机号</p>
      </div>
    </div>
</template>

<script>
import { XInput, Group, PopupPicker } from "vux";
import { checkPhone,saveAuth,checkCaptcha } from "@/assets/js/utils.js"

export default {
    components: {
        XInput,
        Group
    },
    data() {
        return {
            params: {
                "selected_data": ["jxl_mobile"],
                "user_info": {
                    "user_id": getLocalStorage('loanNo'), //用户唯一标识（必填）
                    "account": getUserInfo('phoneNo'), //电话号码（必填）
                    "password": "",//密码（必填）
                    "id_card_num": getUserInfo('certNo'),//身份证号码（必填）
                    "name": getUserInfo('custName'),//姓名（必填）
                    "type": "",//选填,提交方式
                    "captcha": "",//选填,短信验证码
                    "queryPwd": "" //选填 (北京移动查询密码)
                }
            },
            authType: AUTH_TYPE.service,
            isCaptcha:false,
            disabled:false,
            isForget:false,
            timeNum:60,
          isChecked: false
        };
    },
    mounted() {
        let that = this;
        let {name,id_card_num,account} = that.params.user_info

        //是否支持修改服务密码
        that.$axios.get(url.dsjResstPwd,{params: {
            name:name,
            phone_num:account,
            id_card_num:id_card_num
        }}).then(res => {
            if(res.data.data.reset_method){
                that.isForget = true
                setLocalStorage('forgetPwdToken',res.data.data.token)
            }else{
                that.isForget = false
            }
        })

    },
    methods: {
        forget(){
            let that = this

            if(that.isForget){
                that.$router.push('forgetServicePwd')
            }else{
                that.$vux.toast.text('抱歉，当前运营商暂时不支持修改密码,请自行登录手机营业厅或拨打人工客服自行修改')
            }
        },
        getCaptcha () {
            let that = this;
            let {account,password} = that.params.user_info

            if(!checkPhone(account)){
                this.$vux.toast.text('手机号码不正确','top')
                return false;
            }else if(!password){
                this.$vux.toast.text('请输入服务密码','top')
                return false;
            }else if(!checkCaptcha(password)){
                this.$vux.toast.text('请输入6-8位数字服务密码','top')
                return false;
            }

            that.params.user_info.type = 'RESEND_CAPTCHA'

            that.$axios.post(url.dsjPostData,JSON.stringify(that.params), {emulateJSON: true}).then(res => {
                if(res.data.err_code === 0){
                    that.sendCode()
                    that.$vux.toast.text('发送验证码成功','top')
                }else{
                    that.$vux.toast.text(res.data.err_message,'top')
                }
            })

        },
        submit(){
            let that = this
            let {account,password,captcha} = that.params.user_info

            if(!checkPhone(account)){
                that.$vux.toast.text('手机号码不正确','top')
                return false;
            }else if(!password){
                that.$vux.toast.text('请输入服务密码','top')
                return false;
            }else if(!checkCaptcha(password)){
                this.$vux.toast.text('请输入6-8位数字服务密码','top')
                return false;
            }else if (!that.isChecked) {
              that.$vux.toast.text('请阅读并同意《通话记录授权协议》','top')
              return false
            }

            that.params.user_info.type = 'SUBMIT_CAPTCHA'

            that.$axios.post(url.dsjPostData,JSON.stringify(that.params), {emulateJSON: true}).then(res => {
                let code = res.data.err_code

                if(code === 0){
                    saveAuth(that.authType,(data) => {
                        that.$vux.toast.show({
                            text: "认证成功",
                            onHide() {
                                that.$router.push('authentication')
                            }
                        });
                    });
                }else{
                    that.$vux.toast.text(res.data.err_message,'top')
                }

                switch(code) {
                    case 10002 :
                      that.$router.push({
                        path: '/serviceCaptcha',
                        query: {
                          params: JSON.stringify(that.params)
                        }
                      })
                        break
                    case  10001 :
                      that.$router.push({
                        path: '/serviceCaptcha',
                        query: {
                          params: JSON.stringify(that.params)
                        }
                      })
                        break
                    case 10004 :
                      that.$router.push({
                        path: '/serviceCaptcha',
                        query: {
                          params: JSON.stringify(that.params)
                        }
                      })
                        break
                    case 10006 :
                      that.$router.push({
                        path: '/serviceCaptcha',
                        query: {
                          params: JSON.stringify(that.params)
                        }
                      })
                        break
                    case 10017 :
                      that.$router.push({
                        path: '/serviceCaptcha',
                        query: {
                          params: JSON.stringify(that.params)
                        }
                      })
                        break
                    case 10018 :
                      that.$router.push({
                        path: '/serviceCaptcha',
                        query: {
                          params: JSON.stringify(that.params)
                        }
                      })
                        break
                    case 10024 :
                      that.$router.push({
                        path: '/serviceCaptcha',
                        query: {
                          params: JSON.stringify(that.params)
                        }
                      })
                        break
                    case 30003 :
                      that.$router.push({
                        path: '/serviceCaptcha',
                        query: {
                          params: JSON.stringify(that.params)
                        }
                      })
                        break
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
        },
      selected () {
        const that = this
        that.isChecked = !that.isChecked
      }
    }
};
</script>
