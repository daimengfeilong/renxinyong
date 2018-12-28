<template>
    <div>
        <div class="login-title">
            <img src="./../../assets/image/login/SignUp_Img_TopBg@2x.png" alt="">
        </div>   
        <group>
            <x-input v-stat="{key:'setPas',blur:'setPas',focus:'CsetPas'}" name="password" type="password" placeholder="请设置账号密码" :min="6" :max="20" v-model="formData.password"></x-input>
            <x-input v-stat="{key:'cofPas',blur:'cofPas',focus:'CcofPas'}" name="rePassword" type="password" placeholder="请确认账号密码" :equal-with="formData.password" :min="6" :max="20" v-model="formData.rePassword"></x-input>
        </group>
        <div class="login-btn">
            <x-button v-stat="{key:'Cnex',click:'Cnex'}" @click.native="submit">下一步</x-button>
            <p>新用户点击“登录”视为同意<a href='http://apk.boyacx.com/jifen/renxinyong_agreement.html'>《注册协议》</a></p>
        </div>
    </div>
</template>
<script>
import { XInput, Group, XButton} from 'vux'
import { checkPassWord } from "@/assets/js/utils.js"
export default {
    data(){
        return {
            formData: { //用户填写的数据
                loginNo: getLocalStorage("phoneNo"),
                oldpassword: getLocalStorage("code"),
                password: "",
                rePassword:"",
            },       
        }
    },     
    components:{
        XInput,
        Group,
        XButton
    },
    methods: {
        submit() {
            if(!checkPassWord(this.formData.password)){
                this.$vux.toast.text("密码为6-20位数字字母组合,请输入有效密码！")
                return false
            } 
            if(this.formData.password !== this.formData.rePassword){
                this.$vux.toast.text("密码不一致！")
                return false
            }   
            let that = this;
            that.$axios.post(url.changePsw,{params:that.formData}).then((response) => {
                if (response.data.code == "0000") {
                    that.$vux.toast.show({
                        text: "登录成功",
                        onHide(){
                            that.$router.push({path:`/prodIntrod/${getLocalStorage('channelVal')}`})
                        }
                    })
                }else{
                    that.$vux.toast.text(response.data.msg, 'top');
                }
            });  
        }
    }
}
</script>
