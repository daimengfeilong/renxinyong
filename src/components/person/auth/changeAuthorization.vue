<style lang="less">
</style>
<template>
    <div>
        <div class="bankImg">
            <div>
                <img src="@/assets/image/person/huaxiabankImg.png" alt="">
            </div>
            <div>
                <span class="openBtn" v-if="openBankDetail.openStatus == '44300001'">已开户</span>
                <span class="openBtn" @click="toBind" v-else-if="openBankDetail.openStatus == '44300000'">开户中</span>
                <span class="openBtn" @click="toBind" v-else-if="openBankDetail.openStatus == '44300003'">开户失败</span>
                <span class="openBtn" @click="toBind" v-else="">去开户</span>
            </div>
        </div>
        <div class="function-list mt10">
            <p class="function-list-tit">在开户过程中可能会出现以下问题</p>
            <ul>
                <li @click="changePwd">
                    <img src="@/assets/image/person/huaxia_01.png" alt="">
                    <p>忘记密码</p>
                </li>
                <li @click="authorizeEvent(1)">
                    <img src="@/assets/image/person/huaxia_03.png" alt="">
                    <p>授权</p>
                </li>
                <li @click="authorizeEvent(2)">
                    <img src="@/assets/image/person/huaxia_02.png" alt="">
                    <p>取消授权</p>
                </li>
                <li @click="authorizeEvent(3)">
                    <img src="@/assets/image/person/huaxia_04.png" alt="">
                    <p>变更授权</p>
                </li>
                <li @click="logoutEvent">
                    <img src="@/assets/image/person/huaxia_05.png" alt="">
                    <p>注销</p>
                </li>
                <li @click="showAcctInfo = true">
                    <img src="@/assets/image/person/huaxia_06.png" alt="">
                    <p>查询开户信息</p>
                </li>
                <li @click="showUpdateAccount = true">
                    <img src="@/assets/image/person/huaxia_07.png" alt="">
                    <p>更改开户信息</p>
                </li>
            </ul>
        </div>
        <div class="backBtn" @click="back">
            <span>返回上一级</span>
        </div>

        <div v-transfer-dom>
            <x-dialog v-model="showAccountView" hide-on-blur>
                <div class="account-point">
                    <h4>温馨提示</h4>
                    <label class="text-left">为保证正常放款，开户银行卡与绑定储蓄卡必须一致。</label>
                    <strong class="text-left">卡号&nbsp;&nbsp;{{bankAcct | toBankNum}}</strong>
                    <p class="text-left" v-if="agreementUrl">
                        <i><img src="@/assets/image/order/Insurance_Icon_Chose.png" /></i>
                        <b>我已阅读并接受<i><a class="bule-link" :href="agreementUrl">《银行存管授权委托书》</a></i></b>
                    </p>
                    <a class="btn" @click="openAccount">确认</a>
                </div>
            </x-dialog>
        </div>

        <AccountInfo :show="showAcctInfo" @closeDialog="closeAcctInfo" v-if="showAcctInfo"></AccountInfo>
        <UpdateAccount :show="showUpdateAccount" @closeDialog="closeUpdateAccount"></UpdateAccount>

        <rocket v-if="showRocket"></rocket>
    </div>
</template>
<script>
import { TransferDom, XDialog } from "vux";
import { saveAuth } from "@/assets/js/utils.js";
import Rocket from "../../common/Rocket";
import AccountInfo from '../../common/order/AccountInfo'
import UpdateAccount from '../../common/order/UpdateAccount'

