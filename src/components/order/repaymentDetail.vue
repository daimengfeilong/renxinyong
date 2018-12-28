<template>
    <div>
        <!--<div class="repay-tab box text-center">
            <div class="flex-1 active">现金分期</div>
            <div class="flex-1">保险分期</div>
        </div>-->
        <div class="repay-container has-padding" v-if="hasData">
            <div :class="objectClass">
                <h4 class="order-tit box" v-if="isMainLoanNo!='13900002'">
                    <i class="left"></i>
                    <i class="right"></i>
                    <b class="flex-1">借款 ¥{{repayData.loanAmt}}</b>
                    <span>{{repayData.applyDate | formatDate}}</span>
                </h4>
                <div>
                    <span
                        class="text-center"
                        v-if="repayList.length"
                    >{{repayList[0].repayDate | formatDate1}}第{{repayList[0].repayNum}}期应还</span>

                    <strong
                        class="text-center"
                        v-stat="{key:'eveStaMon', click:'CeveStaMon', value: repayList[0].rcvTotalAmt}"
                        v-if="repayList.length"
                    >¥ {{repayList[0].rcvTotalAmt}}</strong>
                    <strong class="text-center" v-else>已结清</strong>
                    <i v-if="repayList.length">第{{repayList[0].repayNum}}期，待还款</i>
                    <p>
                        <!--<i></i>
                        <span class="line"></span>-->
                        <range
                            :min="1"
                            :max="repayData.allInstNum"
                            v-model="dataGo"
                            :range-bar-height="4"
                            disabled
                            style="margin-left: 0;margin-right: 0;"
                        ></range>
                        <span class="box">
                            <i class="flex-1">第1期</i>
                            <i
                                v-stat="{key:'sumSta', click:'CsumSta', value: repayData.allInstNum}"
                            >第{{repayData.allInstNum}}期</i>
                        </span>
                    </p>
                </div>
            </div>
            <div :class="objectClass">
                <p class="parse">
                    <span class="box">
                        <i
                            class="flex-1"
                            v-stat="{key:'nowSta', click:'CnowSta', value: repayData.totalHaveRepayedInstNum}"
                        >已还{{repayData.totalHaveRepayedInstNum}}期</i>
                        <i>￥{{repayData.totalHaveRepayedAmt}}</i>
                    </span>
                </p>
                <p class="parse">
                    <span class="box">
                        <i class="flex-1">剩余{{repayData.totalWillRepayInstNum}}期</i>
                        <i>￥{{repayData.totalWillRepayAmt}}</i>
                    </span>
                </p>
                <ul>
                    <li class="box" v-for="(item,index) in repayData.allStatList" :key="index">
                        <span
                            class="flex-1 over-repay"
                            v-if="item.ovduFlag == '1'"
                        >{{item.repayDate | formatDate1}}&nbsp;&nbsp;(第{{item.repayNum}}期)</span>
                        <span
                            class="flex-1"
                            v-else
                        >{{item.repayDate | formatDate1}}&nbsp;&nbsp;(第{{item.repayNum}}期)</span>
                        <span class="over-repay" v-if="item.ovduFlag == '1'">
                            <i>{{item.remark}}</i>
                            &nbsp;&nbsp;¥{{item.rcvTotalAmt}}
                        </span>
                        <span v-else>
                            <i>{{item.remark}}</i>
                            &nbsp;&nbsp;¥{{item.rcvTotalAmt}}
                        </span>
                    </li>
                </ul>
                <p
                    class="pb15 pl15 pr15"
                    v-if="serviceLoanInfo && compMoneyCost"
                >本次贷款含：网贷信息技术服务费：{{ serviceLoanInfo }}元 &nbsp;&nbsp;&nbsp;&nbsp;综合资金成本（年化）：{{ compMoneyCost }}</p>
            </div>

            <div
                class="repay-btn"
                v-if="repayList.length && repayData.afterStat !== '17700004' && repayData.afterStat !== '17700005'"
            >
                <span
                    class="btn"
                    v-stat="{key:'Cr1ovRep', click:'Cr1ovRep'}"
                    @click="toRepay(1)"
                    v-if="repayList[0].ovduFlag == '1'"
                >逾期还款</span>
                <span
                    class="btn"
                    v-stat="{key:'Cr2aheRep', click:'Cr2aheRep'}"
                    @click="toRepay(0)"
                    v-else
                >还款</span>
                <router-link class="btn mt15" to="saveAccountInfo?source=repay" v-if="repayData.chanNo == '045'">更改还款账户</router-link>
            </div>
        </div>


        <x-dialog v-model="isShow" class="dialog-demo" hide-on-blur>
            <div class="dialog-cnt">
                <div class="cnt-box fs14">
                    <p class="cnt-list-tit pt10 pb10 pl15">
                        <span>选择还款方式</span>
                        <x-icon
                            style="float: right;margin-top: -6px;"
                            class="mr5"
                            type="ios-close-outline"
                            size="30"
                            @click="isShow=false"
                        ></x-icon>
                    </p>
                    <div class="pb15">
                        <div class="cnt-list">
                            <p class="fs16 pt10 pb10">
                                <span class="payBtn" @click="payWay(1)">支付通道一</span>
                            </p>
                            <p class="color-6 mb20">通过短信验证码支付</p>
                        </div>
                        <div class="cnt-list">
                            <p class="fs16 pt10 pb10">
                                <span class="payBtn" @click="payWay(2)">支付通道二</span>
                            </p>
                            <p class="color-6">到第三方页面通过账号密码支付</p>
                        </div>
                    </div>
                </div>
            </div>
        </x-dialog>
        <x-dialog v-model="isShowWX" class="dialog-demo" hide-on-blur>
        <div class="dialog-cnt">
          <div class="cnt-box fs14">
            <p class="cnt-list-tit pt10 pb10 pl15">
              <span>选择还款方式</span>
              <x-icon
                style="float: right;margin-top: -6px;"
                class="mr5"
                type="ios-close-outline"
                size="30"
                @click="isShowWX=false"
              ></x-icon>
            </p>
            <div class="pb15">
              <div class="cnt-list">
                <p class="fs16 pt10 pb10">
                  <span class="payBtn" @click="payWay(3)" style="width: 98px;position: relative;">
                    微信支付
                    <img src="../../assets/image/order/recommend_icon.png" class="recommend-icon" alt="">
                  </span>
                </p>
                <p class="color-6 mb20">到微信页面进行支付</p>
              </div>
              <div class="cnt-list">
                <p class="fs16 pt10 pb10">
                  <span class="payBtn" @click="payWay(4)">第三方授权支付</span>
                </p>
                <p class="color-6">到第三方页面授权支付</p>
              </div>
            </div>
          </div>
        </div>
      </x-dialog>
    </div>
