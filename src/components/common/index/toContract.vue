<style lang="less">

</style>
<template>
  <div>
    <div class="contract-window">
      <div class="contract-window-cnt">
        <div class="contract-window-list">
          <p class="pt25 fs18">请完成合同签署</p>
          <ul class="pt25 contract-loanList fs14">
            <li v-for="(item, index) in unsignedList" :key="index" :class="{activeItem: index==isActive}" @click="selectLoan(item.loanNo, index)">{{ item.prodName | reStrBracket }}</li>
          </ul>
          <div class="mt30">
            <span class="btn" @click="goOrderDetail">去签约</span>
          </div>
          <p class="fs14 contract-kefu">
            <img src="../../../assets/image/index/kefu_icon.png" alt="">
            <a href="tel:400-668-8000">联系客服</a>
          </p>
        </div>
        <div class="cancelIcon mt30">
          <img src="../../../assets/image/index/icon_cancel.png" @click="cancelContract" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'app',
    data () {
      return {
        unsignedList: [],
        currentLoanNo: "",
        isActive: 0
      }
    },
    created () {
      this.getUnsignedList()
    },
    methods: {
      getUnsignedList () {
        const that = this
        that.$axios.post(url.getUnsignedLoanList, {
          "params": {
            "phoneNo": getLocalStorage("phoneNo")
          }
        }).then(function (res) {
          const result = res.data
          if (result.result.length > 0) {
            that.unsignedList = result.result
            that.currentLoanNo = that.unsignedList[that.unsignedList.length - 1].loanNo
            that.isActive = that.unsignedList.length - 1
          }
        }).catch(function (err) {
          console.log(err.data)
        })
      },
      selectLoan (loanNo, index) {
        const that = this
        that.isActive = index
        that.currentLoanNo = loanNo
      },
      goOrderDetail () {
        const that = this
        that.$router.push({
          name: "orderDetail",
          query: {
            loanNo: that.currentLoanNo
          }
        })
      },
      cancelContract () {
        const that = this
        that.$parent.isContract = false
      }
    }
  }
</script>
