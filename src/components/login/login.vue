<template>
  <div>
    <div class="login-title">
      <img src="./../../assets/image/login/SignUp_Img_TopBg@2x.png" alt="">
    </div>
    <group>
      <x-input v-stat="{key:'pho',blur:'pho',focus:'Cpho'}" name="loginNo" type="tel" placeholder="请输入手机号码"
               keyboard="number" :max="11" v-model="formData.loginNo"></x-input>
      <x-input v-stat="{key:'pas',blur:'pas',focus:'Cpas'}" name="password" type="password" placeholder="请输入账号密码"
               :min="6" :max="20" v-model="formData.password"></x-input>
    </group>
    <p class="login-link">
      <router-link v-stat="{key:'CfogPas',click:'CfogPas'}" to='/passwordForget'>忘记密码</router-link>
      <router-link v-stat="{key:'CautLog',click:'CautLog'}" :to='`/login/${this.$route.params.channelVal}`'>验证码登录
      </router-link>
    </p>
    <div class="login-btn">
      <x-button v-stat="{key:'Clog',click:'Clog'}" @click.native="submit">登录</x-button>
      <p>新用户点击“登录”视为同意<a href='http://apk.boyacx.com/jifen/renxinyong_agreement.html'>《注册协议》</a></p>
    </div>
  </div>
</template>
<script>
  import { XInput, Group, XButton} from 'vux'
  import { initGlobal, checkPhone, checkPassWord } from "@/assets/js/utils.js"
  import { GetChannel } from "../common/mixin/GetChannel"
  export default {
    data(){
      return {
        formData: { //用户填写的数据
          loginNo: "",
          password: "",
          channelCode: '',
          loginType: LOGIN_TYPE,
          sourceOsType: ''
        }
      }
    },
    mixins: [GetChannel], //混入倒计时组件,获取渠道
    components: {
      XInput,
      Group,
      XButton
    },
    created() {
      removeLocalStorage('token');
    },
    mounted () {

    },
    methods: {
      submit () {
        let that = this;

        if (!checkPhone(this.formData.loginNo)) {
          that.$vux.toast.text("请输入有效的手机号码！")
          return false;
        }
        if (!checkPassWord(this.formData.password)) {
          that.$vux.toast.text("密码为6-20位数字字母组合,请输入有效密码！")
          return false;
        }

        that.formData.channelCode = getLocalStorage('channelCode')
        that.formData.sourceOsType = getLocalStorage('sourceOsType')

        if (!that.formData.sourceOsType) {
          that.$vux.toast.text("系统来源类型有误，请确认网址无误后重新打开", 'top');
          return false;
        }

        that.$axios.post(url.login, {params: that.formData}).then(function (response) {
          if (response.data.code == "0000") {
            setLocalStorage("phoneNo", response.data.params.loginNo);
            setLocalStorage("token", response.headers.authorization);

            //登录初始化
            initGlobal()

            that.$vux.toast.show({
              text: "登录成功!",
              onHide() {
                that.$router.push({path: `/prodIntrod/${getLocalStorage('channelVal')}`})
              }
            });
          } else {
            that.$vux.toast.text(response.data.msg, 'top');
          }
        });
      }
    }
  }
</script>
