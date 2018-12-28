<template>
    <div>
        <div class="detail-container has-padding">
            <div :class="objectClass">
                <div>
                    <h4 class="order-tit text-center">
                        <img src="../../assets/image/order/Home_Icon_Wait.png">
                        <b>订单状态：{{orderDetail.statName | toStrXS}}</b>
                        <b v-if="orderDetail.subLoanCredit=='0'">，信用不足</b>
                    </h4>
                    <ul>
                        <li class="box">
                            <label class="flex-1">分期金额：</label>
                            <p class="flex-2">￥{{orderDetail.loanAmt}}</p>
                        </li>
                        <li class="box">
                            <label class="flex-1">贷款期限：</label>
                            <p class="flex-2">{{orderDetail.instNum}}</p>
                        </li>
                        <li class="box">
                            <label class="flex-1">月还款日：</label>
                            <p class="flex-2">{{orderDetail.mthRepayDate}}</p>
                        </li>
                        <li class="box">
                            <label class="flex-1">申请时间：</label>
                            <p class="flex-2" v-if="hasData">{{orderDetail.applyDate | formatDate}}</p>
                        </li>
                        <li class="box" v-if="hasReject">
                            <label class="flex-1">月还款额：</label>
                            <!--<span class="flex-2" @click="getRepay">点击查看</span>-->
                            <router-link
                                tag="span"
                                class="flex-2"
                                v-stat="{key:'Co9monMou', click:'Co9monMou'}"
                                :to="{path: 'repaymentDetail', query: {loanNo: orderDetail.loanNo, isMainLoanNo: orderDetail.isMainLoanNo}}"
                            >点击查看</router-link>
                        </li>
                        <li
                            class="box"
                            v-if="orderDetail.stat=='31000002' && orderDetail.chanNo == '045' && (orderDetail.isMainLoanNo == '13900001' || orderDetail.isSplitLoan == '13900002')"
                        >
                            <label class="flex-1">查询合同：</label>
                            <router-link
                                tag="span"
                                class="flex-2"
                                v-stat="{key:'ClooCont', click:'ClooCont'}"
                                :to="{path: 'protocol', query: {source:'orderDetail'}}"
                            >点击查看</router-link>
                        </li>
                        <li
                            class="box"
                            v-if="orderDetail.stat=='31000002' && orderDetail.chanNo == '045'"
                        >
                            <label class="flex-1">用户协议：</label>
                            <router-link
                                tag="span"
                                class="flex-2"
                                v-stat="{key:'ClooCont', click:'ClooCont'}"
                                :to="{path: 'userProtocol', query: {loanNo: orderDetail.loanNo}}"
                            >点击查看</router-link>
                        </li>
                        <li class="box" v-if="orderDetail.stat=='31000006'">
                            <label class="flex-1">驳回原因：</label>
                            <p class="flex-2">{{orderDetail.rejectRemark}}</p>
                        </li>
                    </ul>
                </div>
                <p class="pt10 color-9">月还款金额和还款日以放款后的还款计划为准</p>
                <p class="order-point" v-if="orderDetail.stat=='31000009'">*5天未签约会自动取消申请。</p>
                <!--v-if="orderDetail.accountStat=='44300002'&&(orderDetail.stat=='31000008'||orderDetail.stat=='31000013')"-->
                <group
                    class="bg-white mt10"
                    style="display:block;"
                    v-if="orderDetail.stat=='31000002' && orderDetail.cashStat=='44500001' && orderDetail.chanNo == '045'"
                >
                    <cell title="温馨提示" inline-desc="提现不成功，请点击这里" link="saveAccountInfo">
                        <img
                            slot="icon"
                            style="display:block;margin-right:10px;width:30px;"
                            src="@/assets/image/order/icon_wxts.png"
                        >
                    </cell>
                </group>
                <div
                    class="fixed-bottom p10 transverseBtn"
                    v-if="orderDetail.accountStat=='44300002'&&(orderDetail.stat=='31000008'||orderDetail.stat=='31000013')"
                >
                    <div>
                        <span
                            class="btn"
                            v-stat="{key:'Co1noOpe', click:'Co1noOpe'}"
                            @click="showAccountView = true"
                        >去开户</span>
                    </div>
                    <div>
                        <span class="fs16 color resetBtn" @click="changePwd">重置开户密码</span>
                    </div>
                </div>
                <!--v-if="orderDetail.stat=='31000009'"-->
                <div class="fixed-bottom p10" v-if="orderDetail.stat=='31000009'">
                    <span
                        class="btn"
                        v-stat="{key:'Co2goSig', click:'Co2goSig'}"
                        @click="toSign"
                    >去签约</span>
                </div>
                <!--v-if="orderDetail.subLoanCredit=='0'"-->
                <div class="fixed-bottom p10" v-if="orderDetail.subLoanCredit=='0'">
                    <router-link
                        tag="span"
                        class="btn"
                        v-stat="{key:'Co3m1buyIns', click:'Co3m1buyIns'}"
                        :to="{ name: 'safeOrder', query: {loanNo: orderDetail.loanNo}}"
                    >购买保单，增加信用</router-link>
                </div>
                <div class="fixed-bottom p10" v-if="orderDetail.stat=='31000010'">
                    <span
                        class="btn"
                        v-stat="{key:'Co4conSer', click:'Co4conSer'}"
                        @click="showPlugin"
                    >联系客服({{serviceNo}})</span>
                </div>
                <!--v-if="orderDetail.stat=='31000006'"-->
                <div class="fixed-bottom" v-if="orderDetail.stat=='31000006'">
                    <div class="btn-wrap box">
                        <div class="flex-1">
                            <span
                                v-stat="{key:'Co6can',click:'Co6can'}"
                                class="btn def-btn"
                                @click="cancelOrder"
                            >取消订单</span>
                        </div>
                        <div class="flex-1">
                            <span
                                v-stat="{key:'Co5ret',click:'Co5ret'}"
                                class="btn"
                                @click="backModify"
                            >返回修改</span>
                        </div>
                    </div>
                </div>
                <!--v-if="orderDetail.stat=='31000002'"-->
                <div
                    class="fixed-bottom p10"
                    v-if="orderDetail.stat=='31000002' && orderDetail.isRecall!='13900001'&&orderDetail.isSplitLoan=='13900001'&&orderDetail.isMainLoanNo=='13900001'"
                >
                    <div class="box">
                        <!-- v-if="orderDetail.isRecall!='13900001'&&orderDetail.isSplitLoan=='13900001'&&orderDetail.isMainLoanNo=='13900001'"-->
                        <router-link
                            tag="span"
                            class="flex-1 btn"
                            v-stat="{key:'Co8conLet', click:'Co8conLet'}"
                            :to="{ name: 'confirmation', query: {loanNo: orderDetail.loanNo}}"
                        >确认函</router-link>
                    </div>
                </div>
                <div
                    class="fixed-bottom"
                    v-if="orderDetail.stat=='31000002' && orderDetail.cashStat=='44500001'"
                >
                    <div class="box btn-wrap">
                        <!-- 玖富/星火 -->
                        <div
                            class="flex-1"
                            v-if="orderDetail.chanNo == '045' || orderDetail.chanNo == '013'"
                        >
                            <a class="btn def-btn" @click="resetSignPwd">重置密码</a>
                        </div>
                        <div class="flex-1">
                            <a
                                class="btn"
                                v-stat="{key:'Co7witDep', click:'Co7witDep'}"
                                @click="isNeedResetPwd"
                            >提现</a>
                        </div>
                    </div>
                </div>
            </div>

            <div v-transfer-dom>
                <popup v-model="repayView" position="bottom" max-height="50%">
                    <x-table :cell-bordered="false" style="background-color:#fff;">
                        <thead>
                            <tr>
                                <th>分期期数</th>
                                <th>每期应还</th>
                                <th>每期还款日</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(repay,index) in repayList" :key="index">
                                <td>{{repay.repayNum}}</td>
                                <td>{{repay.rcvTotalAmt}}</td>
                                <td>{{repay.repayDate | formatDate1}}</td>
                            </tr>
                        </tbody>
                    </x-table>
                    <div style="padding: 15px;">
                        <span class="btn" @click="repayView = false">确 定</span>
                    </div>
                </popup>
            </div>
            <div v-transfer-dom>
                <x-dialog v-model="showAccountView" hide-on-blur>
                    <div class="account-point">
                        <h4>温馨提示</h4>
                        <label class="text-left">为保证正常放款，开户银行卡与绑定储蓄卡必须一致。</label>
                        <strong class="text-left">卡号&nbsp;&nbsp;{{bankAcct}}</strong>
                        <p class="text-left" v-if="orderDetail.agreementUrl">
                            <i>
                                <img src="../../assets/image/order/Insurance_Icon_Chose.png">
                            </i>
                            <b>
                                我已阅读并接受
                                <i @click="agreement">《银行存管授权委托书》</i>
                            </b>
                        </p>
                        <span class="btn" @click="openAccount">确认</span>
                    </div>
                </x-dialog>
            </div>
        </div>
        <rocket v-if="showRocket"></rocket>

    </div>
