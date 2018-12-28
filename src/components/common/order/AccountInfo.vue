<style lang="less">
</style>

<template>
    <x-dialog
        v-model="show"
        :dialog-style="{'max-width': '90%','border-rudius':'10px', width: '100%', height: '50%', 'background-color': 'transparent'}"
    >
        <div class="p30 text-left" style="background:#fff;border-radius: 5px;">
            <template v-if="hasAcctInfo">
                <p class="m10">
                    <span class="color-9">姓&nbsp;&nbsp;&nbsp;名：</span>
                    {{acctInfo.custName}}
                </p>
                <p class="m10">
                    <span class="color-9">手机号：</span>
                    {{acctInfo.phoneNo}}
                </p>
                <p class="m10">
                    <span class="color-9">银行卡：</span>
                    {{acctInfo.bindbankNo}}
                </p>
            </template>
            <div class="text-center" v-else>
                <img style="width:70px" src="@/assets/image/person/noData.png" alt>
                <p class="mt20">暂无内容</p>
            </div>
        </div>
        <x-icon
            type="ios-close-outline"
             @click="closeDialog"
            style="fill:#fff;margin-top:20px;width:45px;height:45px;"
        ></x-icon>
    </x-dialog>
</template>

<script>
import {
    XDialog
} from "vux";

export default {
    components:{
        XDialog,        
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            acctInfo:{},
            hasAcctInfo:true,
            params:{
                certNo: getUserInfo('certNo'),
                chanNo: "045"
            }
        }
    },
    mounted() {
        this.queryAcct()
    },
    methods: {
        queryAcct() {
            this.$axios.post(url.openBankNoQuery,{
                params:this.params
            }).then(res => {
                if(res.data.code === '0000'){
                    this.acctInfo = res.data.result
                }else if(res.data.code === '9999'){
                    this.hasAcctInfo = false
                }else{
                    this.$vux.toast.text(res.data.msg, "top");
                }
            })
        },
        closeDialog(){
            this.$emit("closeDialog", false);
        }
    }
};
</script>