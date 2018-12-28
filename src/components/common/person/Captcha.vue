<style lang="less" scoped>
.captcha-dialog-wrap {
    .weui-cells {
        border-radius: 10px !important;
    }
}
</style>

<template>
    <div v-transfer-dom class="captcha-dialog-wrap">
        <x-dialog v-model="isShow" :dialog-style="{'max-width': '90%','border-rudius':'10px', width: '100%', height: '50%', 'background-color': 'transparent'}">
            <group>
                <h4 class="mt10">请输入当前手机短信验证码</h4>
                <div class="vux-x-input weui-cell overlay">
                    <div class="weui-cell__hd"></div>
                    <div class="weui-cell__bd weui-cell__primary">
                        <input id="vux-x-input-btx7h" type="tel" placeholder="请输入手机号码" v-model="phoneNo" class="weui-input">
                    </div>
                </div>
                <x-input placeholder="请输入图形验证码" v-stat="{key:'gracor',blur:'Cgracor',focus:'Cgracor'}" v-model="verificationCode" class="img-code">
                    <img slot="right-full-height" v-stat="{key:'CgetGracor',click:'CgetGracor'}" :src="imgSrc" @click="refresh()">
                </x-input>
                <x-input placeholder="请输入手机短信验证码" v-stat="{key:'aut',blur:'Caut',focus:'Caut'}" class="weui-vcode" name="identifyCode" v-model="identifyCode">
                    <x-button slot="right" type="default" mini class="send-code" v-if="disabledSms" disabled="disabled">
                        <span>{{timeNumSms}}</span>秒后可重发</x-button>
                    <x-button slot="right" type="default" v-stat="{key:'CgetAut',click:'CgetAut'}" mini class="send-code" v-else @click.native="getCaptcha('sms')">获取验证码</x-button>
                </x-input>
                <p class="text-left pl15" v-if="isVoice">
                    <a class="fs12 color-9" v-if="disabledVoice">{{timeNumVoice}}秒后可重新获取</a>
                    <a class="fs12 carmine" v-else @click="getCaptcha('voice')">获取语音验证码</a>
                </p>
                <div class="p10">
                    <a class="btn" @click="submit" :class="{'overlay':overlay}" v-stat="{key:'Caff',click:'Caff'}">确认</a>
                </div>
            </group>
            <x-icon type="ios-close-outline" @click="closeDialog" style="fill:#fff;margin-top:20px;width:45px;height:45px;"></x-icon>
        </x-dialog>
    </div>
</template>

<script>
import {
    XInput,
    XDialog,
    XButton,
    Group,
    TransferDomDirective as TransferDom
} from "vux";
import { checkCaptcha, checkPhone } from "@/assets/js/utils.js";

export default {
    directives: {
        TransferDom
    },
    components: {
        XInput,
        XDialog,
        XButton,
        Group
    },
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        phoneNo: {
            type: String,
            default: getLocalStorage("phoneNo") || getUserInfo("phoneNo")
        }
    },
    data() {
        return {
            verificationCode: "", //图形验证码
            identifyCode: "", //短信验证码
            codeType: CODE_TYPE.MSG, // 默认短信验证
            imgSrc: "", //图形验证码图片
            disabledSms: false, //禁用图形验证码
            disabledVoice: false, //禁用语音验证码
            smsTimer: null, //图形验证码定时器
            voiceTimer: null, //语音验证码定时器
            overlay: false, //重复提交
            isVoice: false, //是否显示语音验证码
            timeNumSms: 60, //短信验证码倒计时
            timeNumVoice: 60 //语音验证码倒计时
        };
    },
    mounted() {
        let that = this;
        that.refresh();
    },
    methods: {
        refresh() {
            this.imgSrc = `${url.ImgCode}?phoneNo=${
                this.phoneNo
            }&random_num=${Math.random()}`;
        },
        getCaptcha(type) {
            let that = this;

            if (!checkPhone(that.phoneNo)) {
                this.$vux.toast.text("手机号码不正确", "top");
                return false;
            } else if (!that.verificationCode) {
                this.$vux.toast.text("请输入图形验证码", "top");
                return false;
            }

            if (type == "voice") {
                that.codeType = CODE_TYPE.VOICE;
            } else {
                that.codeType = CODE_TYPE.MSG;
            }

            let data = {
                phone: that.phoneNo,
                sourceOsType: "30500005",
                verificationCode: that.verificationCode,
                isVoice: that.codeType
            };
            this.$axios.post(url.sendSms, { params: data }).then(response => {
                if (response.data.code == "0000") {
                    this.$vux.toast.text("验证码获取成功", "top");
                    if (type == "sms") {
                        that.sendSmsCode();

                        //点击获取验证码15秒之后出现语音验证码
                        setTimeout(() => {
                            that.isVoice = true;
                        }, 15000);
                    } else {
                        that.sendVocieCode();
                    }
                } else {
                    this.refresh();
                    this.$vux.toast.text(response.data.msg, "top");
                }
            });
        },
        sendSmsCode() {
            let that = this;

            that.disabledSms = true;

            that.smsTimer = window.setInterval(() => {
                if (that.timeNumSms-- <= 1) {
                    window.clearInterval(that.smsTimer);
                    that.timeNumSms = 60;
                    that.disabledSms = false;
                }
            }, 1000);
        },
        sendVocieCode() {
            let that = this;

            that.disabledVoice = true;

            that.voiceTimer = window.setInterval(() => {
                if (that.timeNumVoice-- <= 1) {
                    window.clearInterval(that.voiceTimer);
                    that.timeNumVoice = 60;
                    that.disabledVoice = false;
                }
            }, 1000);
        },
        closeDialog() {
            let that = this;

            that.verificationCode = "";
            that.identifyCode = "";
            that.disabledSms = false;
            that.disabledVoice = false;
            that.isVoice = false;
            that.timeNumSms = 60;
            that.timeNumVoice = 60;

            //清除定时器，vue里面不加window会报错
            window.clearInterval(that.smsTimer);
            window.clearInterval(that.voiceTimer);

            that.$emit("closeCaptcha", false);
        },
        submit() {
            let that = this;

            if (!checkPhone(that.phoneNo)) {
                this.$vux.toast.text("手机号码不正确", "top");
                return false;
            } else if (!that.verificationCode) {
                this.$vux.toast.text("请输入图形验证码", "top");
                return false;
            } else if (!that.identifyCode) {
                this.$vux.toast.text("请输入短信验证码", "top");
                return false;
            } else if (!checkCaptcha(that.identifyCode)) {
                this.$vux.toast.text("请输入6-8位短信验证码", "top");
                return false;
            }

            that.overlay = true;

            //默签
            that.$axios
                .post(url.saveSignRecord, {
                    params: {
                        ckCode: that.identifyCode,
                        phoneNo: getLocalStorage("phoneNo"),
                        loanNo: getLocalStorage("loanNo")
                    }
                })
                .then(res => {
                    if (res.data.code == "0000") {
                        //默签完成
                        that.$emit("captchaSubmit");
                    } else {
                        that.$vux.toast.text(res.data.msg, "top");
                    }
                    that.overlay = false;
                });
        }
    }
};
</script>