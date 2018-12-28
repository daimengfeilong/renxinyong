<style lang="less">
</style>

<template>
    <div id="wrapper">
        <group v-if="source != 'repay'">
            <cell title="重置开户密码" is-link @click.native="resetSignPwd">
                <img
                    slot="icon"
                    style="display:block;margin-right:10px;width:20px;"
                    src="@/assets/image/order/icon_zzkfmm.png"
                >
            </cell>
        </group>
        <group>
            <cell title="绑定新银行卡" is-link @click.native="bindBankCard">
                <img
                    slot="icon"
                    style="display:block;margin-right:10px;width:20px;"
                    src="@/assets/image/order/icon_bdyyk.png"
                >
            </cell>
        </group>
        <group>
            <cell title="更换开户银行卡" is-link link="changeOpenAcct">
                <img
                    slot="icon"
                    style="display:block;margin-right:10px;width:20px;"
                    src="@/assets/image/order/icon_ggkfyy.png"
                >
            </cell>
        </group>
        <group>
            <cell title="查看开户信息" is-link @click.native="showAcctInfo = true">
                <img
                    slot="icon"
                    style="display:block;margin-right:10px;width:20px;"
                    src="@/assets/image/order/icon_ckkfxx.png"
                >
            </cell>
        </group>
        <group v-if="source != 'repay'">
            <cell title="更改开户姓名/手机号" is-link @click.native="showUpdateAccount = true">
                <img
                    slot="icon"
                    style="display:block;margin-right:10px;width:20px;"
                    src="@/assets/image/order/icon_ggsj.png"
                >
            </cell>
        </group>
        <group>
          <cell title="账户授权" is-link @click.native="authorizeEvent">
            <img
              slot="icon"
              style="display:block;margin-right:10px;width:20px;"
              src="@/assets/image/order/icon_zhsq.png"
            >
          </cell>
        </group>
        <AccountInfo :show="showAcctInfo" @closeDialog="closeAcctInfo" v-if="showAcctInfo"></AccountInfo>
        <UpdateAccount
            :show="showUpdateAccount"
            @closeDialog="closeUpdateAccount"
        ></UpdateAccount>
        <Rocket v-if="showRocket"></Rocket>
    </div>
</template>

<script>
import { Group, Cell } from "vux";
import Rocket from "../common/Rocket";
import AccountInfo from "../common/order/AccountInfo";
import UpdateAccount from "../common/order/UpdateAccount";

export default {
    components: {
        Group,
        Cell,
        AccountInfo,
        UpdateAccount,
        Rocket
    },
    data() {
        return {
            showRocket: false, //火箭
            showAcctInfo: false, //显示查询开户信息弹窗
            showUpdateAccount: false, //更改姓名/手机号
            source: this.$route.query.source, //来源
            changePwdParams: {
                //重置密码
                chanNo: "045",
                certNo: getUserInfo("certNo"),
                loanNo: getLocalStorage("loanNo"),
                backUrl: window.location.href,
                pwd_success_url: window.location.href,
                pwd_fail_url: `${window.location.origin}/#/resetPwdError`,
                transaction_url: window.location.href
            },
            bindBankCardParams: {
                //绑定新银行卡
                chanNo: "045",
                certNo: getUserInfo("certNo"),
                loanNo: getLocalStorage("loanNo"),
                backUrl: window.location.href
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
          }
        };
    },
    mounted () {
      let that = this, certNo = getUserInfo('certNo')
      that.authJson.certNo = certNo
    },
    methods: {
        formSubmit(url) {
            let that = this;

            that.showRocket = true;
            setTimeout(() => {
                // 判断到底以哪种方式进行页面跳转 星火返回js代码
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
        },
        resetSignPwd() {
            let that = this;

            that.$axios
                .post(url.resetPasswd, { params: that.changePwdParams })
                .then(res => {
                    let { code, msg, result } = res.data;

                    if (code == "0000") {
                        that.formSubmit(result.url);
                    } else {
                        that.$vux.toast.text(msg, "top");
                    }
                });
        },
        closeAcctInfo(v) {
            this.showAcctInfo = v;
        },
        closeUpdateAccount(v) {
            this.showUpdateAccount = v;
        },
        bindBankCard() {
            let that = this;

            that.$axios
                .post(url.resetPasswd, { params: that.bindBankCardParams })
                .then(res => {
                    let { code, msg, result } = res.data;

                    if (code == "0000") {
                        that.formSubmit(result.url);
                    } else {
                        that.$vux.toast.text(msg, "top");
                    }
                });
        },
      authorizeEvent() {
        //授权
        let that = this;
        that.authJson.handlerType = "48500001";
        that.$axios.post(url.authChange, { params: that.authJson }).then(function(res) {
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
      }
    }
};
</script>
