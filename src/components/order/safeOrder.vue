<template>
  <div class="safe-wrap">
    <div class="safe-container">
      <p class="box" @click="productView=true" v-stat="{key:'ClooIns', click:'ClooIns'}">
        <span class="flex-1">
          个人{{product.insuranceName}}
          <!--<img src="../../assets/image/order/Insurance_Icon_Explain.png" v-stat="{key:'ClooInsDet', click:'ClooInsDet'}" @click.stop.self="safeInfoView=true"/>-->
        </span>
        <span>¥ {{product.unitPremium}}元/份</span>
      </p>
      <div class="protocolList">
        <ul>
          <li v-for="(item,index) in safeInfoList" @click="checkDetail(index)" :key="index">
            <i class="checkBoxImg" @click.stop.self="checkOne(index)" :class="{selectedAll: isSelectArr[index].status}"></i>
            <span>{{ item.desc }}</span>
            <img class="arrowRight" src="../../assets/image/person/Prove_Arrow_Right_Gray@2x.png"/>
          </li>
        </ul>
      </div>
      <p>
        <!--<i><img src="../../assets/image/order/Insurance_Icon_Chose.png"/></i>-->
        <span>{{trueName}}</span>
        <!--<span>{{trueName.custName}}</span>-->
      </p>
      <div class="order-btn">
        <template v-if="!activeState">
          <div class="order-btn-cnt">
            <div class="btn-checkAll">
              <i class="checkAllImg" @click="checkAll(isSelectAll)" :class="{selectedAll: isSelectAll}"></i>
              <span>全选</span>
            </div>
            <div class="submitBtn text-center">
              <span class="btn" @click="buySafe" v-if="isSelectAll" v-stat="{key:'CbuyIns', click:'CbuyIns'}">提交订单</span>
              <span class="btn-disabled" v-else>提交订单</span>
            </div>
          </div>
        </template>
        <template v-else>
          <router-link class="backLastPage" :to="{path: 'orderDetail', query: {loanNo: loanNo}}"
                       v-stat="{key:'CretUp', click:'CretUp'}">
            返回上一页
          </router-link>
        </template>
      </div>

      <group>
        <popup-picker :show.sync='productView' :show-cell="false" :data='productList.value'></popup-picker>
      </group>
      <!--<div v-transfer-dom>-->
      <!--<popup v-model="safeInfoView" position="bottom" max-height="50%">-->
      <!--<ul class="safeInfoList right-point">-->
      <!--<li class="box" v-for="(item,index) in safeInfoList" @click="checkDetail(index)" :key="index">-->
      <!--<span class="flex-1">{{item.desc}}</span>-->
      <!--</li>-->
      <!--</ul>-->
      <!--<div style="padding: 15px;">-->
      <!--<span class="btn" @click="safeInfoView = false">确 定</span>-->
      <!--</div>-->
      <!--</popup>-->
      <!--</div>-->
      <div v-transfer-dom class="over-wrap">
        <x-dialog v-model="isActive" hide-on-blur>
          <div class="note-code">
            <h4>{{insurance.title}}</h4>
            <p class="text-left" v-html="insurance.msg"></p>
          </div>
          <div class="close-btn">
            <img src="../../assets/image/order/PopWindow_Button_Cancel.png" @click="isActive=false"/>
          </div>
        </x-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'underscore'
  import { TransferDom, Popup, XDialog, Group, PopupPicker } from 'vux'

  export default {
    directives: {
      TransferDom
    },
    components: {
      Popup,
      XDialog,
      Group,
      PopupPicker
    },
    data(){
      return {
        isActive: false, // 显示保险说明的标识
        activeState: false, // 成功投保的开关
        btnState: false, // 按钮校验开关
        isSelectArr: [], // 选中状态集合
        loanNo: "",
        sendJson1: {
          "loanNo": "", // 贷款编号
          "insuranceType": "TRAFFIC_ACCIDENT" // 险种类型,TRAFFIC_ACCIDENT-交通意外险，ACCOUNT_SECURITY-账户安全险
        },
        sendJson2: {
          "loanNo": "", // 贷款编号
          "buyCount": "", // 购买份数
          "productNo": "", // 产品编号
          "bookingKey": "" // 产品推荐流水号
        },
        product: {
          insuranceName: "", // 保单产品名称
          unitPremium: ""  // 价格
        },
        trueName: "",
        insurance: {
          title: "", // 显示保险说明的标题
          msg: "" // 保险说明
        },
        productList: {
          list: [],
          value: []
        },
        safeInfoList: [],
        productView: false,
        safeInfoView: false
      }
    },
    created(){
      let that = this
      that.loanNo = that.$route.query.loanNo
      that.sendJson1.loanNo = that.loanNo
      that.sendJson2.loanNo = that.loanNo
//          that.trueName = JSON.parse(getLocalStorage("userBaseInfo"))
      that.trueName = getUserInfo("custName")
      that.checkIsBuy()
    },
    mounted(){

    },
    computed: {
      isSelectAll () {
        const that = this
        let arrLength = that.isSelectArr.length, status = true
        for (var i=0; i<arrLength; i++) {
          if (!that.isSelectArr[i].status) {
            status = false
          }
        }
        return status
      }
    },
    methods: {
      checkIsBuy: function () {
        let that = this
        that.$axios.post(url.insudetail, {"loanNo": that.loanNo}).then(response => {
          if (response.data.data){
            response.data.data = "000"
            if (response.data.data.orderStatus === "13900001") {
              that.$vux.toast.text("已经投保成功")
              that.activeState = true
              return false
            }
            // 拉取承保列表
            that.getLoanDetail()
          }else{
            // 拉取承保列表
            that.getLoanDetail()
            // if(response.data.message){
            // 	that.$vux.toast.text(response.data.message)
            // }
          }
        }).catch(err => {})
      },
      getLoanDetail: function () {
        let that = this;
        that.$axios.post(url.recommend, that.sendJson1).then(response => {
          if(response.data.code === "SUCCESS"){
            that.btnState = true
            that.productList.list = response.data.data.productList
            that.product.insuranceName = that.productList.list[0].insuranceName
            that.product.unitPremium = that.productList.list[0].unitPremium * that.productList.list[0].quantity
            that.productList.value = [_.pluck(that.productList.list, 'insuranceName')]
            that.safeInfoList = that.productList.list[0].detailItems

            let arr=[], safeInfoListLen = that.safeInfoList.length
            for (var i=0; i<safeInfoListLen; i++) {
              arr.push({status: false})
            }
            that.isSelectArr = arr

            that.sendJson2.bookingKey = response.data.data.bookingKey
            that.sendJson2.buyCount = that.productList.list[0].quantity.toString()
            that.sendJson2.productNo = that.productList.list[0].productNo
          }else{
            if (response.data.message) {
              that.$vux.toast.text(response.data.message)
            }
          }
        }).catch(response => {})
      },
      checkDetail(index) {
        let that = this
//        if (index != "0") {
          window.location.href = that.safeInfoList[index].value
//        } else {
//          that.insurance.title = that.safeInfoList[0].desc
//          that.insurance.msg = that.safeInfoList[0].value.replace(/\n|\r\n/g, "<br/>")
//          that.isActive = true
//        }
      },
//          productChange (val) {
//          	console.log(val)
//          	let that = this
//              if(typeof val !== "undefined") {
//                  let obj = _.findWhere(that.productList.list,{"insuranceName": val})
//                  that.product.insuranceName = obj.insuranceName
//                  that.product.unitPremium = obj.unitPremium * obj.quantity
//                  that.safeInfoList = _.pluck( obj.detailItems,'desc')
//                  that.sendJson2.buyCount = obj.quantity + ""
//                  that.sendJson2.productNo = obj.productNo
//              }
//          },
      buySafe: function () {
        let that = this
        that.$axios.post(url.insurecheck, that.sendJson2).then(response => {
          if(response.data.code === "SUCCESS"){
            if (response.data.message) {
              that.$vux.toast.text(response.data.message)
            }
            window.location.href = response.data.data.payUrl
            //window.location.href = "https://quickpay.fingard.cn/Receiver/Receive?ReqXml=zHY7oS7HXvm5klayDaETIomvnynlhR74B4Ic3181KO4zVp76%2FguqaGwD%2FrZUIdM%2B%2BN6biQS0TCo8v4EfP1K6sHZgpTtH2fVp2S%2BDe1nLCnAW9EfI7ggpupW1EELhOZ9M758RKNlnawT1MitFrhbHKRQP25k7u%2FJYO6i1O8G4Ne0Eovsyy2hWbYxgDQbM4y7RabywnrVJ4oxl7nM60nEGsbeOM7ywtVI2M0W62Osy5%2B4lq9ZmwEY2906BmFjIha1oJVVdJ8j9usMsLdUMdsg3o23dHPYfcktRShgMhdZvqtV6znjIBDEZqj95g0W%2B7zOVr1aZPXp5W3SnTMw4ULz4LT%2BtMTFjDxasIkobsnHpGDavHdMHjLhq1HoEsDSsS053GlZgX6JjovqFDhgZBlbUIfsBd75vSwY6y9brCDDu4lkafxHoluPP3XRECcVnF2vAc7JUz91FwmoBC%2BV96zYbjIXHmJG3zKLF%2Fng7joOFn%2B321tP6U9QbP03kCUmELzAjww09xJPDwk1vuBn3yGCoIm%2Fi0XmmjX7F5NELKAPz7D3lJstrhQzzR4HBK%2FhHJxnuEqKGSjoBYDWc5Y1Azmla%2BdGVIjK2h%2FK23j6rcj%2B2f4oQLiVIi1VLFIHjOzhW6lqonbEiexQY80P5MZJUXlHZuaB7ObtgL8vimRD1H%2B7kIUB3%2Fjq%2BOfP9LWN8P2GG7H7m6WDLt9ZbskSQhd23VFpYfy2en7BGE9TA2YIqm%2FBbTXGv1QzlbxVLK6VTN0kETks8HzRGaxZtJVPajjXGeykzaoO4f93i7zKDrgRmQQ9wQOHsG2XCnfJePYsHlgxlBWOdlqtc1bauJbx2sFKJmC4%2Bg0yt1MgGOzKva%2FX9D8k%2F8sTSzclP1zpBw0lOjumoToZtp8J%2BjgLVjiHONhmvzYkdFAzyXMaFb0aDB4zCOX912SLs1YhiYIukqvSSa98hlv4gfdcU2U6zve3stdMjA79niklIKGcmHtRoHniJwgKAkTYf64YFG6hh9%2BTb92whtTU6yjieCqUd56KFFNi9gghyFYTE54hwKVuhLVld7gsOFL8Tf%2F8dOIxHgMAlu6kzOB6XNnae4jLcCNNHo79ZgJIVKOLJdYQkK%2FjBFifKIPddfzXXZgeZkbI2gLH5VBanYWxwa52Ryg4Jj9EJWNG85K5SxRuWVaKEzCwvDItRYMbRKcIlE1zplVHZ2Jx%2FugFxyX2I9zs3UNCVBRtPqOcow72j2w%3D%3D"
          }else{
            if (response.data.message) {
              that.$vux.toast.text(response.data.message)
            }
          }
        }).catch(response => {})
      },
      checkOne (index) {
        const that = this
        that.isSelectArr[index].status = !that.isSelectArr[index].status
      },
      checkAll (status) {
        const that = this
        let arrLength = that.isSelectArr.length
        for (var i=0; i<arrLength; i++) {
          that.isSelectArr[i].status = !status
        }
      }
    }
  }
</script>