</template>

<script>
import { formatDate } from "../../assets/js/date.js";
import { Range, XDialog, Group, Cell } from "vux";
export default {
    filters: {
        formatDate(time) {
            var date = new Date(time);
            return formatDate(date, "yyyy/MM/dd");
        },
        formatDate1: function(time) {
            if (time.length > 8) {
                return time.replace(/\-/g, "/");
            } else {
                return (
                    time.substring(0, 4) +
                    "/" +
                    time.substring(4, 6) +
                    "/" +
                    time.substring(6, 8)
                );
            }
        }
    },
    components: {
        Range,
        XDialog,
        Group,
        Cell
    },
    data() {
        return {
            hasData: false,
            loanNo: "",
            isMainLoanNo: "",
            objectClass: "", //颜色class
            repayData: {},
            repayList: [], //未还款
            dataGo: "",
            repayDate: "",
            isShow: false,
            isShowWX: false,
            serviceLoanInfo: "", //网贷信息技术服务费
            compMoneyCost: "" //综合资金成本（年化）
        };
    },
    created() {
        let that = this;
        that.loanNo = that.$route.query.loanNo;
        that.isMainLoanNo = that.$route.query.isMainLoanNo;
        that.getRepay();
    },
    mounted() {},
    methods: {
        getRepay: function() {
            let that = this;
            that.$axios
                .post(url.getRepayList, { params: { loanNo: that.loanNo } })
                .then(function(response) {
                    if (response.data.code === "0000") {
                        that.repayData = response.data.result;
                        if (!that.repayData.totalHaveRepayedAmt) {
                            that.repayData.totalHaveRepayedAmt = "0.00";
                        }
                        if (!that.repayData.totalWillRepayAmt) {
                            that.repayData.totalWillRepayAmt = "0.00";
                        }
                        for (
                            let i = 0;
                            i < that.repayData.allStatList.length;
                            i++
                        ) {
                            if (
                                that.repayData.allStatList[i].isHaveRepayed ==
                                "13900002"
                            ) {
                                that.repayList.push(
                                    that.repayData.allStatList[i]
                                );
                                if (
                                    that.repayData.allStatList[i].ovduFlag ==
                                    "1"
                                ) {
                                    that.repayData.allStatList[i].remark =
                                        "(逾期未还款)";
                                } else {
                                    that.repayData.allStatList[i].remark =
                                        "(未还款)";
                                }
                                that.dataGo = that.repayList[0].repayNum;
                            } else {
                                if (
                                    that.repayData.allStatList[i].ovduFlag ==
                                    "1"
                                ) {
                                    that.repayData.allStatList[i].remark =
                                        "(逾期已还款)";
                                } else {
                                    that.repayData.allStatList[i].remark =
                                        "(已还款)";
                                }
                                that.dataGo = that.repayData.allInstNum;
                            }
                        }

                        if (response.data.result.chanNo == "045") {
                            //资方渠道为玖富时
                            that.serviceLoanInfo =
                                response.data.result.serviceLoanInfo;
                            that.compMoneyCost =
                                (
                                    response.data.result.compMoneyCost * 100
                                ).toFixed(2) + "%";
                        }

                        if (that.repayList.length > 0) {
                            if (that.repayList[0].ovduFlag == "1") {
                                that.objectClass = "repay-orange";
                            } else {
                                that.objectClass = "repay-blue";
                            }
                        } else {
                            that.objectClass = "repay-blue";
                        }

                        that.hasData = true;

                        //获取还款时间
                        if (that.repayList[0].repayDate.length > 8) {
                            that.repayDate = that.repayList[0].repayDate.replace(
                                /-/g,
                                ""
                            );
                        } else {
                            that.repayDate = that.repayList[0].repayDate;
                        }
                    } else {
                        if (response.data.msg) {
                            that.$vux.toast.text(response.data.msg);
                        }
                    }
                })
                .catch(function(response) {});
        },
        checkDate: function(date) {
            // 检查是否是当前月或者以前还款
            let curr_month = this.getCurrentMonthLast(); // 获取当前月的最后一天
            let repayTime = date;
            if (repayTime.length == 8) {
                repayTime =
                    repayTime.substring(0, 4) +
                    "/" +
                    repayTime.substring(4, 6) +
                    "/" +
                    repayTime.substring(6, 8);
            }
            //				console.log(this.getTimeStamp(repayTime))
            //				console.log(this.getTimeStamp(curr_month))
            //当还款日期大于下月第一天0点0分0秒 则视为提前还款
            if (this.getTimeStamp(repayTime) > this.getTimeStamp(curr_month)) {
                return true;
            } else {
                return false;
            }
        },
        getTimeStamp: function(str) {
            return Date.parse(new Date(str));
        },
        getCurrentMonthLast: function() {
            let date = new Date(),
                currentMonth = date.getMonth(),
                nextMonth = ++currentMonth,
                nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
            return nextMonthFirstDay;
        },
        toRepay(type) {
            const that = this;
            if (that.checkDate(that.repayDate)) {
                that.$vux.toast.text("未到还款时间，暂不支持提前还款");
                return false;
            } else if (that.repayData.chanNo == "045" && type == 0) {   //玖富未逾期
                that.isShow = true;
            } else if (that.repayData.chanNo == "045" && type == 1) {   //玖富已逾期
              that.$router.push({
                name: "advanceRepayment",
                query: { loanNo: that.loanNo, JiufuOverdue: "yes" }
              });
            } else {
              that.isShowWX = true;
            }
        },
        payWay(type) {
            //支付通道方法
            let that = this, payType, isWX;

            switch (type) {
              case 1:   //支付通道一
                payType = "21900015";
                    break;
              case 2:   //支付通道二
                payType = "21900018";
                    break;
              case 3:   //微信支付
                isWX = "wx_pay";
                    break;
              case 4:   //第三方授权支付

                    break;
            }
            that.$router.push({
                name: "advanceRepayment",
                query: {
                    loanNo: that.loanNo,
                    repayChennel: payType,
                    isWX: isWX
                }
            });
        }
    }
};
</script>

<style lang="less">
@range-disabled-opacity : 1;
.range-min,
.range-max {
    display: none;
}
</style>