</template>

<script>
import _ from "underscore";
import { formatDate } from "../../assets/js/date.js";
import { TransferDom, Popup, XTable, XDialog, Cell } from "vux";
import Rocket from "../../components/common/Rocket.vue";

export default {
    filters: {
        formatDate(time) {
            var date = new Date(time);
            return formatDate(date, "yyyy-MM-dd");
        },
        formatDate1: function(time) {
            if (time.length == 8) {
                return (
                    time.substring(0, 4) +
                    "-" +
                    time.substring(4, 6) +
                    "-" +
                    time.substring(6, 8)
                );
            }
        },
        toStrXS(v) {
            //返回销售修改，过滤'销售'文字
            return v.replace("销售", "");
        },
        parseName(val) {
            return val.replace(/\（[^\）]+\）|\([^\)]+\)/, "");
        }
    },
    directives: {
        TransferDom
    },
    components: {
        Popup,
        XTable,
        XDialog,
        Rocket,
        Cell
    },
    data() {
        return {
            showRocket: false, //显示火箭Loading
            hasData: false,
            phoneNo: "",
            serviceNo: "400-668-8000",
            state: {
                list: [
                    {
                        type: "Aprov_Result" //状态码表 请求参数
                    }
                ]
            },
            statList: [], //状态码表
            orderDetail: {
                statName: "" //状态文字
                //				    "loanNo": "", //贷款编号
                //				    "loanAmt": "", //贷款金额
                //				    "instNum": "", //期数
                //				    "mthRepayDate": "", //月还款日
                //				    "stat": "", //状态码值
                //				    "applyDate": "", //申请时间
                //				    "rejectRemark": "", //驳回原因
                //				    "isMainLoanNo": "",  //是否是主贷款
                //				    "subLoanCredit": "", //信用是否充足
                //				    "accountStat": "" //是否开户，44300002未开户
            },
            sendAccount: {
                //开户请求参数
                loanNo: "", //贷款编号 (必填)
                prodNo: "", //产品编号 (必填)
                phoneNo: "", //手机号  (必填)
                backUrl: "", //用户开户成功后返回的页面地址 (必填)
                initiatorType: "01" //（请求发起方）终端类型  01：移动端  02：PC端
            },
            repayList: {}, //月还款计划详情列表
            repayView: false, //月还款计划详情显示/隐藏
            hasReject: false, //月还款显示/隐藏
            objectClass: "", //颜色class
            showAccountView: false, //开户提示显示/隐藏
            bankAcct: "", //银行卡号
            isContract: false, //去签约列表显示/隐藏
            changePwdParams: {
                loanNo: "",
                chanNo: "045",
                certNo: "",
                backUrl: window.location.href,
                pwd_success_url: window.location.href,
                pwd_fail_url: `${window.location.origin}/#/resetPwdError`,
                transaction_url: window.location.href
            }
        };
    },
    created() {
        let that = this;
        if (that.$route.query.loanNo) {
            that.orderDetail.loanNo = that.$route.query.loanNo;
            that.changePwdParams.loanNo = that.$route.query.loanNo;
        } else {
            that.orderDetail.loanNo = getLocalStorage("loanNo");
            that.changePwdParams.loanNo = getLocalStorage("loanNo");
        }
        that.changePwdParams.certNo = getUserInfo("certNo");
        that.phoneNo = getLocalStorage("phoneNo");
        that.getStatName();
    },
    methods: {
        getStatName: function() {
            let that = this;
            that.$axios
                .post(url.codeQuery, { params: that.state })
                .then(function(response) {
                    if (response.data.code === "0000") {
                        that.statList = response.data.result.Aprov_Result;
                        that.getOrderDetail();
                    } else {
                        if (response.data.msg) {
                            that.$vux.toast.text(response.data.msg);
                        }
                    }
                })
                .catch(function(response) {});
        },
        getOrderDetail: function() {
            let that = this;
            that.$axios
                .post(url.queryLoanDetail, {
                    params: { loanNo: that.orderDetail.loanNo }
                })
                .then(function(response) {
                    if (response.data.code === "0000") {
                        let result = response.data.result;
                        that.orderDetail = result;
                        let thisStat = that.orderDetail.stat;

                        setLocalStorage("loanNo", result.loanNo);
                        setLocalStorage("prodNo", result.prodNo);
                        setLocalStorage("loanAmt", result.loanAmt);
                        setLocalStorage("instNum", result.instNum);

                        if (
                            thisStat == "31000001" ||
                            thisStat == "31000003" ||
                            thisStat == "31000005" ||
                            thisStat == "31000007" ||
                            thisStat == "31000010" ||
                            thisStat == "31000012" ||
                            thisStat == "31000014" ||
                            thisStat == "31000016"
                        ) {
                            that.objectClass = "order-gray";
                        } else {
                            that.objectClass = "order-blue";
                        }
                        if (thisStat == "31000002") {
                            that.hasReject = true;
                        }
                        that.orderDetail.statName = _.findWhere(that.statList, {
                            valCode: thisStat
                        }).valName;
                        let acctNo = result.bankAcct.acctNo;
                        that.bankAcct =
                            acctNo.slice(0, 4) + "******** " + acctNo.slice(-4);
                        that.hasData = true;

                        //默认到底部
                        window.scrollTo(0,1000)
                    } else {
                        if (response.data.msg) {
                            that.$vux.toast.text(response.data.msg);
                        }
                    }
                })
                .catch(function(response) {});
        },
        getRepay() {
            //	        	let that = this
            //          	that.$axios.post(url.getRepayList, {"params": {"loanNo":that.orderDetail.loanNo}})
            //              .then(function(response) {
            //              	console.log(response.data.result)
            //              	if(response.data.code === "0000") {
            //	                	that.repayList = response.data.result.allStatList
            //	                	that.repayView = true
            //              	}else {
            //	                    that.$vux.toast.text(response.data.msg)
            //	                }
            //              })
            //              .catch(function (response) {
            //				})
        },
        showPlugin() {
            let that = this;
            that.$vux.confirm.show({
                title: "操作提示",
                content: "是否拨号 " + that.serviceNo + " ？",
                onConfirm() {
                    window.location.href = "tel://" + that.serviceNo;
                }
            });
        },
        cancelOrder() {
            let that = this;
            that.$vux.confirm.show({
                title: "操作提示",
                content: "确定取消订单？",
                onConfirm() {
                    that.$axios
                        .post(url.affirmcancelloans, {
                            params: { loanNo: that.orderDetail.loanNo }
                        })
                        .then(function(response) {
                            if (response.data.code == "0000") {
                                that.$vux.toast.text(response.data.msg);
                                that.getStatName();
                                that.orderDetail.statName = "取消";
                            } else {
                                if (response.data.msg) {
                                    that.$vux.toast.text(response.data.msg);
                                }
                            }
                        })
                        .catch(function(response) {});
                }
            });
        },
        agreement() {
            window.location.href = this.orderDetail.agreementUrl;
        },
        openAccount() {
            let that = this;
            that.showAccountView = false;
            that.sendAccount.phoneNo = getLocalStorage("phoneNo");
            that.sendAccount.prodNo = getLocalStorage("prodNo");
            that.sendAccount.loanNo = that.orderDetail.loanNo;
            that.sendAccount.backUrl = `${window.location.origin}/#/success`;
            that.sendAccount.errorUrl = `${window.location.origin}/#/success`;
            that.$axios
                .post(url.openAccount, { params: that.sendAccount })
                .then(response => {
                    if (response.data.code === "0000") {
                        let result = response.data.result,
                            resultType = result.data.resultType;

                        // 表示开户银行卡信息不匹配的用户
                        if (result.bankMsg) {
                            // 子贷款只提示
                            that.$router.push({
                                path: "/bankCard",
                                query: {
                                    loanNo: that.orderDetail.loanNo,
                                    returnMsg: result.msg,
                                    source: "orderDetail"
                                }
                            });
                            return false;
                        }
                        if (resultType === "1") {
                            that.showRocket = true;

                            setTimeout(() => {
                                that.doResetPwd(result.data.url);
                            }, 2000);
                        } else if (resultType === "2") {
                            that.$vux.toast.text(result.msg);
                            that.getOrderDetail();
                        } else if (resultType === "0") {
                            that.$vux.toast.text(result.msg);
                        }
                    } else {
                        if (response.data.msg) {
                            that.$vux.toast.text(response.data.msg);
                        }
                    }
                })
                .catch(response => {});
        },
        toSign() {
            let that = this;
            that.$axios
                .post(url.queryBindStatus, {
                    params: { loanNo: that.orderDetail.loanNo }
                })
                .then(function(response) {
                    if (response.data.code === "0000") {
                        // 查询是否需要绑卡
                        if (response.data.result.isOnCard === "13900001") {
                            // 未绑卡 或者异常就去绑卡界面
                            if (response.data.result.code !== "44100001") {
                                that.$router.push({
                                    path: "/repayBank",
                                    query: { loanNo: that.orderDetail.loanNo }
                                });
                                return false;
                            }
                        }

                        if (that.orderDetail.isMainLoanNo === "13900001") {
                            that.$axios
                                .post(url.checkSubLoanSignStat, {
                                    params: { loanNo: that.orderDetail.loanNo }
                                })
                                .then(function(response) {
                                    if (response.data.code === "0000") {
                                        if (
                                            response.data.result === "13900002"
                                        ) {
                                            that.$vux.toast.text(
                                                "请先签约其他订单"
                                            );
                                            return false;
                                        }
                                        that.$router.push({
                                            path: "/contractList",
                                            query: {
                                                loanNo: that.orderDetail.loanNo
                                            }
                                        });
                                    } else {
                                        if (response.data.msg) {
                                            that.$vux.toast.text(
                                                response.data.msg
                                            );
                                        }
                                    }
                                });
                            return false;
                        }
                        that.$router.push({
                            path: "/contractList",
                            query: { loanNo: that.orderDetail.loanNo }
                        });
                    } else {
                        if (response.data.msg) {
                            that.$vux.toast.text(response.data.msg);
                        }
                    }
                })
                .catch(function(response) {});
        },
        backModify() {
            this.$router.push({
                path: "authentication",
                query: { source: "orderDetail" }
            });
        },
        doResetPwd(url) {
            let that = this;

            // 判断到底以哪种方式进行页面跳转 星火返回js代码
            if (url.indexOf("<script") === -1) {
                window.location.href = url;
                return false;
            }

            let node = document.createElement("div");
            node.id = "innerHtmlContainer";
            document.body.appendChild(node);
            document.querySelector("#innerHtmlContainer").innerHTML = url.split(
                "<script"
            )[0];
            document.querySelector("#innerHtmlContainer form").submit();
        },
        resetSignPwd() {
            let that = this;

            that.$axios
                .post(url.resetPasswd, { params: that.changePwdParams })
                .then(res => {
                    let { code, msg, result } = res.data;

                    if (code == "0000") {
                        that.doResetPwd(result.url);
                    } else {
                        that.$vux.toast.text(msg, "top");
                    }
                });
        },
        isNeedResetPwd() {
            let that = this;

            // if(that.orderDetail.chanNo != '045'){
            //     that.withdrawal()
            //     return false;
            // }

            that.$axios
                .post(url.isNeedResetPwd, {
                    params: {
                        loanNo: getLocalStorage("loanNo"),
                        backUrl: window.location.href,
                        pwd_success_url: window.location.href,
                        pwd_fail_url: `${
                            window.location.origin
                        }/#/resetPwdError`,
                        transaction_url: window.location.href
                    }
                })
                .then(res => {
                    let { code, msg, result } = res.data;

                    if (code == "0000") {
                        if (result.isneed == "1") {
                            that.$vux.confirm.show({
                                title: "操作提示",
                                content: "请设置提现密码",
                                onConfirm() {
                                    that.doResetPwd(result.url);
                                }
                            });
                        } else {
                            that.withdrawal();
                        }
                    } else {
                        that.$vux.toast.text(msg, "top");
                    }
                });
        },
        withdrawal() {
            let that = this;

            that.$axios
                .post(url.withdrawal, {
                    params: {
                        loanNo: that.orderDetail.loanNo,
                        notifyUrl: `${window.location.origin}/#/success`,
                        forgetPwdUrl: window.location.href
                        //"money":that.orderDetail.loanAmt
                    }
                })
                .then(function(response) {
                    if (response.data.code === "0000") {
                        let result = response.data.result;
                        if (result.sts === "000000") {
                            /*
	                         0: 待提现
	                         1: 提现成功
	                         2: 提现失败
	                         3: 提现中
	                         */
                            let type = result.data.resultType;
                            switch (type) {
                                case "1":
                                    that.$vux.toast.text(
                                        result.data.resultDesc
                                    );
                                    break;
                                case "2":
                                    that.$vux.toast.text(
                                        result.data.resultDesc
                                    );
                                    break;
                                case "0":
                                    // 待体现状态 跳转到第三方提现地址
                                    setLocalStorage("path", "withdrawal");
                                    that.doResetPwd(result.data.url);
                                    break;
                                default:
                                    break;
                            }
                        } else {
                            if (result.msg) {
                                that.$vux.toast.text(result.msg);
                            }
                        }
                    } else {
                        if (response.data.msg) {
                            that.$vux.toast.text(response.data.msg);
                        }
                    }
                });
        },
        changePwd() {
            //修改开户密码
            let that = this;
            that.$axios
                .post(url.resetPasswd, { params: that.changePwdParams })
                .then(function(res) {
                    let result = res.data;
                    if (result.code == "0000") {
                        if (result.result.url) {
                            window.location.href = result.result.url;
                        } else {
                            that.$vux.toast.text(result.result.msg, "top");
                        }
                    } else {
                        that.$vux.toast.text(result.msg, "top");
                    }
                })
                .catch();
        }
    }
};
</script>
