<style lang='less'>
</style>

<template>
    <div id='wrapper' class="spacing index-module">
        <swiper loop auto :list="banner_list" :aspect-ratio="140/375" :show-desc-mask="false" dots-position="center"></swiper>
        <div class="index-content">
            <div class="status-module">
                <apply-loan v-if="userStatus==1" :loanData="loanData"></apply-loan>
                <status-components v-if="userStatus==2" :loanData="loanData"></status-components>
            </div>
            <!--<div class="product-merit box mt20 mb15">-->
            <!--<div>-->
            <!--<img src="./../assets/image/index/icon_1.png" alt="">-->
            <!--<p>无抵押</p>-->
            <!--</div>-->
            <!--<div>-->
            <!--<img src="./../assets/image/index/icon_2.png" alt="">-->
            <!--<p>额度高</p>-->
            <!--</div>-->
            <!--<div>-->
            <!--<img src="./../assets/image/index/icon_3.png" alt="">-->
            <!--<p>放款快</p>-->
            <!--</div>-->
            <!--<div>-->
            <!--<img src="./../assets/image/index/icon_4.png" alt="">-->
            <!--<p>利率低</p>-->
            <!--</div>-->
            <!--</div>-->
        </div>

        <!--未通过弹窗提示-->
        <!--<div v-transfer-dom>-->
        <!--<confirm v-model="isRefuse"-->
        <!--confirm-text="快速领钱通道"-->
        <!--cancel-text="稍后再说"-->
        <!--@on-cancel="onCancel"-->
        <!--@on-confirm="toMoreLoan()">-->
        <!--<div class="refuse-img">-->
        <!--<img src="../assets/image/index/icon_refuse.png" alt="">-->
        <!--</div>-->
        <!--<p class="refuse-tit">您的资料暂被拒绝</p>-->
        <!--<p class="refuse-explain">系统给出的综合信用评分不足</p>-->
        <!--<div class="more-btn" v-stat="{key: 'Cm6aplOrt', click: 'Cm6aplOrt'}" @click="toMoreLoan">-->
        <!--<span>点击按钮优选更多贷款服务</span>-->
        <!--</div>-->
        <!--</confirm>-->
        <!--</div>-->
        <div v-show="isRefuse" class="refuse-module" id="refuse-module">
            <div class="refuse-module-cnt">
                <p><img src="../assets/image/index/close.png" name="close" @click="closeThis" alt=""></p>
                <div>
                    <iframe :src="iframeSrc" frameborder="0" width="100%" height="100%"></iframe>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Swiper } from "vux";
import applyLoan from "./common/index/applyLoan.vue";
import statusComponents from "./common/index/statusComponents.vue";
import { Confirm, TransferDomDirective as TransferDom } from "vux";
import { GetChannel } from "./common/mixin/GetChannel";

