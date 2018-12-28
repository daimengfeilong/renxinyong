<style lang="less">

</style>
<template>
  <div>
    <div class="productListContainer">
      <ul>
        <li v-for="item in list" :key="item.id" v-stat="{key:'Cother', click:'Cother'}" @click="checkProduct(item)">
          <div class="product-limit">
            <p>额度</p>
            <p>{{item.minAmt}}~{{item.maxAmt }}</p>
          </div>
          <div class="product-cnt">
            <p>
              <span style="vertical-align: middle;">{{item.prodName | reStrBracket }}</span>
              <img v-stat="{key:'Cdet', click:'Cdet'}" @click.stop="goDetail(item.prodNo)" src="../../assets/image/product/readMore.png" alt="">
            </p>
            <p v-if="item.prodRemark != ''">
              {{item.prodRemark}}
            </p>
          </div>
        </li>
      </ul>
    </div>
    <no-data v-if="noData"></no-data>
  </div>
</template>

<script>
  import noData from '../common/noData.vue'

  export default {
    data() {
      return {
        requestJson: {
          params: {
            sourceOsType: "", //（APP来源）对应值
            phoneNo: "" //手机号）
          }
        },
        list: [],
        noData: false
      };
    },
    components: {
      noData
    },
    created() {
      this.initInfo();
    },
    methods: {
      initInfo() {
        this.requestJson.params.phoneNo = getLocalStorage('phoneNo');
        this.requestJson.params.sourceOsType = getLocalStorage('sourceOsType');
        this.getList();
      },
      getList() {
        let that = this;
        that.$axios.post(url.getProductList, that.requestJson).then(function (response) {
          if (response.data.result.length > 0) {
            that.list = response.data.result;
          } else {
            that.noData = true
          }
        }).catch(function (response) {
          console.log(response.data);
        });
      },
      goDetail(prodNo) {
        this.$router.push({
          path: "/productDetail",
          query: {prodNo: prodNo}
        });
      },
      checkProduct(item) {
        const that = this;
        that.$axios.post(url.getLoanNo, {
          params: {
            prodNo: item.prodNo
          }
        }).then(function (res) {
          const result = res.data;
          if (result.code == "0000") {
            const isAuth = {
              isCredit: that.isNO(item.isCredit),//是否信用卡产品
              isEasyCard: that.isNO(item.isEasyCard),
              isFund: that.isNO(item.isFund),//是否公积金产品
              isOwner: that.isNO(item.isOwner),//是否是车主贷
              isSel: that.isNO(item.isSel),//是否需要选择商品
              isSplitLoan: that.isNO(item.isSplitLoan),
              isVip: that.isNO(item.isVip)//是否办理全机审流程的产品
            }

            setLocalStorage("prodNo", item.prodNo);
            setLocalStorage("loanNo", result.result);
            setLocalStorage('isAuth', JSON.stringify(isAuth))

            //清除认证
            removeLocalStorage('authItems')
            removeLocalStorage('openBankAcctState')
            
            that.$router.push('authentication')
            
          }
        }).catch(function (err) {
          console.log(err.data);
        });
      },
      isNO(val){
        return val == '13900001'
      }
    }
  };
</script>
