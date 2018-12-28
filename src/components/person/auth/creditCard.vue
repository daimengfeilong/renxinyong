<style lang="less">
</style>

<template>
    <div id="wrapper">
        <group label-width="6em">
            <div class="vux-x-input weui-cell overlay">
                <div class="weui-cell__hd">
                    <label for="vux-x-input-dmo2t" class="weui-label" style="width: 6em;">持卡人</label>
                </div>
                <div class="weui-cell__bd weui-cell__primary">
                    <input id="vux-x-input-dmo2t" type="text" v-model="params.name" class="weui-input" v-stat="{key:'name',blur:'Cname',focus:'Cname'}">
                </div>
            </div>
            <x-input title="信用卡卡号" v-stat="{key:'creCarCod',blur:'CcreCar',focus:'CcreCar'}" :max="20" v-model="params.bank_card_num" placeholder="请输入信用卡号"></x-input>
        </group>
        <div class="p10 mt70">
            <a class="btn" @click="submit()" v-stat="{key:'Csub',click:'Csub'}">提交</a>
        </div>
        <p class="mt25 noCreditCard" @click="jumpThird">没有信用卡？申请其他产品→</p>
    </div>

</template>

<script>
import { XInput, XDialog, Group, Cell, PopupPicker } from "vux";
import { checkBankCard, saveAuth } from "../../../assets/js/utils.js";

export default {
    components: {
        XInput,
        Group,
        Cell,
        PopupPicker,
        XDialog
    },
    data() {
        return {
            params: {
                name: "",
                id_card_num: "",
                bank_card_num: ""
            },
            authType: AUTH_TYPE.credit,
            phoneNo: getLocalStorage("phoneNo"),
            baseInfo: {}
        };
    },
    mounted() {
        let that = this;

        //查询信息回显
        that.$axios
            .post(url.queryBaseInfo, {
                params: {
                    phoneNo: that.phoneNo
                }
            })
            .then(res => {
                if (!res.data.result.certNo) return false;

                that.baseInfo = res.data.result;
                that.params.name = that.baseInfo.custName;
                that.params.id_card_num = that.baseInfo.certNo;
            });
    },
    methods: {
        submit() {
            let that = this;

            if (!checkBankCard(that.params.bank_card_num)) {
                that.$vux.toast.text("请输入15-19位信用卡号", "top");
                return false;
            }

            that.$axios
                .post(url.getBankCardInfo, { params: that.params })
                .then(res => {
                    if (res.data.code === "0000") {
                        let {
                            card_type,
                            is_matched
                        } = res.data.result.bankInfo;

                        //银行卡类别，DC:借记卡、CC:贷记卡、SCC:准贷记卡、PC:预付费卡、null:未知
                        if (is_matched) {
                            //是否是本人
                            if (card_type === "CC") {
                                //是否信用卡
                                saveAuth(that.authType, data => {
                                    that.$vux.toast.show({
                                        text: "认证成功",
                                        onHide() {
                                            setLocalStorage(
                                                "creditNo",
                                                that.params.bank_card_num
                                            );
                                            that.$router.push("authentication");
                                        }
                                    });
                                });
                            } else {
                                that.$vux.toast.text("请使用信用卡认证", "top");
                            }
                        } else {
                            that.$vux.toast.text(
                                "身份证、姓名和银行卡不匹配",
                                "top"
                            );
                        }
                    } else {
                        that.$vux.toast.text(res.data.msg, "top");
                    }
                });
        },
        jumpThird() {
            const that = this;
            window.location.href = "http://wechat-dmz.boyacx.com/views/index.html?phoneNo="+that.phoneNo;
        }
    }
};
</script>