export default {
    name: "app",
    components: {
        XDialog,
        Rocket,
        AccountInfo,
        UpdateAccount
    },
    data() {
        return {
            showAccountView: false, //弹窗口
            agreementUrl: "", //协议地址
            bankAcct: getLocalStorage("bankNo"), //卡号
            bankList: [],
            openBankDetail: {},
            state: getLocalStorage("openBankAcctState"), //认证操作次数
            isOpen: false, //当前产品是否已认证
            isAllOpen: false, //所有产品是否完成开户
            showRocket: false, //显示火箭Loading
            showAcctInfo: false, //显示查询开户信息弹窗
            showUpdateAccount: false, //更改开户信息弹窗
            params: {
                chanNo: "",
                prodNo: getLocalStorage("prodNo"),
                loanNo: getLocalStorage("loanNo"),
                phoneNo: getLocalStorage("phoneNo"),
                backUrl: window.location.href,
                errorUrl: window.location.href,
                sourceUserType: SOURCE_USER_TYPE,
                sourceOsType: getLocalStorage("sourceOsType"),
                sourceType: SOURCE_TYPE
            },
            changePwdParams: {
                loanNo: getLocalStorage("loanNo"),
                chanNo: "045",
                certNo: "",
                backUrl: window.location.href,
                pwd_success_url: window.location.href,
                pwd_fail_url: `${
                    window.location.origin
                }/#/resetPwdError?source=changeAuthorization`,
                transaction_url: window.location.href
            },
            authJson: {
                certNo: "",
                phoneNo: getLocalStorage("phoneNo"),
                handlerType: "",
                byEntrustType: "48600002",
                entrustTerm: "",
                quota: "",
                backUrl: window.location.href,
                asynBackUrl: window.location.href,
                initiator: "43900001"
            },
            logoutJson: {
                certNo: "",
                phoneNo: getLocalStorage("phoneNo"),
                backUrl: window.location.href,
                note: "销户"
            }
        };
    },
    directives: {
        TransferDom
    },
    filters: {
        toBankNum(v) {
            return v ? v.slice(0, 4) + " **** **** " + v.slice(-4) : "";
        }
    },
    beforeDestroy() {
        document.querySelector("body").style.background = "#f7f7f9";
    },
    mounted() {
        let that = this;
        const certNo = getUserInfo('certNo')

        document.querySelector("body").style.background = "#fff";

        that.changePwdParams.certNo = certNo
        that.authJson.certNo = certNo
        that.logoutJson.certNo = certNo

        that.openAccountProds();
    },
    methods: {
        openAccountProds() {
            let that = this;
            that.$axios
                .post(url.openAccountProds, {
                    params: {
                        loanNo: getLocalStorage("loanNo")
                    }
                })
                .then(res => {
                    if (res.data.code == "0000") {
                        that.bankList = res.data.result.data;

                        for (var i = 0; i < that.bankList.length; i++) {
                            var item = that.bankList[i];

                            if (item.chanNo == "045") {
                                that.openBankDetail = item;
                                break;
                            }
                        }
                    } else {
                        that.$vux.toast.text(res.data.msg, "top");
                    }
                });
        },
        openAccount() {
            let that = this;

            that.$axios
                .post(url.openAccountBefore, { params: that.params })
                .then(res => {
                    if (res.data.code == "0000") {
                        let { resultType, url } = res.data.result.data;
                        let { msg, bankMsg } = res.data.result;

                        //设置认证操作状态
                        that.setOpenBankAcctState();

                        //开户状态：1待开户；2已开户；0开户异常
                        if (resultType == "1") {
                            //显示小火箭
                            that.showRocket = true;

                            setTimeout(function() {
                                // 判断到底以哪种方式进行页面跳转 目前只有首金的是返回js代码
                                if (url.indexOf("<script") === -1) {
                                    window.location.href = url;
                                    return false;
                                }

                                let node = document.createElement("div");
                                node.id = "innerHtmlContainer";
                                document.body.appendChild(node);
                                document.querySelector(
                                    "#innerHtmlContainer"
                                ).innerHTML = url.split("<script")[0];
                                document.querySelector("#innerHtmlContainer form").submit();
                            }, 2000);
                        } else if (resultType == "2") {
                            that.$vux.toast.text(bankMsg || msg, "top");
                        } else if (resultType == "0") {
                            //与已开户银行卡号不一致
                            that.$vux.toast.text(bankMsg || msg, "top");
                        }

                        that.showAccountView = false;
                    } else {
                        that.$vux.toast.text(res.data.msg, "top");
                    }
                });
        },
        setOpenBankAcctState() {
            let that = this;
            let chanNo = that.params.chanNo;
            let obj = {};

            //本地是否存在，存在就追加
            if (that.state) {
                let localState = JSON.parse(
                    getLocalStorage("openBankAcctState")
                );
                localState[chanNo] = 1;
                setLocalStorage(
                    "openBankAcctState",
                    JSON.stringify(localState)
                );
            } else {
                obj[chanNo] = 1;
                setLocalStorage("openBankAcctState", JSON.stringify(obj));
            }
        },
        toBind() {
            let that = this;

            that.agreementUrl = that.openBankDetail.agreementUrl;
            that.params.chanNo = that.openBankDetail.chanNo;

            that.showAccountView = true;
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
                            that.$vux.toast.text("跳转地址有误", "top");
                        }
                    } else {
                        that.$vux.toast.text(result.msg, "top");
                    }
                })
                .catch();
        },
        authorizeEvent(type) {
            //授权相关功能
            let that = this;
            //type: 1是授权；2是取消授权；3是变更授权
            if (type == 1) {
                that.authJson.handlerType = "48500001";
            } else if (type == 2) {
                that.authJson.handlerType = "48500003";
            } else if (type == 3) {
                that.authJson.handlerType = "48500002";
            }
            that.$axios
                .post(url.authChange, { params: that.authJson })
                .then(function(res) {
                    let result = res.data;
                    if (result.code == "0000") {
                        if (result.result.data) {
                            window.location.href = result.result.data.url;
                        } else {
                            that.$vux.toast.text(result.result.msg, "top");
                        }
                    } else {
                        that.$vux.toast.text(result.msg, "top");
                    }
                })
                .catch();
        },
        logoutEvent() {
            //注销操作
            let that = this;
            that.$axios
                .post(url.destroyAcct, { params: that.logoutJson })
                .then(function(res) {
                    let result = res.data;
                    if (result.code == "0000") {
                        if (result.result.code == "31700002") {
                            window.location.href = result.result.url;
                        } else {
                            that.$vux.toast.text(result.result.msg, "top");
                        }
                    } else {
                        that.$vux.toast.text(result.msg, "top");
                    }
                })
                .catch();
        },
        closeAcctInfo(v){
            this.showAcctInfo = v
        },
        closeUpdateAccount(v){
            this.showUpdateAccount = v
        },
        back() {
            let that = this;
            that.$router.push("openBankAcct");
        }
    }
};
</script>
