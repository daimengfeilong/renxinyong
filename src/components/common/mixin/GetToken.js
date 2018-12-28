
import { initGlobal,checkPhone } from "@/assets/js/utils.js"

export const GetToken ={
    data() {
        return {
            getTokenData: {
                sourceOsType: getLocalStorage('sourceOsType'),
                loginNo: getQueryString('mobile'),
                registSource: REGIST_SOURCE,
                loginFlag: LOGIN_FLAG,
                channelCode: getLocalStorage('channelCode'),
                kaniuId:'',
                referer: window.location.href
            },
            getTokenJson: {// 获取token的参数对象
                loginFlag: LOGIN_FLAG,
                loginToken: "",
                sourceOsType: getLocalStorage('sourceOsType'),
                channelCode: getLocalStorage('channelCode'),
            },
            // 需要推送给360的json对象
            pushData: {
                method: "event.notify", // 请求的API方法名次
                version: "1.0", // API协议版本,默认值： 1.0
                biz_data: "" // 请求的业务数据，json格式
            }
        }
    },
    computed:{
        phoneStatus(){
            return checkPhone(this.getTokenData.loginNo)
        }
    },
  methods: {
      initParams(){
          let that = this
          
        that.getTokenData = {
            sourceOsType: getLocalStorage('sourceOsType'),
            loginNo: getQueryString('mobile'),
            registSource: REGIST_SOURCE,
            loginFlag: LOGIN_FLAG,
            channelCode: getLocalStorage('channelCode'),
            kaniuId:'',
            referer: window.location.href
        }
          
        that.getTokenJson = {// 获取token的参数对象
            loginFlag: LOGIN_FLAG,
            loginToken: "",
            sourceOsType: getLocalStorage('sourceOsType'),
            channelCode: getLocalStorage('channelCode'),
        }
          
      },
    getToken(...callbacks){

        if(!this.phoneStatus) {
            this.$vux.toast.text("手机号码有误", 'top');
            return false
        }
        let kaniuId = getQueryString("userId")
        if(kaniuId){
            this.getTokenData.kaniuId = kaniuId
        }

         this.$axios.post(url.getToken,{params:this.getTokenData}).then((response) => { 
            if(response.data.code == "0000") {
                setLocalStorage('phoneNo',response.data.params.loginNo)
                this.getTokenJson.loginToken = response.data.result
                if(this.getTokenJson.loginToken){                    
                    this.attainToken(callbacks); // 通过加密参数获取真实token
                }
            }else {
                // this.$vux.toast.text(response.data.msg, 'top');
            }
        })
        .catch(error => {
           
        })
    },
    attainToken:function(callbacks) {
         this.$axios.post(url.inerLogin,{params:this.getTokenJson}).then((response) => {
            if(response.data.code == "0000") {
                setLocalStorage("token", response.data.result.receToken)
                if(callbacks){
                    for(let item of callbacks) {
                        item.call(this)
                    }
                }
                if(this.$route.params.channelVal != "rong360"){ //如果是rong360在上一步已经存了解密的号码，这里就不需要了
                    setLocalStorage("phoneNo", getQueryString('mobile'))
                }
                if(getQueryString('mobile') && getQueryString("pre_orderid")) {
                    // 定义一个变量，用来保存该用户是否已注册
                    let isRegist = response.data.result['isHaveRegisted']                  
                    // 推送注册完成消息 
                    this.dispatchAction(isRegist,"regist")
                }
                
                //登录初始化
                initGlobal()
            }else {
                // this.$vux.toast.text(response.data.msg, 'top');
            }
           
        });  
    },
    notify() {
        // 向360回传数据
        let _this = this;
        _this.$axios.post(url.skiph5Api, _this.pushData)
            .then(response => {
                if(response.data.error == "200") {
                    
                }else{
                    response.data.msg && _this.$vux.toast.text(response.data.msg, 'top');
                }

            })
            .catch(response => { 
              
            })
    },
    dispatchAction(isRegist, event) {
        let _this = this,  
            bizData = {
                pre_orderid: "", // 360准订单ID
                user_flag: "", // 1-新用户2-老用户,event=regist时必填
                regist: { "mobile": "" }, // 注册数据
                event: event, // 具体动作-用户注册完成
                update_time: "" // 当前动作的更新时间
            };
            // 从url中获取订单id和用户手机号
            bizData.pre_orderid = getQueryString("pre_orderid");
            bizData.regist.mobile = getQueryString("mobile");
            bizData.user_flag = isRegist ? "2" : "1";
            bizData.update_time = Date.parse(new Date()).toString().substr(0,10);

            _this.pushData.biz_data = JSON.stringify(bizData);
        
            // 向360推送动作完成消息
            // 未注册调用回传接口
            if(!isRegist) {
                _this.notify();     
            }
    }
  }
}

