
export const Timer = {
    data() {
        return {
            time: 60,   //倒计时长
            sendBtn: "获取验证码",   //发送验证码显示内容
            sendVoiceBtn: "语音验证码", //语音验证码显示内容
            sendDisabled: false, //发送按钮是否被禁用
            voiceBtnDisabled: false,//语音验证码按钮是否被禁用               
            msg:{
                btnDisabled:'sendDisabled',
                btnName:'sendBtn',
                btnText:'获取验证码'
            },
            voice:{
                btnDisabled:'voiceBtnDisabled',
                btnName:'sendVoiceBtn',
                btnText:'语音验证码'
            } 
        }
    },
  methods: {
    timer({btnDisabled, btnName, btnText} = type){
        this[btnDisabled] = true //将对应的按钮设置为不能点击
        let TIME_COUNT = this.time;
        let interval = window.setInterval(() => {
            if((TIME_COUNT--) <= 0) {
                TIME_COUNT = this.time;
                window.clearInterval(interval);
                this[btnDisabled] = false   //倒计时完之后将按钮恢复成可以点击状态
                this[btnName] = btnText //倒计时完之后恢复按钮上的文字
            }
            else {
                this[btnName] = `${TIME_COUNT}s后重新获取`
            }
        }, 1000)     
    }
  }
}

