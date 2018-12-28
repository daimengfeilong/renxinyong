<style lang="less">

</style>

<template>
    <div id="wrapper">
        <group label-width="6.5em" class="group-input-right">
            <div class="box p15">
                <div class="pr25">账户类型</div>
                <div
                    class="flex-1"
                    v-for="item in tabs"
                    :key="item.value"
                    @click="itemChose(item)"
                >
                    <img
                        src="@/assets/image/person/check_Icon_Chose@2x.png"
                        v-if="item.checked"
                        style="width:14px;"
                        alt
                    >
                    <img
                        src="@/assets/image/person/check_Icon_Default@2x.png"
                        v-else
                        style="width:14px;"
                        alt
                    >
                    <label class="middle">{{item.name}}</label>
                </div>
            </div>
            <x-input title="原银行卡号" type="tel" v-model="params.oldBankCode" :max="20" placeholder="请输入原银行卡号"></x-input>
            <popup-picker title="原开户行" :data="bankOrgData" v-model="oldBankOrg" placeholder="请选择原开户行" show-name></popup-picker>
            <x-input title="新银行卡号" type="tel" :max="20" v-model="params.accBankCard" placeholder="请输入新银行卡号"></x-input>
            <popup-picker title="新开户行" :data="bankOrgData" v-model="newBankOrg" placeholder="请选择新开户行" show-name></popup-picker>
        </group>
        <div class="btn-wrap mt40">
            <a class="btn" @click="submit">提交</a>
        </div>
    </div>
</template>

<script>
import { XInput, Group, PopupPicker } from "vux";
import { checkBankCard } from "@/assets/js/utils.js";

export default {
    components:{
        XInput,
        Group,
        PopupPicker,
    },
    data () {
        return {
            bankOrgData: [],
            oldBankOrg: [],
            newBankOrg: [],
            tabs: [
                {
                    checked: true,
                    name: "还款账户",
                    value: "B6801"
                },
                {
                    checked: false,
                    name: "放款账户",
                    value: "B6802 "
                }
            ],
            params:{
                chanNo:'045',// 渠道编号
                loanNo:getLocalStorage("loanNo"),// 贷款编号
                accType:"B6801",// 账户类型(B6801 还款账户,B6802 放款账户)
                accBankCard:"",// 银行卡号
                accBankName:"",// 开户行
                oldBankName:"",// 原开户行
                oldBankCode:"",// 原银行卡号
            }
        }
    },
    mounted () {
        let that = this;

        that.$axios
            .post(url.query, { params: { list: [{ type: "OPEN_ORG" }] } })
            .then(res => {
                if (res.data.code == "0000") {
                    that.bankOrgData = that.toData(res.data.result.OPEN_ORG);
                }else {
                    that.$vux.toast.text(res.data.msg, "top");
                }
            });
    },
    methods: {
        toData(data) {
            let that = this;

            //vux格式处理
            return [
                data.map(item => {
                    return { name: item.valName, value: item.valCode };
                })
            ];
        },
        itemChose(item) {
            this.tabs.map(item => (item.checked = false));

            item.checked = true;
            this.params.accType = item.value;
        },
        valid() {
            const { oldBankCode, accBankCard } = this.params;

            if(!checkBankCard(oldBankCode)){
                this.$vux.toast.text('请输入正确的原卡号', "top");
                return false;
            }if(!this.oldBankOrg[0]){
                this.$vux.toast.text('请选择原开户行', "top");
                return false;
            }else if(!checkBankCard(accBankCard)){
                this.$vux.toast.text('请输入正确的新卡号', "top");
                return false;
            }else if(!this.newBankOrg[0]){
                this.$vux.toast.text('请选择新开户行', "top");
                return false;
            }

            return true;
        },
        submit(){
            let that = this
            
            if(!this.valid()) return false;

            this.params.oldBankName = this.oldBankOrg[0]
            this.params.accBankName = this.newBankOrg[0]

            this.$axios
                .post(url.accountInfoModify, { params: this.params })
                .then(res => {
                    let { code, msg, result } = res.data;

                    if (code == "0000") {
                        this.$vux.toast.show({
                            type:'text',
                            text:"操作成功！",
                            time:2000,
                            onHide(){
                                that.$router.back()
                            }
                        });
                    } else {
                        this.$vux.toast.text(msg, "top");
                    }
                });
        }
    }
}
</script>