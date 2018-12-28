<style lang="less">

</style>

<template>
    <div id="wrapper">
        <step :step="2"></step>
        <auth-item :is-auth="bank" v-stat="{key:'Cq1banAut',click:'Cq1banAut'}" link="bankCard" :card-id="bankNo" :icon="bankIcon" name="银行卡"></auth-item>
        <auth-item v-stat="{key:'CzhiCreAut',click:'CzhiCreAut'}" :icon="zmxyIcon" @click.native="toZmxyAuth()" :is-auth="zmxy" name="芝麻信用"></auth-item>
        <auth-item v-if="isAuth.isCredit" v-stat="{key:'Cq2redAut',click:'Cq2redAut'}" :card-id="creditNo" :is-auth="credit" link="creditCard" :icon="creditIcon1" name="信用卡" tips="绑定信用卡，让放款更安全"></auth-item>
        <auth-item v-if="isAuth.isCredit" v-stat="{key:'Cq3netCar',click:'Cq3netCar'}" :is-auth="online" @click.native="toExtAuth('banklist')" :icon="creditIcon2" name="网银" tips="绑定网银，让放款更安全"></auth-item>
        <auth-item v-if="isAuth.isFund" v-stat="{key:'CfunAut',click:'CfunAut'}" :is-auth="fund" @click.native="toExtAuth('fundlist')" :icon="fundIcon" name="公积金"></auth-item>
        <auth-item v-if="isAuth.isOwner" v-stat="{key:'Cq4ownAut',click:'Cq4ownAut'}" :is-auth="car" link="vehicle" :icon="carIcon" name="车主贷"></auth-item>
        <div class="p10 mt20">
            <a class="btn" @click="submit" v-stat="{key:'Cnex',click:'Cnex'}">下一步</a>
        </div>
    </div>
</template>

<script>
import bankIcon from "@/assets/image/person/Prove_Icon_SaveCardProve@2x.png";
import creditIcon1 from "@/assets/image/person/Prove_Icon_credit@2x.png";
import creditIcon2 from "@/assets/image/person/Prove_Icon_InternetProve@2x.png";
import fundIcon from "@/assets/image/person/Prove_Icon_ProvidentFund@2x.png";
import carIcon from "@/assets/image/person/Prove_Icon_Car@2x.png";
import zmxyIcon from "@/assets/image/person/zmxy_icon@2x.png";

import Step from "../../common/person/Step";
import AuthItem from "../../common/person/AuthItem";
import { saveAuth,checkAuth } from "@/assets/js/utils.js";

export default {
    components: {
        Step,
        AuthItem
    },
    data() {
        return {
            isAuth:{},
            loanNo: getLocalStorage('loanNo'),
            backUrl:`${window.location.origin}/#/success`,
            bankNo:getLocalStorage('bankNo') || '',
            creditNo:getLocalStorage('creditNo') || '',
            source:this.$route.query.source,//返回修改标识
            toZmxyUrl:'',//芝麻信用认证链接
            zmxyErr:'',//芝麻信用认证错误信息
            credit:false,
            bank:false,
            online:false,
            fund:false,
            car:false,
            zmxy:false,
            bankIcon,
            creditIcon1,
            creditIcon2,
            fundIcon,
            carIcon,
            zmxyIcon
        };
    },
    mounted() {
        let that = this;
        
        //返回修改标识
        if(that.source){
            setLocalStorage('source',that.source)
        }

        //产品认证项
        that.getAuth()
        
        //查询已认证项
        that.$axios.post(url.getTempAuthTypeList, { params:{ 
            loanNo: that.loanNo 
        }}).then(res => {
            if (res.data.code == "0000") {
                let checkAuthObj = checkAuth(res.data.result)

                for(let item in checkAuthObj){
                    that[item] = checkAuthObj[item]
                }

                //芝麻信用
                that.getZmxyAuth()

            }else {
                that.$vux.toast.text(res.data.msg, "top");
            }
        });

    },
    methods: {
        isNO(val){
            return val == '13900001'
        },
        getAuth(){
            let that = this
            
            if(getLocalStorage('isAuth')){
                that.isAuth = JSON.parse(getLocalStorage('isAuth'))
            }else{
                //查询产品，获取认证项
                that.$axios.post(url.queryProdInfo,{params: {
                    prodNo:getLocalStorage('prodNo')
                }}).then(res => {
                    let {isCredit,isEasyCard,isFund,isOwner,isSel,isSplitLoan,isVip} = res.data.result

                    if (res.data.code == "0000") {
                        const isAuth = {
                            isCredit: that.isNO(isCredit),//是否信用卡产品
                            isEasyCard: that.isNO(isEasyCard),
                            isFund: that.isNO(isFund),//是否公积金产品
                            isOwner: that.isNO(isOwner),//是否是车主贷
                            isSel: that.isNO(isSel),//是否需要选择商品
                            isSplitLoan: that.isNO(isSplitLoan),
                            isVip: that.isNO(isVip)//是否办理全机审流程的产品
                        }
                        that.isAuth = isAuth
                        setLocalStorage('isAuth', JSON.stringify(isAuth))
                    }            
                })
            }

        },
        getZmxyAuth(){
            let that = this
            
            that.$axios.post(url.getZmScoreUrl,{params: {
                id_card_num : getUserInfo('certNo'),
                name        : getUserInfo('custName'),
                phone_num   : getUserInfo('phoneNo'),
                user_id     : getLocalStorage('loanNo'),
                callback_url: `${window.location.origin}/#/success?taskType=zmxy`
            }}).then(res => {
                let { result } = res.data
                if(result.code === 0){
                    if(result.data.has_authorized){
                        that.zmxy = true
                    }else{
                        that.zmxy = false
                        that.toZmxyUrl = result.data.url
                    }
                }else{
                    that.zmxyErr = result.msg
                    that.$vux.toast.text(result.msg,'top')
                }
            })
        },
        toZmxyAuth(){
            let that = this

            if(that.zmxyErr){
                that.$vux.toast.text(that.zmxyErr,'top')
                return false;                
            }

            if(that.toZmxyUrl) window.location.href = that.toZmxyUrl
        },
        toExtAuth(type){
            let that = this
            
            window.location.href  = `https://api.51datakey.com/h5/importV3/index.html#/${type}/CREDITCARD?apiKey=${appKey}&userId=${that.loanNo}&_k=1idz1p&alertOnFailMax=YES&quitOnFail=yes&quitOnLoginDone=yes&goBackEnable=YES&backUrl=${that.backUrl}`;
        },
        submit(){
            let that = this
            let source = getLocalStorage('source')

            if(!that.bank){
                that.$vux.toast.text('请先完成银行卡认证','top')
                return false;
            }else if(!that.zmxy){
                that.$vux.toast.text('请先完成芝麻信用认证','top')
                return false;
            }else if(that.isAuth.isCredit && !that.credit){
                that.$vux.toast.text('请先完成信用卡认证','top')
                return false;
            }else if(that.isAuth.isCredit && !that.online){
                that.$vux.toast.text('请先完成网银认证','top')
                return false;
            }else if(that.isAuth.isFund && !that.fund){
                that.$vux.toast.text('请先完成公积金认证','top')
                return false;
            }else if(that.isAuth.isOwner && !that.car){
                that.$vux.toast.text('请先完成车主认证','top')
                return false;
            }

            if(source){
                removeLocalStorage('source')
                that.$router.push(source)
            }else{
                that.$router.push("calculation");
            }
        }
    }
};
</script>