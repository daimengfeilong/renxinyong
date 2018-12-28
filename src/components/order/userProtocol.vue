<style lang="less">
.userProtocol{
  position: fixed;
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div id="wrapper" class="pb70 userProtocol">
    <scroller v-if="contractList.length > 0" :on-infinite="infinite" :on-refresh="refresh" noDataText="没有更多啦！" ref="my_scroller">
      <group>
        <cell v-for="(item,index) in contractList" :key="index" :title="item.name" :link="item.argeeUrl"></cell>
      </group>
    </scroller>
    <!--<group v-if="contractList.length > 0">-->
      <!--<cell v-for="(item,index) in contractList" :key="index" :title="item.name" :link="item.argeeUrl"></cell>-->
    <!--</group>-->
    <no-data v-else></no-data>

    <div class="returnPrev-btn" @click="returnPrev">
      <span>返回上一级</span>
    </div>
  </div>
</template>

<script>
  import { Cell,Group } from 'vux'
  import noData from './../common/noData.vue'

  export default {
    data () {
      return {
        contractList: [],
        rowsList: [],
        params: {
          "loanNo": "",
          "page": "",
          "rows": "15"
        }
      }
    },
    components: {
      Cell,
      Group,
      noData
    },
    created(){
      let that = this
      that.params.loanNo = that.$route.query.loanNo
      that.queryFirst()

    },
    methods: {
      queryUserProtocol (done) {  //获取用户协议列表
        let that = this

        that.params.page = (parseInt(that.params.page) + 1).toString()
        console.log(that.params.page)
        that.$axios.post(url.loanInquiry, {params: that.params}).then(function (res) {
          let result = res.data
          if (result.code == "0000") {
            if (result.result.code == "31700002") {
              if (result.result.data.list.length > 0) {
                that.rowsList = result.result.data.list
                that.contractList = [...that.contractList, ...result.result.data.list]
                
              }
              done()   //继续加载
            } else {
              that.$vux.toast.text(result.result.msg)
              done(true)   //中断加载
            }

          } else {
            that.$vux.toast.text(result.msg)
          }

        })
      },
      queryFirst (done) {  //获取第一页用户协议列表
        let that = this

        that.params.page = "1"
        that.$axios.post(url.loanInquiry, {params: that.params}).then(function (res) {
          let result = res.data
          if (result.code == "0000") {
            if (result.result.code == "31700002") {
              that.contractList = result.result.data.list
            } else {
              that.$vux.toast.text(result.result.msg)
            }

          } else {
            that.$vux.toast.text(result.msg)
          }
          if (done) done(true)
        })
      },
      returnPrev () {
        let that = this
        that.$router.push({
          name: "orderDetail",
          query: {
            loanNo: that.params.loanNo
          }
        })
      },
      refresh (done) {
        let that = this
        that.queryFirst(done)
      },
      infinite(done) {
        let that = this
        that.queryUserProtocol(done)

      }
    }
  }
</script>