export default {
    data() {
        return {
            banner_list: [],
            userStatus: 0,
            loanData: {},
            isRefuse: false,
            iframeSrc: ""
        };
    },
    directives: {
        TransferDom
    },
    components: {
        Swiper,
        applyLoan,
        statusComponents,
        Confirm
    },
    mixins: [GetChannel], //获取Token,获取渠道
    created() {
        const that = this;
        that.init();
    },
    mounted() {
        let that = this;

        document.querySelector("body").style.background = "#5abce4";
        if (getLocalStorage("channelVal") === "virtual") {
            //虚拟标签
            this.bindChannel();
        }
    },
    beforeDestroy() {
        document.querySelector("body").style.background = "#f7f7f9";
    },
    methods: {
        init() {
            if (getQueryString("mobile")) {
                removeLocalStorage("token");
                this.autoLogin();
                return false;
            }
            if (!getLocalStorage("openId") && navigator.userAgent.indexOf('MicroMessenger') > -1) {
              this.wxLoginAuth()
            }
            this.getBanner();
            this.getStatus();
            this.getRefuseLoan();
        },
        wxLoginAuth () {
          let appid = "wxc1e277d2de839298", redirect = wx_h5_url + "/#/getCode"
          let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(redirect)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
          window.location.href = url;
        },
        getBanner() {
            //获取banner图
            const that = this;
            that.$axios
                .post(url.getPictureAD, {
                    params: {
                        sourceOsType: getLocalStorage("sourceOsType"),
                        applyApp: "30500088"
                    }
                })
                .then(function(res) {
                    const result = res.data;
                    const resultArr = result.result;
                    const resultLength = resultArr.length;
                    if (resultLength > 0) {
                        let bannerArr = [];
                        for (var i = 0; i < resultLength; i++) {
                            let bannerObj = {
                                url: resultArr[i].adUrl,
                                img: resultArr[i].pictureUrl
                            };
                            //如果是分享链接，拼接参数
                            if (resultArr[i].adUrl.indexOf("activityDetail") != -1) {
                              bannerObj.url = `${resultArr[i].adUrl}?invPhoneNo=${getLocalStorage("phoneNo")}&sourceType=${SOURCE_TYPE}&token=${getLocalStorage("token")}`;
                            }
                            bannerArr.push(bannerObj);
                        }
                        that.banner_list = bannerArr;
                    }
                })
                .catch(function(err) {
                    console.log(err.data);
                });
        },
        getStatus() {
            //获取首页最近一笔贷款的信息
            const that = this;
            that.$axios
                .post(url.getLoanStatus, {
                    params: {
                        phoneNo: getLocalStorage("phoneNo")
                    }
                })
                .then(function(res) {
                    const result = res.data;
                    const stat = result.result.stat; //贷款状态码
                    const subLoanCredit = result.result.subLoanCredit; //信用是否充足，1充足，0不充足

                    let acctNo = ""; //银行卡号
                    let childLoanNo = ""; //子贷款的编号
                    let childLoanStat = ""; //子贷款的状态
                    let childLoanAccountStat = ""; //用作判断子贷款是否开户
                    if (result.result.bankAcct) {
                        acctNo = result.result.bankAcct.acctNo;
                    }
                    if (result.result.subLoanLater) {
                        childLoanNo = result.result.subLoanLater.loanNo;
                        childLoanStat = result.result.subLoanLater.stat;
                        childLoanAccountStat = result.result.subLoanLater.accountStat;
                    }

                    if (result.code == "0000") {
                        setLocalStorage("prodNo", result.result.prodNo);
                        that.loanData = {
                            subLoanCredit: subLoanCredit,
                            loanStatus: stat,
                            loanLimit: result.result.loanAmt,
                            loanNo: result.result.loanNo,
                            instNum: result.result.instNum,
                            mthRepayAmt: result.result.mthRepayAmt,
                            mthRepayDate: result.result.mthRepayDate,
                            accountStat: result.result.accountStat, //用作判断是否开户
                            agreementUrl: result.result.agreementUrl, //银行存管授权委托书链接地址
                            acctNo: acctNo,
                            cashStat: result.result.cashStat, //是否可提现字段，44500001为可提现
                            childLoanNo: childLoanNo,
                            childLoanStat: childLoanStat,
                            childLoanAccountStat: childLoanAccountStat
                        };

                        if (stat) {
                            if (subLoanCredit == 0) {
                                //信用不足
                                that.userStatus = 2;
                            } else {
                                //信用充足
                                let statArr = [
                                    "31000001",
                                    "31000003",
                                    "31000007",
                                    "17700004"
                                ];
                                if (statArr.indexOf(stat) > -1) {
                                    // 显示默认组件
                                    that.userStatus = 1;
                                } else {
                                    // 显示状态组件
                                    that.userStatus = 2;
                                }
                            }
                        } else {
                            // 显示默认组件
                            that.userStatus = 1;
                        }
                    } else {
                        that.$vux.toast.text(result.msg, "top");
                    }
                })
                .catch(function(err) {
                    console.log(err.data);
                });
        },
        getRefuseLoan() {
            const that = this;
            that.$axios
                .post(url.getRefuseLoan, {
                    params: {
                        phoneNo: getLocalStorage("phoneNo")
                    }
                })
                .then(function(res) {
                    const result = res.data;
                    if (result.code == "0000") {
                        setLocalStorage(
                            "refuseStat",
                            result.result.checkResult
                        );
                        if (result.result.checkResult == "13800002") {
                            that.iframeSrc = `${yinliu_URL}?mobile=${getLocalStorage("phoneNo")}&token=${getLocalStorage("token")}&target=h5`;
                            that.isRefuse = true;
                        }
                    } else {
                        that.$vux.toast.text(result.msg, "top");
                    }
                })
                .catch(function(err) {
                    console.log(err.data);
                });
        },
        toMoreLoan() {
            window.location.href = `${yinliu_URL}?mobile=${getLocalStorage(
                "phoneNo"
            )}&token=${getLocalStorage("token")}&target=h5`;
        },
        closeThis() {
            this.isRefuse = false;
            this.iframeSrc = `${yinliu_URL}?mobile=${getLocalStorage(
                "phoneNo"
            )}&token=${getLocalStorage("token")}&target=h5`;
        },
        bindChannel() {
            this.$axios
                .post(url.saveChannel, {
                    params: {
                        phoneNo: getLocalStorage("phoneNo"),
                        sourceOsType: getLocalStorage("sourceOsType"),
                        channelCode: getLocalStorage("channelCode"),
                        appType: "25800006"
                    }
                })
                .catch(error => {});
        },
        saveBrowseRecord() {
            let saveJson = {
                phoneNo: getQueryString("mobile"),
                sourceOsType: getLocalStorage("sourceOsType"), // 来源
                channNo: getLocalStorage("channelCode")
            };
            this.$axios
                .post(url.clientBrowseRecord, { params: saveJson })
                .then(response => {
                    if (response.data.code == "0000") {
                        // 将转码得到的用户的电话号码保存在本地缓存中
                        this.getTokenData.loginNo = response.data.result;
                        setLocalStorage("phoneNo", response.data.result);
                        this.getToken(
                            this.getBanner,
                            this.getStatus,
                            this.getRefuseLoan
                        );
                    } else {
                        this.$vux.toast.text(response.data.msg, "top");
                    }
                });
        },
        autoLogin() {
            if (
                this.channelList.isSaveBrowseRecord &&
                this.channelList.isSaveBrowseRecord === "0000"
            ) {
                // 针对360金融引流用户保存客户浏览记录
                this.saveBrowseRecord();
                return false;
            }
            setLocalStorage("channelCode", this.channelList.channelCode);
            setLocalStorage("channelVal", this.channelList.channelVal);
            setLocalStorage("sourceOsType", this.channelList.sourceOsType);
            this.getToken(this.getBanner, this.getStatus, this.getRefuseLoan);
        }
    }
};
</script>
