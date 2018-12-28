<style lang="less">

</style>

<template>
    <div id="wrapper">
        <group label-width="7em" class="group-input-right">
            <x-input title="电销邀请码" v-stat="{key:'invCod',blur:'invCod',focus:'CinvCod'}" :max="8" v-model="invitecode" :placeholder="inviteText"></x-input>
        </group>
        <div class="p10 mt70">
            <a class="btn" @click="checkInviteCode()" v-stat="{key:'Clog',click:'Clog'}">提交</a>
        </div>
    </div>
</template>

<script>
import { XInput, Group } from "vux";
export default {
    components:{
        XInput,
        Group
    },
    data () {
        return {
            invitecode:'',
            inviteRequire:true,
            inviteStatus:getLocalStorage('inviteStatus'),//邀请码格式
            inviteText:'请输入邀请码',//邀请码文字
        }
    },
    mounted () {
        let that = this
        
        //邀请码选填
        if(getLocalStorage('channelVal') === "rxH5")  {
            this.inviteRequire = false//如果是任信用，邀请码选填
            this.inviteText = `${this.inviteText}(选填)`
        }
    },
    methods: {
		checkInviteCode() {
            let that = this
            let inviteCode = that.invitecode
            
            //验证邀请码
			if (getLocalStorage('channelVal') !== "rxH5") {
                let invite_reg_exp = new RegExp(`^[${that.inviteStatus.substr(0,2)}]{1}[${that.inviteStatus.substr(2)}]{1}\\d{4}$`)
                
				if (!invite_reg_exp.test(inviteCode)) {
                    let str = that.inviteStatus.substr(0, 1) + that.inviteStatus.substr(2, 1)
					that.$vux.toast.text(`请输入${str}开头(不区分大小写)加四位数字组成的六位邀请码`)
					return false
				}
			} else {
                let invite_reg_exp = new RegExp(`^[a-zA-Z0-9]{6}$`)
                if(inviteCode){
                    if (!invite_reg_exp.test(inviteCode)) {
                        that.$vux.toast.text(`请输入数字加字母组成的六位邀请码`)
                        return false
                    }
                }else{
                    that.$router.push('readAgreement')
                }
            }
            setLocalStorage('inviteCode',that.invitecode)
            that.$router.push('readAgreement')
        },
    }
}
</script>