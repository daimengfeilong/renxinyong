<style lang="less">
</style>
<template>
    <div style="position: relative;">
        <div class="assessment-content">
            <div class="status-tit fs14 pt10" :style="statusStyle">
                <p>
                    <img :src="iconImg" alt="">
                    <span>当前状态：{{ loanStatusTxt }}</span>
                </p>
                <p class="status-point mt10">{{ statusPoint }}</p>
            </div>
            <div class="gaugeMeter-module">
                <div class="GaugeMeter gaugeMeter-haveBtn" id="GaugeMeter_17" :style="limitStyle" data-size="280" data-style="Arch" data-width="15" :data-color="canvasColor" :data-text="loanLimit" :data-used="applyLimit" :data-total="totalLimit"></div>
                <p class="gaugeMeter-module-tit gaugeMeter-tit-haveBtn">{{ canvasTitle }}</p>
                <p class="gaugeMeter-module-maxLimit gaugeMeter-maxLimit-haveBtn" :style="limitStyle">
                    <span>{{ canvasLimit }}</span>
                </p>
            </div>
            <div class="btnDiv">
                <a href="javascript:void(0)" class="btn-index radius5" v-if="eventName" :class="{btnRed: isOverdue}" v-stat="{key: eventName, click: eventName}" @click="clickJump(loanStatus)">
                    {{ btnText }}</a>
            </div>
        </div>
        <img class="bottomBg" src="../../../assets/image/index/bottomBg.png" alt="">

        <to-contract v-if="isContract"></to-contract>
        <open-account v-show="isOpen" :allLoanData="allLoanData" @onShow="onShow"></open-account>
        <rocket v-if="showRocket"></rocket>
    </div>
</template>
<script>
import "../../../assets/js/jquery-2.1.1.min.js";
import "../../../assets/js/jquery.AshAlom.gaugeMeter-2.0.0.min";
import _ from "underscore";
import toContract from "./toContract.vue";
import openAccount from "./toOpenAccount.vue";
import Rocket from "../../common/Rocket";

