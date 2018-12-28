<style lang="less">
    .sign-model{
        .checkbox-list{
            padding: 0
        }
        .weui-dialog{
            width: 90%;
            max-width: initial;
        }
        .btn{
            height: 40px;line-height: 40px;font-size: 14px;
        }
    }
</style>

<template>
    <div v-transfer-dom class="sign-model">
        <x-dialog v-model="isShow" :dialog-style="{'max-width': '90%','border-rudius':'10px', width: '100%', height: '50%', 'background-color': 'transparent'}">
            <div class="p20 bg-white">
                <h4>请认真阅读以下协议</h4>
                <div class="text-left" style="height:300px;overflow-y:auto">
                    <p>我已查看并同意购买保险且遵守</p>
                    <div class="checkbox-list bg-white overhide">
                        <div class="item" v-for="item in contractList" :key="item.id" v-if="item.signType == '1'">
                            <span @click="itemChose(item)">
                                <img src="@/assets/image/person/check_Icon_Chose@2x.png" v-if="item.isChose" alt="">
                                <img src="@/assets/image/person/check_Icon_Default@2x.png" v-else alt="">
                            </span>
                            <label for=""><router-link v-stat="{key:'ClooPro',click:'ClooPro'}" class="bule-link fs14" :to="{path:'protocol',query:{type:item.signType}}">《{{item.signName}}》</router-link></label>
                        </div>
                    </div>
                    <p>及相关借款服务协议</p>
                    <template v-if="!isAgre">
                        <p class="mt15">{{hintText}}</p>
                        <div class="checkbox-list bg-white overhide">
                            <div class="item" v-for="item in contractList" :key="item.id" v-if="item.signType == '2' || item.signType == '3'">
                                <span @click="itemChose(item)">
                                    <img src="@/assets/image/person/check_Icon_Chose@2x.png" v-if="item.isChose" alt="">
                                    <img src="@/assets/image/person/check_Icon_Default@2x.png" v-else alt="">
                                </span>
                                <label for=""><router-link v-stat="{key:'ClooPro',click:'ClooPro'}" class="bule-link fs14" :to="{path:'protocol',query:{type:item.signType}}">《{{item.signName}}》</router-link></label>
                            </div>
                        </div>
                        <p>及相关借款服务协议</p>
                    </template>
                    <p class="fs12 color-9 mt20 mb20">借款行为生效以借款金额到账为准</p>
                </div>
                <div class="sign-btn-wrap box box-items">
                    <div class="all-chose mr30">
                        <span @click="allChoseFn" v-stat="{key:'CcheAll',click:'CcheAll'}">
                            <img src="@/assets/image/person/check_Icon_Chose@2x.png" style="width:14px;" v-if="allChose" alt="">
                            <img src="@/assets/image/person/check_Icon_Default@2x.png" style="width:14px;" v-else alt="">
                            <label class="middle">全选</label>
                        </span>
                    </div>
                    <div class="flex-1">
                        <a class="btn" @click="submit">同意协议并确认借款</a>
                    </div>
                </div>
            </div>
            <x-icon type="ios-close-outline" @click="closeDialog" style="fill:#fff;margin-top:20px;width:45px;height:45px;"></x-icon>
        </x-dialog>
    </div>
</template>

<script>
import {XDialog,TransferDomDirective as TransferDom} from "vux";

export default {
    directives: {
        TransferDom
    },
    components: {
        XDialog

    },
    props: {
        isShow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            contractList:[],//协议列表
            allChose:false,//全选
            isAgre:false,//是否有保险协议
            hintText: ""
        };
    },
    mounted() {
        let that = this;

        that.queryLoanSignInfo()
    },
    methods: {
        queryLoanSignInfo(){
            let that = this

            //获取合同服务协议
            that.$axios.post(url.queryLoanSignInfo,{params: {
                "prodNo":getLocalStorage('prodNo')
            }}).then(res => {
                let _data = res.data.result

                _data.map(item => item.isChose = false)

                that.contractList = _data

                //是否有保险协议
                that.isAgre = that.contractList.every(item => item.signType == "1")

          if (!that.isAgre) {
            that.contractList.forEach(item => {
              if (item.signType == "2") {
              that.hintText = "我已查看并同意购买保险且遵守"
            } else if (item.signType == "3") {
              that.hintText = "我已查看并同意购买医疗服务且遵守"
            }
          })
          }

        })
        },
        itemChose(item){
            let that = this

            item.isChose = !item.isChose

            that.allChose = that.contractList.every(item => item.isChose)
        },
        allChoseFn(){
            let that = this

            that.allChose = !that.allChose
            that.contractList.map(item => item.isChose = that.allChose)
        },
        closeDialog(){
            let that = this

            that.allChoseFn()
            that.$emit("closeSing", false);
        },
        submit(){
            let that = this

            if(!that.allChose){
                that.$vux.toast.text("请确认勾选相关须知和条款协议", "top");
                return false;
            }
            that.$emit("signSubmit");

        }
    }
};
</script>
