<style lang="less" scoped>

</style>
<template>
  <div>
    <article class="loanMain2">
      <div>
        <img src="../../assets/image/product/icon_7.png">
        <span>还款方式</span>
        <i>等额本息，分期还款</i>
      </div>
      <div>
        <img src="../../assets/image/product/icon_8.png">
        <span>放款方式</span>
        <i>放款至储蓄卡</i>
      </div>
      <span class="clearfix"></span>
    </article>


    <div class="cluseListContainer2">
      <h1>
        综合月费率≤3%
      </h1>
            <span>
                由利息、咨询服务费、信息服务费、账户费等组成。
            </span>
    </div>

    <div class="cluseListContainer2">
      <h1>
        逾期费用
      </h1>
            <span>
                若逾期30天内，每日逾期滞纳金按剩余未还总额*0.25%收取，若逾期超过30天(包含第30天)每日逾期滞纳金按剩余未还总额度*0.5%收取，另支付10元/笔滞纳金。
            </span>
    </div>


    <div class="cluseListContainer2">
      <h1>
        总还款额
      </h1>
            <span>
                总还款额=本金+利息+综合服务费+逾期费用（若有逾期）。
            </span>
    </div>


    <div class="clauseBtn vipActive" v-stat="{key:'prd', click:'Capl', value: prodNo}" @click="clickApply()">申请产品</div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        prodNo: ""
      }
    },
    created () {
      this.prodNo = this.$route.query.prodNo
    },
    methods: {
      clickApply () {
        const that = this
        setLocalStorage("prodNo", that.prodNo)
        that.$axios.post(url.getLoanNo, {
          "params": {
            "prodNo": that.prodNo
          }
        }).then(function (res) {
          const result = res.data
          if (result.code == "0000") {
            setLocalStorage("loanNo", result.result)
            that.$router.push('face')
          }
        }).catch(function (err) {
          console.log(err.data)
        })
      }
    }
  }
</script>

