<template>
	<div>
		<div class="rev-container right-point">
			<router-link v-stat="{key:'CreaNamAut',click:'CreaNamAut'}" tag="li" class="box" :to="{ path: 'face', query: {source: 'returnRevise'}}">
				<span class="flex-1">实名认证</span>
			</router-link>
			<router-link v-stat="{key:'CquaAut',click:'CquaAut'}" tag="li" class="box" :to="{ path: 'aptitude', query: {source: 'returnRevise'}}">
				<span class="flex-1">资质认证</span>
			</router-link>
			<router-link v-stat="{key:'CfunInf',click:'CfunInf'}" tag="li" class="box" :to="{ path: 'baseInfo', query: {source: 'returnRevise'}}">
				<span class="flex-1">基础信息</span>
			</router-link>
			<!-- <router-link tag="li" class="box" :to="{ path: 'face', query: {source: 'returnRevise'}}">
				<span class="flex-1">身份证附件</span>
			</router-link>
			<router-link tag="li" class="box" :to="{ path: 'uploadBank', query: {source: 'returnRevise'}}">
				<span class="flex-1">银行卡附件</span>
			</router-link> -->
            <div class="fixed-bottom">
                <div class="btn-wrap box">
                    <div class="flex-1">
                        <span v-stat="{key:'CretUpPag',click:'CretUpPag'}" class="btn def-btn" @click="goBack">返回上一页</span>
                    </div>
                    <div class="flex-1">
                        <span v-stat="{key:'CsubOrd',click:'CsubOrd'}" class="btn" @click="showAgreView = true">提交订单</span>
                    </div>
                </div>
            </div>
		</div>
                
        
        <!-- 默签协议 -->
        <sign :is-show="showAgreView" @signSubmit="submitSign" @closeSing="closeSing"></sign>
        
        <!-- 发送短信验证码弹窗 -->
        <captcha :is-show="isShowCaptcha" @closeCaptcha="closeCaptcha" @captchaSubmit="submit"></captcha>
	</div>
</template>

<script>
import { XInput, Group, TransferDom,XDialog } from "vux";
import Captcha from '@/components/common/person/Captcha'
import Sign from '@/components/common/person/Sign'

export default{
    components: {
        XInput,
        Group,
        TransferDom,
        XDialog,
        Captcha,
        Sign
    },
    directives:{
        TransferDom
    },
    data(){
        return{
            loanNo: getLocalStorage('loanNo'),
            showAgreView:false,//协议弹窗
            isShowCaptcha:false//验证码弹窗
        }
    },
    mounted(){
        let that = this
        
        //调用一次组件图形验证码
        that.$children[4].refresh()
    },
    methods: {
        goBack:function (){
            this.$router.go(-1)
        },
        closeCaptcha(v){
            this.isShowCaptcha = v
        },
        closeSing(v){
            this.showAgreView = v
        },
        submitSign(){
            let that = this

            that.isShowCaptcha = true;
            that.showAgreView = false;
        },
        isRxy(){
            return getLocalStorage('channelVal') === 'rxH5'
        },
        submit (){
            let that = this

            that.$axios.post(url.submitOrder, {params: {
                loanNo: getLocalStorage('loanNo'),
                phoneNo:getLocalStorage('phoneNo'),
                channelCode:getLocalStorage('channelCode'),
                invitecode:'',
                remark:'无',
            }}).then(function(response) {
                if(response.data.code === "0000") {
                    that.$vux.toast.show({
                        text:"提交订单成功", 
                        onHide(){
                            setLocalStorage('path','productList')
                            that.$router.push('success')
                        }
                    })
                }else {
                    that.$vux.toast.text(response.data.msg)
                }
            })
        }
    }
}
</script>