export default {
    name: "app",
    props: ["loanData"],
    data() {
        return {
            showRocket: false, //显示火箭Loading
            subLoanCredit: 2,
            iconImg: require("@/assets/image/index/statusIcon_1.png"),
            loanNo: "",
            allLoanData: {}, //开户窗口所需数据
            loanStatus: "",
            loanStatusTxt: "",
            statusPoint: "您的分期申请正在处理中，请耐心等候",
            canvasColor: "#4f9ff9",
            canvasTitle: "我的额度(元)",
            canvasLimit: "最高额度50,000",
            loanLimit: "20,000",
            applyLimit: "20000",
            totalLimit: "50000",
            btnText: "",
            isContract: false,
            isOpen: false,
            statusStyle: {
                backgroundColor: "#048dd9"
            },
            limitStyle: {
                color: "#333"
            },
            isOverdue: false,
            eventName: "" //埋点统计所需事件名
        };
    },
    components: {
        toContract,
        openAccount,
        Rocket
    },
    mounted() {
        $(document).ready(function() {
            $(".GaugeMeter").gaugeMeter();
        });
    },
    created() {
        this.initInfo();
    },
    methods: {
        onShow(v){
            this.showRocket = v
        },
        initInfo() {
            //处理首页各种状态下不同的展现
            const that = this;
            that.loanNo = that.loanData.loanNo;
            that.loanStatus = that.loanData.loanStatus;
            that.loanLimit = that.loanData.loanLimit;
            that.applyLimit = that.loanData.loanLimit;
            that.subLoanCredit = that.loanData.subLoanCredit;
            that.allLoanData = that.loanData;

            if (that.subLoanCredit == 0) {
                //信用不足
                that.eventName = "Cm1buyIns";
                that.loanStatusTxt = "信用不足";
                that.canvasTitle = "申请额度(元)";
                that.btnText = "购买增信险";
                that.statusPoint = "购买增信险，百分之百通过";
                that.canvasColor = "#6c6c6d";
                that.statusStyle.backgroundColor = "#6c6c6d";
                that.limitStyle.color = "#999";
                that.iconImg = require("@/assets/image/index/statusIcon_3.png");
            } else {
                //信用充足
                if (that.loanStatus == "31000009") {
                    that.iconImg = require("@/assets/image/index/statusIcon_2.png");
                } else if (
                    that.loanStatus == "31000006" ||
                    that.loanStatus == "31000005" ||
                    that.loanStatus == "17700002"
                ) {
                    that.iconImg = require("@/assets/image/index/statusIcon_3.png");
                } else if (that.loanStatus == "17700004") {
                    that.iconImg = require("@/assets/image/index/statusIcon_4.png");
                } else {
                    that.iconImg = require("@/assets/image/index/statusIcon_1.png");
                }

                if (that.loanData.cashStat == "44500001") {
                    //未提现
                    that.eventName = "Cm2witDep";
                    that.loanStatusTxt = "未提现";
                    that.btnText = "去提现";
                    that.statusPoint = "您有可提现的额度，快去提现吧";
                    return false;
                }

                switch (that.loanStatus) {
                    case "17700001": // 已还款
                        that.eventName = "Cm8havRep";
                        that.loanStatusTxt = "已还款";
                        that.canvasTitle = "本期应还款(元)";
                        that.loanLimit = that.loanData.mthRepayAmt;
                        that.canvasLimit = "分期总额度" + that.applyLimit;
                        that.btnText = "已还款";
                        that.statusPoint = "您本期账单已完成还款，请继续保持";
                        break;
                    case "17700002": // 已逾期
                        that.eventName = "Cm9rep";
                        that.loanStatusTxt = "已逾期";
                        that.canvasTitle = "本期应还款(元)";
                        that.loanLimit = that.loanData.mthRepayAmt;
                        that.canvasLimit = "分期总额度" + that.applyLimit;
                        that.btnText = "前往还款";
                        that.statusPoint = "您本期账单已逾期，请尽快完成还款";
                        that.canvasColor = "#fb8663";
                        that.statusStyle.backgroundColor = "#fb8663";
                        that.isOverdue = true;
                        break;
                    case "17700006": // 待还款
                        that.eventName = "Cm11waiRep";
                        that.canvasTitle = "本期应还款(元)";
                        that.loanStatusTxt = "待还款";
                        that.btnText = "待还款";
                        that.loanLimit = that.loanData.mthRepayAmt;
                        that.canvasLimit = "分期总额度" + that.applyLimit;
                        that.statusPoint =
                            "您的还款日为每月" +
                            that.loanData.mthRepayDate +
                            "日";
                        break;
                }

                that.$axios
                    .post(url.query, {
                        //获取状态码对应的文字
                        params: {
                            list: [
                                {
                                    type: "Aprov_Result"
                                }
                            ]
                        }
                    })
                    .then(function(res) {
                        const result = res.data;
                        const statusTxt = _.findWhere(
                            result.result.Aprov_Result,
                            { valCode: that.loanStatus }
                        ).valName;
                        that.loanStatusTxt = statusTxt;
                        that.btnText = statusTxt;

                        if (
                            (that.loanStatus == "31000013" &&
                                that.loanData.accountStat == "44300002") ||
                            (that.loanData.childLoanStat == "31000013" &&
                                that.loanData.childLoanAccountStat ==
                                    "44300002")
                        ) {
                            //主贷款和子贷款未开户
                            that.eventName = "Cm4opeAcc";
                            that.canvasTitle = "申请额度(元)";
                            that.loanStatusTxt = "未开户";
                            that.btnText = "去开户";
                            that.statusPoint =
                                "响应监管要求，为保护您的个人权益，请您完成开户。";
                            that.canvasColor = "#6c6c6d";
                            that.statusStyle.backgroundColor = "#6c6c6d";
                            that.limitStyle.color = "#999";
                            return;
                        }

                        switch (that.loanStatus) {
                            case "31000013": //审核中
                                that.eventName = "Cm5goChe";
                                that.canvasTitle = "申请额度(元)";
                                that.statusPoint =
                                    "*分期额度与月还款以实际审核结果为准";
                                break;
                            case "31000009": //待签约
                                that.eventName = "Cm3goSig";
                                that.canvasLimit =
                                    "分期 " + that.loanData.instNum + " 期";
                                that.btnText = "前往签约";
                                that.statusPoint =
                                    "您的审核已通过，请尽快完成签约";
                                break;
                            case "31000002": //已签约，待放款
                                that.eventName = "Cm12waiLoa";
                                that.canvasLimit =
                                    "分期 " + that.loanData.instNum + " 期";
                                that.statusPoint =
                                    "您已签约成功，请耐心等待放款";
                                break;
                            case "31000005": // 未通过
                                that.eventName = "Cm6aplOrt";
                                that.canvasTitle = "申请额度(元)";
                                that.btnText = "申请其他产品";
                                that.statusPoint =
                                    "别灰心，您可以再看看其他产品";
                                that.canvasColor = "#6c6c6d";
                                that.statusStyle.backgroundColor = "#6c6c6d";
                                that.limitStyle.color = "#999";
                                break;
                            case "31000006": // 返回修改
                                that.eventName = "Cm7ret";
                                that.loanStatusTxt = "返回修改";
                                that.canvasTitle = "申请额度(元)";
                                that.btnText = "返回修改";
                                that.statusPoint = "您的资料有误，请尽快修改";
                                that.canvasColor = "#6c6c6d";
                                that.statusStyle.backgroundColor = "#6c6c6d";
                                that.limitStyle.color = "#999";
                                break;
                        }

                        if (!that.eventName) {
                            that.eventName = "Cm13beiPro";
                        }
                    })
                    .catch(function(err) {
                        console.log(err.data);
                    });
            }
        },
        clickJump(loanStatus) {
            const that = this;
            if (that.subLoanCredit == 0) {
                //信用不足
                that.$router.push({
                    name: "safeOrder",
                    query: {
                        loanNo: that.loanData.loanNo
                    }
                });
                return;
            } else if (that.loanData.cashStat == "44500001") {
                //未提现
                that.$router.push({
                    name: "orderDetail",
                    query: {
                        loanNo: that.loanData.loanNo
                    }
                });
                return;
            } else if (
                loanStatus == "31000009" ||
                that.loanData.childLoanStat == "31000009"
            ) {
                //待签约
                that.isContract = true;
                return;
            } else if (
                (loanStatus == "31000013" &&
                    that.loanData.accountStat == "44300002") ||
                (that.loanData.childLoanStat == "31000013" &&
                    that.loanData.childLoanAccountStat == "44300002")
            ) {
                //未开户
                that.isOpen = true;
                return;
            }

            switch (loanStatus) {
                case "31000013": //审核中
                    that.$router.push({
                        name: "orderDetail",
                        query: {
                            loanNo: that.loanData.loanNo
                        }
                    });
                    break;
                case "31000005": //未通过
                    //            window.location.href = `${yinliu_URL}?mobile=${getLocalStorage("phoneNo")}&token=${getLocalStorage("token")}&target=h5`
                    that.$parent.isRefuse = true;
                    break;
                case "31000006": //返回修改
                    that.$router.push({
                        name: "orderDetail",
                        query: {
                            loanNo: that.loanData.loanNo
                        }
                    });
                    break;
                case "17700001": //已还款
                    that.$router.push({
                        name: "repaymentDetail",
                        query: {
                            loanNo: that.loanData.loanNo,
                            isMainLoanNo: "13900001" //是否是主贷款  13900001：是；13900002：不是
                        }
                    });
                    break;
                case "17700002": //已逾期
                    that.$router.push({
                        name: "repaymentDetail",
                        query: {
                            loanNo: that.loanData.loanNo,
                            isMainLoanNo: "13900001" //是否是主贷款  13900001：是；13900002：不是
                        }
                    });
                    break;
                case "17700006": //待还款
                    that.$router.push({
                        name: "repaymentDetail",
                        query: {
                            loanNo: that.loanData.loanNo,
                            isMainLoanNo: "13900001" //是否是主贷款  13900001：是；13900002：不是
                        }
                    });
                    break;
                case "31000002": //已签约，待放款
                    that.$vux.toast.text("请耐心等候哦亲");
                    break;
                default:
                    that.$vux.toast.text("您的分期申请正在处理中，请耐心等候");
                    break;
            }
        }
    }
};
</script>
