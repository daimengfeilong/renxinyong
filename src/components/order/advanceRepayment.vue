<template>
  <div class="advance-wrap">
    <div class="adv-container">
      <div class="text-center">
        <h4><span v-if='repayJson.ovduFlag=="1"'>当前</span><span v-else>本期</span>应还款额(元)</h4>
        <i v-if="hasData">本期应还款日 {{repayJson.repayDate | formatDate}}</i>
        <strong>{{repayJson.rcvTotalAmt}}</strong>
      </div>
      <label class="order-point">*提前还款成功后，状态会在T+1日后更新，中途不会产生其他费用；全款还款请联系客服。</label>
    </div>

    <div class="fixed-bottom p10 transverseBtn">
      <div>
        <span class="btn" v-stat="{key:'CokRep', click:'CokRep'}" @click="repayment">确认还款</span>
      </div>
      <div v-if="isWX">
        <span class="cancelRepayBtn" v-stat="{key:'CokRep', click:'CokRep'}" @click="cancelRepayment">取消还款</span>
      </div>
    </div>

    <div v-transfer-dom class="over-wrap">
      <x-dialog v-model="showValidate" hide-on-blur>
        <div class="note-code">
          <i>*验证码已发送至你的银行预留手机号</i>
          <b>{{phoneNo}}</b>
          <label class="text-left">*请输入短信验证码</label>
          <p class="box">
            <input class="flex-1" v-model.trim="sendJson.verfiyCode" type="text"/>
            <!-- <i class="orange-color" v-if="time===0" @click="getCodeAgin">重新获取验证码</i>
            <i class="gray-color" v-else>重新发送({{time}}秒)</i> -->
          </p>
          <span class="btn" @click="sureRepay">确认</span>
        </div>
        <div class="close-btn">
          <img src="../../assets/image/order/PopWindow_Button_Cancel.png" @click="closeValidate"/>
        </div>
      </x-dialog>
    </div>

    <div v-transfer-dom class="over-wrap">
      <x-dialog v-model="showTips" hide-on-blur>
        <div class="note-code">
          <h4>还款提醒</h4>
          <p class="mb15 color-6">请确认下面手机号是否是银行卡预留手机号，如不正确，请自行修改</p>
          <p class="box">
            <input class="flex-1" v-model.trim="phoneNo" type="text" placeholder="请输入银行预留手机号"/>
          </p>
          <span class="btn" @click="sureRepayment">确认还款</span>
        </div>
        <div class="close-btn">
          <img src="../../assets/image/order/PopWindow_Button_Cancel.png" @click="showTips=false"/>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import { TransferDom, XDialog } from 'vux'
  import { checkPhone } from "@/assets/js/utils.js"

  export default{
    filters: {
      formatDate: function (time) {
        if (time.length > 8) {
          time = time.replace(/\-/g, "");
          return time.substring(4, 6) + "月" + time.substring(6, 8) + "日";
        } else {
          return time.substring(4, 6) + "月" + time.substring(6, 8) + "日";
        }
      }
    },
    directives: {
      TransferDom
    },
    components: {
      XDialog
    },
    data(){
      return {
        hasData: false,
        repayList: [], //未还款
        repayJson: {
          "loanNo": "", // 贷款编号
          "rcvTotalAmt": "", // 应还款
          "repayNum": "", // 还款执行期数
          "repayDate": "", // 账单日
          "ovduFlag": ""  // 是否逾期
        },
        sendJson: {
          "loanNo": "",
          "userNo": "",
          "repayNum": "",
          "repayDate": "",
          "transBal": "",
          "repayChennel": "21800011",
          "callSuccUrl": `${window.location.origin}/#/success?showType=repaymentSuc`
        },
        cancelParams: {
          "loanNo": "",
          "repayNum": "",
          "userNo": ""
        },
        wxPayJson: {
          "openId": "",
          "trade_desc": "",
          "transBal": "",
          "loanNo": "",
          "chanNo": "",
          "repayNum": "",
          "userNo": "",
          "backUrl": `${window.location.origin}/#/success`
        },
        overdueFee: "",
        isVerfiyCode: "",
        showValidate: false,
        showTips: false,
        time: 0,
        phoneNo: "",
        isWX: true
      }
    },
    created(){
      let that = this
      that.repayJson.loanNo = that.$route.query.loanNo
      that.wxPayJson.loanNo = that.$route.query.loanNo
      that.getRepay()
      that.phoneNo = getLocalStorage("phoneNo")

      //repayChennel:还款渠道(玖富一键支付 ：21900015 玖富验密支付 : 21900018 第三方代扣：21800011)
      if (that.$route.query.repayChennel) {
        that.sendJson.repayChennel = that.$route.query.repayChennel
      } else {
        that.sendJson.repayChennel = "21800011"
      }

      //使用微信支付方式则隐藏取消还款按钮
      if (that.$route.query.isWX || that.$route.query.JiufuOverdue) {
        that.isWX = false
      }

      if (getLocalStorage("custNo")) {
        that.cancelParams.userNo = getLocalStorage("custNo")
        that.sendJson.userNo = getLocalStorage("custNo")
        that.wxPayJson.userNo = getLocalStorage("custNo")
      } else {
        that.queryBaseInfo()
      }
    },
    mounted(){
    },
    methods: {
      getRepay: function () {
        let that = this
        that.$axios.post(url.getRepayList, {"params": {"loanNo": that.repayJson.loanNo}})
          .then(function (response) {
            if (response.data.code === "0000") {
              for (let i = 0; i < response.data.result.allStatList.length; i++) {
                if (response.data.result.allStatList[i].isHaveRepayed == "13900002") {
                  that.repayList.push(response.data.result.allStatList[i])
                }
              }
              that.repayJson = that.repayList[0]
              that.hasData = true

              that.sendJson.loanNo = that.$route.query.loanNo
              that.sendJson.transBal = that.repayJson.rcvTotalAmt.toString()
              that.wxPayJson.transBal = that.repayJson.rcvTotalAmt.toString()
              if (that.repayJson.repayDate.length > 8) {
                that.sendJson.repayDate = that.repayJson.repayDate.replace(/-/g, "")
              } else {
                that.sendJson.repayDate = that.repayJson.repayDate
              }
              that.sendJson.repayNum = that.repayJson.repayNum.toString()
              that.wxPayJson.repayNum = that.repayJson.repayNum.toString()
              that.wxPayJson.chanNo = response.data.result.chanNo
            } else {
              if (response.data.msg) {
                that.$vux.toast.text(response.data.msg)
              }
            }
          })
          .catch(function (response) {
          })
      },
      checkDate: function () {
        // 检查是否是当前月或者以前还款
        let curr_month = this.getCurrentMonthLast() // 获取当前月的最后一天
        let repayTime = this.sendJson.repayDate
        if (repayTime.length == 8) {
          repayTime = repayTime.substring(0, 4) + "/" + repayTime.substring(4, 6) + "/" + repayTime.substring(6, 8)
        }
//				console.log(this.getTimeStamp(repayTime))
//				console.log(this.getTimeStamp(curr_month))
        //当还款日期大于下月第一天0点0分0秒 则视为提前还款
        if (this.getTimeStamp(repayTime) > this.getTimeStamp(curr_month)) {
          return true
        }
        else {
          return false
        }
      },
      getTimeStamp: function (str) {
        return Date.parse(new Date(str))
      },
      getCurrentMonthLast: function () {
        let date = new Date(),
          currentMonth = date.getMonth(),
          nextMonth = ++currentMonth,
          nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
        return nextMonthFirstDay;
      },
      repayment: function () {
        let that = this

        if (that.checkDate()) {
          that.$vux.toast.text("未到还款时间，暂不支持提前还款")
          return false
        } else {
          //判断是否是玖富资方，是则直接调用代扣，不是则查询是否需要绑卡
          if (that.$route.query.repayChennel) {
            that.sendJiufuCode()   //玖富支付方式
          } else if (that.$route.query.isWX || that.$route.query.JiufuOverdue) {  //微信支付
            that.filterChannel()  //先验证资方是否支持微信支付
          } else {
            that.$axios.post(url.queryBindStatus, {"params": {"loanNo": that.sendJson.loanNo}})
              .then(function (response) {
                if (response.data.code === "0000") {
                  // 查询是否需要绑卡 13900001需要绑卡
                  if (response.data.result.isOnCard === "13900001") {
                    // 未绑卡 或者异常就去绑卡界面 44100001 已绑卡
                    if (response.data.result.code == "44100001") {
                      that.sendCode()
                    } else {
                      that.$router.push({path: '/repayBank', query: {loanNo: that.repayJson.loanNo}})
                      return false
                    }
                  } else {
                    that.sendCode()
                  }

                } else {
                  if (response.data.msg) {
                    that.$vux.toast.text(response.data.msg)
                  }
                }

              })
              .catch(function (response) {
              })

          }
        }
      },
      isGetCode: function () { // 判断是否有验证码
        let that = this
        that.$axios.post(url.isNeedAuthCode, {"params": that.sendJson})
          .then(function (response) {
            if (response.data.code === "0000") {
              // 44100000 调用其他异常 13900001需要输入验证码13900002不需要输入验证码
              that.isVerfiyCode = response.data.result.code
              if (that.isVerfiyCode == "13900001") {
                that.showValidate = true
                return false
              } else {
                that.$router.push({path: `/prodIntrod/${getLocalStorage('channelVal')}`})
              }
//              that.sendCode()
            } else {
              if (response.data.msg) {
                that.$vux.toast.text(response.data.msg)
              }
            }
          })
          .catch(function (response) {
          })
      },
      getCodeAgin(){  // 重新获取验证码
        let that = this
        that.$axios.post(url.isNeedAuthCode, {"params": that.sendJson}).then(function (response) {
          if (response.data.code === "0000") {
            that.isVerfiyCode = response.data.result.code
            if (that.isVerfiyCode === "13900001") {
              that.time = 60
              let interval = window.setInterval(function () {
                if ((that.time--) <= 0) {
                  that.time = 0;
                  window.clearInterval(interval);
                }
              }, 1000)
              return false
            }
          } else {
            if (response.data.msg) {
              that.$vux.toast.text(response.data.msg)
            }
          }
        }).catch(function (response) {

        })
      },
      sendCode(vcode){   //发起其他资方代扣请求
        let that = this
        if (vcode) {
          that.sendJson.verfiyCode = vcode
        }

        that.$axios.post(url.loanwithhold, {"params": that.sendJson})
          .then(function (response) {
            if (response.data.code === "0000") {
              if (response.data.result.code == "31700001") {
                that.isGetCode()
              } else {
                that.$vux.toast.show({
                  text: response.data.result.msg,
                  onHide () {
                    that.$router.push({path: `/prodIntrod/${getLocalStorage('channelVal')}`})
                  }
                })
              }
            } else {
              that.$vux.toast.text(response.data.msg)
            }
          })
          .catch(function (response) {
          })
      },
      sureRepay () {
        const that = this
        if (that.sendJson.verfiyCode) {
          that.sendCode(that.sendJson.verfiyCode)
        } else {
          that.$vux.toast.text("请输入验证码")
          return false
        }
      },
      closeValidate () {
        const that = this
        that.showValidate = false
      },
      sendJiufuCode () {   //发起玖富代扣请求
        let that = this
        if (that.sendJson.repayChennel == "21900015") {
          that.isGetCode()
        } else if (that.sendJson.repayChennel == "21900018") {
          that.showTips = true
        }

      },
      queryBaseInfo () {   //获取用户信息
        let that = this
        that.$axios.post(url.queryBaseInfo, { params: { phoneNo: that.phoneNo } }).then(function (res) {
          let result = res.data
          if (result.code == "0000") {
            localStorage.setItem("custNo", result.result.custNo)
            that.sendJson.userNo = result.result.custNo;
            that.cancelParams.userNo = result.result.custNo;
            that.wxPayJson.userNo = result.result.custNo;
          } else {
            that.$vux.toast.text(result.msg, "top");
          }
        })
      },
      cancelRepayment () {
        let that = this
        that.cancelParams.loanNo = that.sendJson.loanNo
        that.cancelParams.repayNum = that.sendJson.repayNum
        that.$axios.post(url.veriPayCancel, {
          "params": that.cancelParams
        }).then(function (res) {
          let result = res.data
          that.$vux.toast.text(result.msg)
        }).catch()
      },
      sureRepayment () {
        let that = this
        if (!checkPhone(that.phoneNo) || !that.phoneNo) {
          this.$vux.toast.text("请输入有效的手机号码！")
          return false
        }
        that.sendJson.mobileNo = that.phoneNo
        that.$axios.post(url.loanwithhold, {"params": that.sendJson})
          .then(function (response) {
            if (response.data.code === "0000") {
              if (response.data.result.callUrl) {
                window.location.href = response.data.result.callUrl
              } else {
                that.$vux.toast.text(response.data.result.msg)
              }
            } else {
              if (response.data.msg) {
                that.$vux.toast.text(response.data.msg)
              }
            }
          })
          .catch(function (response) {
          })
      },
      filterChannel () {
        let that = this
        that.$axios.post(url.filterChannel, {"params": {"chanNo": that.wxPayJson.chanNo}}).then(function (res) {
          let result = res.data, { code, msg } = result
          if (code == "0000") {
            if (result.result.code == "0000") {
              that.wxRepayment()
            } else {
              that.$vux.toast.text(result.result.msg)
            }
          } else {
            that.$vux.toast.text(msg)
          }
        }).catch()
      },
      wxRepayment () {
        let that = this

        that.wxPayJson.openId = getLocalStorage("openId")
        that.$axios.post(url.wxRepay, {params: that.wxPayJson}).then(function (res) {
          let result = res.data
          if (result.result) {
            that.$vux.toast.text(result.msg)
            setLocalStorage("callbackHtml", result.result)
            window.location.href = `${window.location.origin}/static/callbackHtml/callbackHtml.html`
          } else {
            that.$vux.toast.text(result.msg)
          }
        }).catch()
      }
    }
  }
</script>
