<style>

</style>
<template>
  <div>
    <p class="serviceCaptcha-tit">请输入手机{{phoneNo}}收到的短信验证码</p>
    <group label-width="6.5em" class="service">
      <x-input title="验证码" v-stat="{key:'autCod',blur:'autCod',focus:'CautCod'}" :max="6" placeholder="请输入验证码"
               v-model="params.user_info.captcha">
        <a slot="right" class="btn-outline disabled bor0" v-if="disabled" v-stat="{key:'Cresen',click:'Cresen'}">重发（<span>{{timeNum}}s）</span></a>
        <a slot="right" class="btn-outline" v-stat="{key:'CgetAutCod',click:'CgetAutCod'}" v-else
           @click="getCaptcha">获取验证码</a>
      </x-input>
    </group>
    <div class="mt70 pt70 pl15 pr15">
      <a class="btn" @click="submit" v-stat="{key:'Clog',click:'Clog'}">授权登录</a>
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
        phoneNo: "",
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
        disabled:false,
        isForget:false,
        timeNum:60,
        isChecked: false
      };
    },
    created () {
      const that = this, localPhoneNo = getLocalStorage('phoneNo')
      that.phoneNo = localPhoneNo.substr(0, 3) + "****" + localPhoneNo.substr(localPhoneNo.length - 4, localPhoneNo.length)
      that.sendCode()
      that.params = JSON.parse(that.$route.query.params)
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
//        let {account,password} = that.params.user_info
//
//        if(!checkPhone(account)){
//          this.$vux.toast.text('手机号码不正确','top')
//          return false;
//        }else if(!password){
//          this.$vux.toast.text('请输入服务密码','top')
//          return false;
//        }else if(!checkCaptcha(password)){
//          this.$vux.toast.text('请输入6-8位数字服务密码','top')
//          return false;
//        }

        that.params.user_info.type = 'RESEND_CAPTCHA'

        that.$axios.post(url.dsjPostData,JSON.stringify(that.params), {emulateJSON: true}).then(res => {
          let code = res.data.err_code
          if(code === 0){
            that.sendCode()
            that.$vux.toast.text('发送验证码成功','top')
          }else{
            that.$vux.toast.text(res.data.err_message,'top')
            switch(code) {
              case 10002 :
                that.sendCode()
                break;
              case  10001 :
                that.sendCode()
                break;
              case 10004 :
                that.sendCode()
                break;
              case 10006 :
                that.sendCode()
                break;
              case 10017 :
                that.sendCode()
                break;
              case 10018 :
                that.sendCode()
                break;
              case 10024 :
                that.sendCode()
                break;
              case 30003 :
                that.sendCode()
                break;
            }
          }
      })

      },
      submit(){
        let that = this
        let {account,password,captcha} = that.params.user_info

        if(!captcha){
          that.$vux.toast.text('请输入短信验证码','top')
          return false;
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
