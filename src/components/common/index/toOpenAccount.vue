<style lang="less">
</style>
<template>
    <div>
        <div class="contract-window">
            <div class="contract-window-cnt">
                <div class="contract-window-list">
                    <p class="pt25 fs18">请完成开户</p>
                    <ul class="pt25 contract-loanList fs14">
                        <li v-for="(item, index) in loanList" :key="index" :class="{activeItem: index==isActive}" @click="selectLoan(item.loanNo, index)">{{ item.prodName | reStrBracket }}
                        </li>
                    </ul>
                    <div class="mt30">
                        <span class="btn" @click="clickOpen">去开户</span>
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

        <div v-transfer-dom>
            <confirm v-model="showConfirm" title="温馨提示" :close-on-confirm="false" @on-cancel="onCancel" @on-confirm="openAccount(currentLoanNo)">
                <p style="text-align:left;">为保证正常放款,开户银行卡与绑定储蓄卡必须一致</p>
                <p class="color-3 bankNo">卡号 &nbsp;{{ bankCardNo }}</p>
                <p class="readPact" v-if="hasAgreementUrl">
                    <check-icon :value.sync="checked"></check-icon>
                    我已阅读并同意
                    <span @click="toAgreementUrl">《银行存管授权委托书》</span>
                </p>
            </confirm>
        </div>
    </div>
</template>
<script>
import { CheckIcon, Confirm, TransferDomDirective as TransferDom } from "vux";

export default {
    name: "app",
    props: ["allLoanData"],
    data() {
        return {
            loanList: [],
            currentLoanNo: "",
            isActive: 0,
            showConfirm: false,
            checked: true,
            bankCardNo: "",
            hasAgreementUrl: true
        };
    },
    directives: {
        TransferDom
    },
    components: {
        CheckIcon,
        Confirm
    },
    created() {
        this.initInfo();
    },
    methods: {
        initInfo() {
            const that = this;

            if (
                that.allLoanData.loanStatus == "31000013" &&
                that.allLoanData.accountStat == "44300002"
            ) {
                that.loanList.push({
                    prodName: "信用分期",
                    loanNo: that.allLoanData.loanNo
                });
            }
            if (
                that.allLoanData.childLoanStat == "31000013" &&
                that.allLoanData.childLoanAccountStat == "44300002"
            ) {
                that.loanList.push({
                    prodName: "保险分期",
                    loanNo: that.allLoanData.childLoanNo
                });
            }

            if (that.loanList.length > 0) {
                that.currentLoanNo = that.loanList[0].loanNo;
            }

            if (!that.allLoanData.agreementUrl) {
                //判断是否显示勾选银行存管授权委托书
                that.hasAgreementUrl = false;
            }
        },
        selectLoan(loanNo, index) {
            const that = this;
            that.isActive = index;
            that.currentLoanNo = loanNo;
        },
        clickOpen() {
            const that = this;

            that.$parent.isOpen = false;
            that.$vux.confirm.show({
                title: "温馨提示",
                content: "响应监管要求，为保护您的个人权益，请您完成开户。",
                confirmText: "去开户",
                onCancel() {
                    that.$vux.confirm.hide();
                },
                onConfirm() {
                    if (that.allLoanData.acctNo) {
                        that.bankCardNo =
                            that.allLoanData.acctNo.substr(0, 4) +
                            " **** **** " +
                            that.allLoanData.acctNo.substr(
                                that.allLoanData.acctNo.length - 4
                            );
                    }
                    that.showConfirm = true;
                }
            });
        },
        onCancel() {
            this.showConfirm = false;
        },
        openAccount(currentLoanNo) {
            const that = this;
            const origin = window.location.origin;

            if (that.checked) {
                that.onCancel();
                that.$axios
                    .post(url.openAccount, {
                        params: {
                            loanNo: currentLoanNo,
                            prodNo: getLocalStorage("prodNo"),
                            phoneNo: getLocalStorage("phoneNo"),
                            backUrl: origin + "/#/success",
                            errorUrl: origin + "/#/success"
                        }
                    })
                    .then(function(res) {
                        const result = res.data;
                        if (result.code == "0000") {
                            if (result.result.bankMsg) {
                                that.$router.push({
                                    path: "/bankCard",
                                    query: {
                                        loanNo: currentLoanNo,
                                        source: `prodIntrod/${getLocalStorage(
                                            "channelVal"
                                        )}`,
                                        returnMsg: result.result.msg
                                    }
                                });
                            } else if (result.result.data.resultType == "1") {
                                that.$emit('onShow',true)

                                setTimeout(function(){
                                    if (result.result.data.isH5 == "13900001") {
                                        let bankInfoContainer = (document.getElementById(
                                            "bankInfoContainer"
                                        ).innerHTML = result.result.data.url.result.split(
                                            "<script"
                                        )[0]);
                                        document.getElementById("submit").click();
                                    } else {
                                        setLocalStorage("path", "prodIntrod");
                                        window.location.href =
                                            result.result.data.url;
                                    }
                                },2000)
                            } else if (result.result.data.resultType == "2") {
                                that.$vux.toast.show({
                                    text: result.result.msg,
                                    onHide() {
                                        location.reload();
                                    }
                                });
                            } else {
                                that.$vux.toast.text(result.result.msg);
                            }
                        } else {
                            that.$vux.toast.text(result.msg);
                        }
                    })
                    .catch(function(err) {
                        console.log(err.data);
                    });
            } else {
                that.$vux.toast.text("请先阅读银行存管授权委托书");
            }
        },
        toAgreementUrl() {
            const that = this;
            window.location.href = that.allLoanData.agreementUrl;
        },
        cancelContract() {
            const that = this;
            that.$parent.isOpen = false;
        }
    }
};
</script>
