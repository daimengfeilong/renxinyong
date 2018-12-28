<style lang="less">

</style>

<template>
  <div id="wrapper">
    <div class="text-center mt50">
      <img style="width:40px" src="@/assets/image/person/reject_icon.png" alt="">
      <p class="mt20 fs18">重置密码失败</p>
    </div>
    <div class="p10 mt70">
      <a class="btn" @click="goTo()">返回上一步</a>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        source: this.$route.query.source
      }
    },
    created () {

    },
    methods: {
      goTo () {
        let that = this
        if (that.source) {
          that.$router.push(that.source)
        } else {
          that.$router.push(`orderDetail?loanNo=${getLocalStorage('loanNo')}`)
        }

      }
    }
  }
</script>
