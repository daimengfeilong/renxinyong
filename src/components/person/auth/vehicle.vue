<style lang="less">
</style>

<template>
    <div id="wrapper">
        <group label-width="7em">
            <x-input name="acctName" v-stat="{key:'carPlaCod',blur:'CcarPlaCod',focus:'CcarPlaCod'}" :max="10" title="车牌号:" v-model="params.plate_num" placeholder="请输入车牌号"></x-input>
            <x-input title="车架号" v-stat="{key:'carFraCod',blur:'CcarFraCod',focus:'CcarFraCod'}" :max="30" placeholder="请输入车架号" v-model="params.vin"></x-input>
            <popup-picker title="号牌类型" v-stat="{key:'plaCodTyp',click:'CchoPlaCodTyp'}" ref="plateName" :data="plateData" v-model="plateDef" placeholder="请选择号牌类型" show-name  ></popup-picker>
            <!-- <popup-picker title="保险公司" :data="companyData" v-model="companyDef"   placeholder="请选择保险公司"></popup-picker>
            <x-input title="保单号" :max="30" v-model="params.insurance_no" placeholder="请输入保单号"></x-input> -->
        </group>
        <div class="p10 mt30">
            <a class="btn" @click="submit()" v-stat="{key:'Csub',click:'Csub'}">提交</a>
        </div>
    </div>
</template>

<script>
import { XInput, Group, PopupPicker } from "vux";
import {saveAuth} from "../../../assets/js/utils.js";

export default {
    components: {
        XInput,
        Group,
        PopupPicker
    },
    data() {
        return {
            params: {
                user_id:getLocalStorage('loanNo'),
                vin:"",
                plate_num:"",
                owner:getUserInfo('custName'),
                plate_type:"",
                plate_name: "",
                id_card_num:getUserInfo('certNo'),
                company:"",
                insurance_no:""              
            },
            authType:AUTH_TYPE.vehicle,
            companyData: require("@/data/company.json"),
            companyDef: [],
            plateData: require("@/data/plateType.json"),
            plateDef: [],
            load: false
        };
    },
    mounted() {
        let that = this;
        
    },
    methods: {
        submit() {
            let that = this;
            let vinReg = /^[a-zA-Z0-9]+$/

            if(!that.params.plate_num){
                that.$vux.toast.text("请输入车牌号", "top");
                return false;
            }else if(!that.params.vin){
                that.$vux.toast.text("请输入车架号", "top");
                return false;
            }else if(!vinReg.test(that.params.vin)){
                that.$vux.toast.text("车架号格式有误", "top");
                return false;
            }else if(!that.plateDef.length){
                that.$vux.toast.text("请选择品牌类型", "top");
                return false;
            }
            // else if(!that.companyDef.length){
            //     that.$vux.toast.text("请选择保险公司", "top");
            //     return false;
            // }else if(!that.params.insurance_no){
            //     that.$vux.toast.text("请输入保单号", "top");
            //     return false;
            // }

            that.params.plate_type = that.plateDef[0]
            that.params.plate_name = that.$refs.plateName && that.$refs.plateName.getNameValues()
            //that.params.company = that.companyDef[0]
            
            that.$axios.post(url.vehicle,{params:that.params}).then(res => {
                let {result} = res.data
                
                if(result.code == 0){
                    if(result.data.success){
                        saveAuth(that.authType,(data) => {
                            that.$vux.toast.show({
                                text: "认证成功",
                                onHide() {
                                    that.$router.push('authentication')
                                }
                            });
                        }); 
                    }else{
                        if(result.data.err_msg){
                            that.$vux.toast.text(result.data.err_msg, "top");
                        }else{
                            that.$vux.toast.text('车牌号或车架号有误', "top");
                        }
                    }
                }else{
                    that.$vux.toast.text(result.msg, "top");
                }
            })
        }
    }
};
</script>