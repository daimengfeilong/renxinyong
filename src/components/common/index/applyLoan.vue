<style lang="less">
</style>

<template>
    <div id="wrapper" class="calc-wrap">
        <div class="topBg">
            <img src="../../../assets/image/index/topBg.png" alt="">
        </div>
        <div class="apply-module">
            <group label-width="6em">
                <x-input title="借款金额:" v-model="prodCalcParams.goodsAmt" @on-blur="handleVal()" placeholder-align="right" text-align="right" v-stat="{key:'lenAmo',blur:'lenAmo',focus:'ClenAmo'}" :max="10" type="tel" placeholder="请输入借款金额"></x-input>
                <!--<cell title="借款期限:" value-align="right">-->
                <!--<div class="staging-number">-->
                <!--<a :class="{'active':prodCalcParams.instNum == item}" v-stat="{key:'staTim',click:'staTim',value:item}" v-for="(item,index) in prodInstNum" :key="index" @click="chooseNum(item)">{{item}}期</a>-->
                <!--</div>-->
                <!--</cell>-->
                <popup-picker title="借款期限:" v-stat="{key:'lenDealin',click:'ClenDealin'}" :data="prodInstNum" v-model="prodInstNumDef" show-name @on-change="chooseNum(prodInstNumDef)" placeholder="请选择" value-text-align="right"></popup-picker>
                <popup-picker title="借款用途:" v-stat="{key:'lenUse',click:'ClenUse'}" :class="{'red':loanuseDef[0] != '42700001'}" :data="loanuseData" show-name v-model="loanuseDef" placeholder="请选择" value-text-align="right"></popup-picker>
                <cell value-align="right" class="trial-tr">
                    <span class="color" style="text-decoration: underline;" @click="getProdCalc('calc')" v-stat="{key:'CsplTri',click:'CsplTri'}">分期试算</span>
                </cell>
            </group>
            <group v-if="feeNosData.length">
                <div class="checkbox-list">
                    <div class="item" v-for="item in feeNosData" :key="item.id" @click="chooseFee(item)">
                        <img src="@/assets/image/person/check_Icon_Chose@2x.png" v-if="item.isSel" alt="">
                        <img src="@/assets/image/person/check_Icon_Default@2x.png" v-else alt="">
                        <label for="">{{item.feeName}}</label>
                    </div>
                </div>
            </group>
            <group v-if="agreList.length">
                <div class="checkbox-list">
                    <div class="item" v-for="(item, index) in agreList" :key="index">
                        <span @click="item.viewStatus = !item.viewStatus">
                            <img src="@/assets/image/person/check_Icon_Chose@2x.png" v-if="item.viewStatus" alt="">
                            <img src="@/assets/image/person/check_Icon_Default@2x.png" v-else alt="">
                        </span>
                        <label for="">
                            <a :href="item.url" class="bule-link">《{{item.name}}》</a>
                        </label>
                    </div>
                </div>
            </group>
            <div class="p15 mt5">
                <a class="btn-index radius5" @click="getProdCalc('submit')" v-stat="{key:'CappSpl',click:'CappSpl'}">申请分期</a>
            </div>
            <p v-if="showAgreement" class="loan-point mt5">点击“申请分期”视为同意
                <a href='http://apk.boyacx.com/jifen/renxinyong_agreement.html' v-stat="{key:'CregPro',click:'CregPro'}">《注册协议》</a>
            </p>

            <img class="bottomBg" src="../../../assets/image/index/bottomBg.png" alt="">
        </div>

        <div v-transfer-dom>
            <x-dialog v-model="showProdNum" hide-on-blur :dialog-style="{'max-width': '90%','border-rudius':'10px', width: '100%', height: '50%', 'background-color': 'transparent'}">
                <div class="prod-num">
                    <div class="pn-head box">
                        <div class="flex-1">分期期数</div>
                        <div class="flex-1">每期应还</div>
                        <div class="flex-1 mr30">每期还款日</div>
                    </div>
                    <div class="pn-body">
                        <div class="item box" v-for="item in prodNumArr" :key="item.instNum">
                            <div class="flex-1">{{item.instNum}}</div>
                            <div class="flex-1">{{item.mthAmt}}</div>
                            <div class="flex-1 mr30">{{item.busiDate}}</div>
                        </div>
                    </div>
                </div>
                <x-icon type="ios-close-outline" @click="showProdNum = false" style="fill:#fff;margin-top:20px;width:45px;height:45px;"></x-icon>
            </x-dialog>
        </div>

    </div>

</template>

<script>
import {
    XInput,
    XDialog,
    Group,
    Cell,
    PopupPicker,
    TransferDomDirective as TransferDom
} from "vux";
import { checkPrice } from "../../../assets/js/utils.js";

