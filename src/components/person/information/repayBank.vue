<style lang="less">
</style>

<template>
    <div id="wrapper">
        <group label-width="6.5em" class="service">
            <x-input title="银行卡号:" v-stat="{key:'banCod',blur:'CbanCod',focus:'CbanCod'}" type="tel" :max="20" name="acctNo" ref="acctNo" v-model="params.acctNo" :is-type="bankCard" placeholder="请输入银行卡号" required></x-input>
            <x-input title="银行卡类型:" v-stat="{key:'banTyp',blur:'CbanTyp',focus:'CbanTyp'}" placeholder="请输入银行卡类型" value="储蓄卡" readonly></x-input>
            <x-input title="手机号:" v-stat="{key:'phoNum',blur:'CphoNum',focus:'CphoNum'}" readonly :max="11" type="tel" name="phoneNo" ref="phoneNo" v-model="params.phoneNo" placeholder="请输入手机号" required is-type="china-mobile"></x-input>
            <x-input title="验证码:" v-stat="{key:'notCod',blur:'CnotCod',focus:'CnotCod'}" :max="6" name="validateCode" ref="validateCode" placeholder="请输入验证码" required v-model="params.validateCode">
                <a slot="right" class="btn-outline disabled bor0" v-if="disabled">
                    <span>{{timeNum}}</span>秒后可重发</a>
                <a slot="right" class="btn-outline" v-else @click="getCaptcha" v-stat="{key:'CgetNotCod',click:'CgetNotCod'}">获取验证码</a>
            </x-input>
        </group>
        <div class="p15">
            <p class="warnColor2">*银行卡号与银行预留手机号须匹配</p>
            <p class="warnColor2">*您必须填写您的真实姓名、身份证号码银行卡号以及银行预留手机号；虚假身份信息将无法完成放款。</p>
        </div>
        <div class="p10 mt50">
            <a class="btn" @click="getBankCardInfo" v-stat="{key:'Csub',click:'Csub'}">提交</a>
        </div>
    </div>
</template>

<script>
import { XInput, Group, PopupPicker, Cell } from "vux";
import { checkPhone,checkBankCard } from "../../../assets/js/utils.js";

export default {
    components: {
        XInput,
        Group,
        PopupPicker,
        Cell
    },
    data() {
        return {
            params: {
                loanNo: getLocalStorage("loanNo"),
                phoneNo: getLocalStorage("phoneNo"),
                acctNo: "",
                validateCode: "",
                chanNo: "",
                transType: "",
                certNo: ""
            },
            bankCard (value) {
                return {
                    valid: checkBankCard(value),
                    msg: '请输入15-19位卡号'
                }
            },
            disabled: false,
            timeNum: 60
        };
    },
    mounted() {
        let that = this;
        
    },
    methods: {
        getCaptcha() {
            let that = this;     
            let refs = that.$refs
            let acctEl = refs['acctNo']
            let phoneEl = refs['phoneNo']
            let { loanNo, phoneNo, acctNo } = that.params;
            let msgJson = {
                loanNo: loanNo, //贷款编号
                phoneNo: phoneNo, //电话号码
                acctNo: acctNo //银行卡号
            };     

            if(!acctEl.valid){
                let title = acctEl.title.replace(':','')
                let {required,format} = acctEl.errors
                
                if(required){
                    that.$vux.toast.text(`${title}${required}`, "top");
                    return false;
                }

                if(format){
                    that.$vux.toast.text(format, "top");
                    return false;
                }         
            }

            if(!phoneEl.valid){
                let title = phoneEl.title.replace(':','')
                let {required,format} = phoneEl.errors
                
                if(required){
                    that.$vux.toast.text(`${title}${required}`, "top");
                    return false;
                }

                if(format){
                    that.$vux.toast.text(format, "top");
                    return false;
                }        
            }

            that.$axios
                .post(url.repaymentSendMsg, { params: msgJson })
                .then(res => {
                    if (res.data.result.code === "13900001") {
                        that.sendCode();
                        that.$vux.toast.text("发送验证码成功", "top");
                        that.params.transType = res.data.result.transType
                    } else {
                        that.$vux.toast.text(res.data.result.msg, "top");
                    }
                });
        },
        sendCode() {
            let that = this;

            if (that.timeNum == 0) {
                that.disabled = false;
                that.timeNum = 60;
            } else {
                that.disabled = true;
                that.timeNum--;
                setTimeout(function() {
                    that.sendCode();
                }, 1000);
            }
        },
        valid(title,errors){
            let that = this
            let {required,format} = errors;
            title = title.replace(':','')

            if(required){
                that.$vux.toast.text(`${title}${required}`, "top");
                return false;
            }

            if(format){
                that.$vux.toast.text(format, "top");
                return false;
            }
        },
        getBankCardInfo(){
            //四要素验证
            let that = this
            let refs = that.$refs
            
            for(let i in refs){
                let item = refs[i]
                let title = item.title.replace(':','')
                let name = item.name


                let {required,format} = item.errors;

                if(required){
                    that.$vux.toast.text(`${title}${required}`, "top");
                    return false;
                }

                if(format){
                    that.$vux.toast.text(format, "top");
                    return false;
                }
            }

            that.$axios
                .post(url.getBankCardInfo, {
                    params: {
                        name: getUserInfo('custName'),
                        id_card_num: getUserInfo('certNo'),
                        bank_card_num: that.params.acctNo
                    }
                })
                .then(res => {
                    if (res.data.code === "0000") {
                        let {card_type,bank_name,is_matched} = res.data.result.bankInfo

                        //银行卡类别，DC:借记卡、CC:贷记卡、SCC:准贷记卡、PC:预付费卡、null:未知
                        if(is_matched){
                            if (card_type === "DC") {
                                //that.params.bankName = bank_name
                                that.submit()
                                
                            }else{
                                that.$vux.toast.text("还款银行卡只支持储蓄卡","top");   
                            } 
                        }else {
                            that.$vux.toast.text("身份证、姓名和银行卡不匹配","top");
                        }
                    }else {
                        that.$vux.toast.text(res.data.msg, "top");
                    }
                });            


        },
        submit() {
            let that = this;


            that.$axios.post(url.repaymentBindCard,{params: that.params}).then(res => {
                if(res.data.code == '0000'){

                    that.$vux.toast.show({
                        text:"添加成功", 
                        onHide(){
                            that.$router.push({path:'orderDetail',query:{loanNo:that.params.loanNo}})
                        }
                    })

                }else{
                    that.$vux.toast.text(res.data.msg,"top");
                }
            })

        }
    }
};
</script>