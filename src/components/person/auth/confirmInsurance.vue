<style lang="less">

</style>
<template>
  <div>
    <p class="insurance-tit">为您的人身安全提供保障</p>
    <div class="insurance-list">
      <p class="insurance-name">
        <i class="checkBoxImg" :class="{selectedAll: isChoose}" @click="selected"></i>
        <span>借款人意外险</span>
      </p>
      <p class="insurance-txt">我同意
        <router-link to="">《投保须知》</router-link>、<router-link to="">《委托扣款授权书》</router-link>
        和<router-link to="">《保险示例条例》</router-link>
      </p>
    </div>
    <div class="sure-btn">
      <span class="btn" v-if="isChoose" @click="submit">确认</span>
      <span class="btn-gray" v-else>确认</span>
    </div>

    <captcha ref="captcha" :is-show="isShowCaptcha" @closeCaptcha="closeCaptcha" @captchaSubmit="submitOrder" :phone-no="phoneNo"></captcha>
  </div>
</template>
<script>
  import Captcha from "../../../components/common/person/Captcha-zhongan.vue";

  export default {
    name: 'app',
    components: {
      Captcha
    },
    data () {
      return {
        phoneNo: getLocalStorage("phoneNo") || getUserInfo("phoneNo"),
        isChoose: false,
        isShowCaptcha: false
      }
    },
    mounted () {
      document.querySelector('body').style.background = '#fff'
    },
    beforeDestroy(){
      document.querySelector('body').style.background = '#f7f7f9'
    },
    methods: {
      selected () {
        const that = this
        that.isChoose = !that.isChoose
      },
      submit () {
        const that = this
        that.isShowCaptcha = true
        that.$refs.captcha.getCaptcha()
      },
      submitOrder () {
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
      closeCaptcha (v) {
        this.isShowCaptcha = v;
      }
    }
  }
</script>