export default {
    directives: {
        TransferDom
    },
    components: {
        XInput,
        Group,
        Cell,
        PopupPicker,
        XDialog
    },
    props: ["loanData"],
    data() {
        return {
            prodCalcParams: {
                prodNo: "",
                instNum: "",
                goodsAmt: "",
                payAmt: "0",
                feeNos: []
            },
            prodSaveParams: {
                custName: getUserInfo("custName"),
                loanNo: "",
                fileNo: "123",
                sourceUserType: SOURCE_USER_TYPE,
                sourceOsType: getLocalStorage("sourceOsType"),
                sourceType: SOURCE_TYPE,
                loanAmt: "",
                mthRepayAmt: "",
                fstRepayDate: "",
                prodNo: "",
                instNum: "",
                feeNos: ""
            },
            agreList: [], //投保协议列表
            feeNosData: [], //分期列表数据
            feeNosDef: [],
            f2201: true,
            showProdNum: false,
            prodInstNum: [], //分期期限
            prodInstNumDef: [],
            loanuseData: [], //分期用途
            loanuseDef: [],
            prodNumArr: [], //分期数
            phoneNo: getLocalStorage("phoneNo"),
            maxAmt: 0, //最大金额
            minAmt: 0, //最小金额
            tbxz: true, //投保需知
            bxtk: true, //保险条款
            showAgreement: getQueryString("mobile") ? true : false
        };
    },
    created() {
        let that = this;
        that.initInfo();
    },
    methods: {
        initInfo() {
            const that = this;
            that.queryLoan();
            that.getProd();
        },
        queryAgreementInfo(prodNo) {
            let that = this;

            //获取协议
            that.$axios
                .post(url.queryAgreementInfo, {
                    params: {
                        prodNo: prodNo
                    }
                })
                .then(res => {
                    if (res.data.code == "0000") {
                        that.agreList = res.data.result;
                    }
                });
        },
        getProd() {
            const that = this;
            that.$axios
                .post(url.getSaleProd, {
                    params: {
                        sourceOsType: getLocalStorage("sourceOsType")
                    }
                })
                .then(function(res) {
                    let result = res.data;
                    if (result.code == "0000") {
                        if(!result.result.length){                            
                            that.$vux.toast.show({
                                type:'text',
                                text:'该渠道暂未启用',
                                position:'top',
                                time:5000
                            });
                        }
                        if (result.result.length > 0) {
                            setLocalStorage("prodNo", result.result[0].prodNo);
                          that.prodCalcParams.prodNo = result.result[0].prodNo
                          that.prodSaveParams.prodNo = result.result[0].prodNo
                            that.queryProdInfo(result.result[0].prodNo);
                          that.queryProdInstNum(result.result[0].prodNo);
//                          that.queryCustProdFee(result.result[0].prodNo)
//                          that.queryAgreementInfo(result.result[0].prodNo)
                        }
                    }
                });
        },
        queryLoan() {
            let that = this;

            //分期用途
            that.$axios
                .post(url.query, {
                    params: { list: [{ type: "Loan_Use" }] }
                })
                .then(res => {
                    that.loanuseData = that.toData(res.data.result.Loan_Use);
                    that.loanuseDef[0] = that.loanuseData[0][0].value;
                });
        },
        queryProdInstNum(prodNo) {
            let that = this;

            //分期数
            that.$axios
                .post(url.queryProdInstNum, {
                    params: { prodNo: prodNo }
                })
                .then(res => {
                    //          that.prodInstNum = res.data.result;
                    that.prodInstNum = that.toInstNumData(res.data.result);
                    that.prodInstNumDef[0] = that.prodInstNum[0][0].value;
                    that.prodCalcParams.instNum = that.prodInstNumDef[0];
                });
        },
        queryCustProdFee(prodNo) {
            let that = this;

            //客户可选的产品费用项查询
            that.$axios
                .post(url.queryCustProdFee, {
                    params: {
                        prodNo: prodNo,
                        instNum: "12"
                    }
                })
                .then(res => {
                    if (!res.data.result.length) return false;

                    that.feeNosData = res.data.result;

                    that.feeNosData.map(item => {
                        that.feeNosDef.push(item.feeNo);
                        return (item.isSel = true);
                    });
                });
        },
        queryProdInfo(prodNo) {
            let that = this;

            //获取产品信息
            that.$axios
                .post(url.queryProdInfo, {
                    params: {
                        prodNo: prodNo
                    }
                })
                .then(res => {
                    let {
                        maxAmt,
                        minAmt,
                        isCredit,
                        isEasyCard,
                        isFund,
                        isOwner,
                        isSel,
                        isSplitLoan,
                        isVip,
                      isCheckPolicy
                    } = res.data.result;
                    const isAuth = {
                        isCredit: that.isNO(isCredit), //是否信用卡产品
                        isEasyCard: that.isNO(isEasyCard),
                        isFund: that.isNO(isFund), //是否公积金产品
                        isOwner: that.isNO(isOwner), //是否是车主贷
                        isSel: that.isNO(isSel), //是否需要选择商品
                        isSplitLoan: that.isNO(isSplitLoan),
                        isVip: that.isNO(isVip) //是否办理全机审流程的产品
                    };
                    setLocalStorage("isAuth", JSON.stringify(isAuth));
                    setLocalStorage("isCheckPolicy", isCheckPolicy);
                    that.maxAmt = maxAmt;
                    that.minAmt = minAmt;
                });
        },
        toData(data) {
            let that = this;

            //vux格式处理
            return [
                data.map(item => {
                    return { name: item.valName, value: item.valCode };
                })
            ];
        },
        toInstNumData(data) {
            let that = this;

            //vux格式处理
            return [
                data.map(item => {
                    return { name: `${item}个月`, value: item };
                })
            ];
        },
        chooseFee(item) {
            let that = this;

            if (item.isChoice == "13900001") {
                that.$vux.toast.text("不可取消", "top");
                return false;
            }
            //反选
            item.isSel = !item.isSel;

            //追加已选择值
            if (that.feeNosDef.indexOf(item.feeNo) == -1) {
                that.feeNosDef.push(item.feeNo);
            } else {
                that.feeNosDef = that.feeNosDef.filter(v => v != item.feeNo);
            }
        },
        chooseNum(val) {
            let that = this;
            that.prodCalcParams.instNum = val[0];
        },
        getProdCalc(type) {
            let that = this;
            let { goodsAmt } = that.prodCalcParams;

            //        if(type == 'submit'){
            //协议检测
            //          if(that.agreList.length){
            //            for(let item of that.agreList){
            //              if(!item.viewStatus){
            //                that.$vux.toast.text("请确认勾选相关须知和条款协议", "top");
            //                return false;
            //              }
            //            }
            //          }
            //        }

            if (that.loanuseDef[0] != "42700001") {
                that.$vux.toast.text("分期用途仅且只能选择日常消费", "top");
                return false;
            } else if (!goodsAmt) {
                that.$vux.toast.text("请输入分期金额", "top");
                return false;
            } else if (!checkPrice(goodsAmt)) {
                that.$vux.toast.text("分期金额只支持正整数", "top");
                return false;
            } else if (parseInt(goodsAmt) < that.minAmt || parseInt(goodsAmt) > that.maxAmt) {
                that.$vux.toast.text(
                    `贷款金额范围:${that.minAmt}--${that.maxAmt}`,
                    "top"
                );
                return false;
            }

            that.prodCalcParams.feeNos = that.feeNosDef.join(",");

            that.$axios
                .post(url.prodCalc, { params: that.prodCalcParams })
                .then(res => {
                    if (res.data.code == "0000") {
                        that.prodNumArr = res.data.result;
                        if (type == "submit") {
                            that.submit(res.data.result[0]);
                        } else {
                            that.showProdNum = true;
                        }
                    } else {
                        that.$vux.toast.text(res.data.msg, "top");
                        return false;
                    }
                });
        },
        submit(data) {
            let that = this;
            let { instNum, goodsAmt, feeNos } = that.prodCalcParams;

            that.prodSaveParams.instNum = instNum;
            that.prodSaveParams.loanAmt = goodsAmt;
            that.prodSaveParams.mthRepayAmt = data.mthAmt;
            that.prodSaveParams.fstRepayDate = data.busiDate;
            that.prodSaveParams.feeNos = feeNos;

            that.$axios
                .post(url.saveProdTrial, {
                    params: that.prodSaveParams
                })
                .then(res => {
                    setLocalStorage("loanNo", res.data.result.loanNo);
                    setLocalStorage("loanAmt", that.prodSaveParams.loanAmt);
                    setLocalStorage("instNum", that.prodSaveParams.instNum);

                    //清除认证
                    removeLocalStorage('authItems')
                    removeLocalStorage('openBankAcctState')
                    
                    that.$router.push("/face");

                });
        },
        isNO(val) {
            return val == "13900001";
        },
        handleVal () {
          const that = this
          if (that.prodCalcParams.goodsAmt) {
            let value = parseInt(that.prodCalcParams.goodsAmt), round = Math.round(value / 100)
            that.prodCalcParams.goodsAmt = (round * 100).toString()
          }
        }
    }
};
</script>
