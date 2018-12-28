<template>
    <div class="wrap">
        <div class="success-container text-center">
            <template v-if="type == 'zmxy'">
                <img v-if="zmStatus == 'success'" src="@/assets/image/result/Result_Pic_Successful@2x.png" />
                <img v-else src="@/assets/image/result/Result_Pic_Error@2x.png" />
            </template>
            <template v-else-if="payResult">
              <img v-if="payResult == '1' || payResult == '3'" src="@/assets/image/result/Result_Pic_Successful@2x.png" />
              <img v-else src="@/assets/image/result/Result_Pic_Error@2x.png" />
            </template>
            <img v-else src="@/assets/image/result/Result_Pic_Successful@2x.png" />
            <h3 v-stat="{key:'sucMes',click:'sucMes'}">{{title}}</h3>
            <p :class="{visible: hide}">请注意查收短信<br>稍后可能会有审核经理电话联系您<br>请保持电话畅通，祝生活愉快~</p>
            <div class="mt20 mb30">
                <a class="btn" @click="back" v-stat="{key:'butVal',click:'CwhiBut',value:btnText}">{{ btnText }}</a>
                <!-- <a @click="goHome" v-stat="{key:'CretMai',click:'CretMai'}" class="backIndex mt20 fs16" v-if="path != 'prodIntrod'">返回首页</a> -->
            </div>
        </div>
    </div>
</template>

<script>
import { saveAuth } from "../../assets/js/utils.js";

export default {
    data() {
        return {
            title: "",
            name: "",
            hide: false,
            btnText: "",
            path: getLocalStorage("path"),
            zmStatus: "",//芝麻分认证状态
            type:'',//认证第三方回调url
            payResult: ""  //聚合支付回调页面所传参数
        };
    },
    mounted () {
        this.initInfo();
        window.scrollTo(0, 0);
        document.querySelector('body').style.background = '#2068FB'
    },
    beforeDestroy(){
        document.querySelector('body').style.background = '#fff8f2'
    },
    methods: {
        initInfo() {
            let that = this;
            let serviceName = this.$route.query.serviceName; //开户第三方回调url
            let transSerialNo = this.$route.query.transSerialNo; //提现成功第三方回调url
            let repaymentSuc = this.$route.query.showType; //提现成功第三方回调url
            that.zmStatus = this.$route.query.status
            that.type = this.$route.query.taskType;
            that.payResult = this.$route.query.PAY_RESULT;

            /**
             * author zxl
             * 【重要】如果页面有重大逻辑更改，最好手动设置一下其他的localStorage path和query type值，保证每个条件下都能正常输出
             * --------------------------
             * 通过type判断避免覆盖设置
             * --------------------------
             */

            if (that.type || serviceName) {
                //第三方回调走这里
                that.hide = true;
                if (that.type == "bank") {
                    that.title = "认证成功";
                    that.name = "authentication";
                    that.btnText = "返回认证列表";
                    saveAuth(AUTH_TYPE.ebank);
                } else if (that.type == "fund") {
                    that.title = "认证成功";
                    that.name = "authentication";
                    that.btnText = "返回认证列表";
                    saveAuth(AUTH_TYPE.fund);
                } else if (that.type == "zmxy") {

                    that.name = "authentication";
                    that.btnText = "返回认证列表";

                    if(that.zmStatus == 'success'){
                        that.title = "认证成功";
                        saveAuth(AUTH_TYPE.zmxy);
                    }else{
                        that.title = "认证失败";
                    }

                } else if (transSerialNo) {
                    that.title = "提现成功";
                    that.name = "orderDetail";
                    that.btnText = "返回订单详情";
                }
            } else if (repaymentSuc == "repaymentSuc") {
              that.title = "操作成功";
              that.name = "prodIntrod";
              that.btnText = "返回首页";
            } else {
                //----页面指向跳转走这里
                if (that.path == "prodIntrod") {
                    that.title = "开户成功";
                    that.name = "prodIntrod";
                    that.btnText = "返回首页";
                } else if (that.path == "productList") {
                    that.title = "申请成功";
                    that.name = `${suc_yinliu_URL}?mobile=${getLocalStorage("phoneNo")}&token=${getLocalStorage("token")}&target=h5`;
                    that.btnText = "申请其他借款";
                } else if (that.path == "orderDetail") {
                    that.title = '签约成功';
                    that.name = that.path;
                    that.btnText = "返回订单详情";
                } else if (that.path == "withdrawal") {
                    that.title = "提现成功";
                    that.name = "orderDetail";
                    that.btnText = "返回订单详情";
                }
            }

            if (that.payResult) {
              that.hide = true;
              that.name = "prodIntrod";
              that.btnText = "返回首页";
              switch (that.payResult) {
                case '1':
                  that.title = "交易成功";
                  break;
                case '2':
                  that.title = "交易失败";
                  break;
                case '3':
                  that.title = "交易中";
                  break;
              }
            }
            document.title = that.title;
        },
        back() {
            let that = this;
            let name = that.name;

            //跳转第三方页面
            if (name.indexOf("http") == -1) {
                if(name === 'prodIntrod'){
                    that.goHome()
                }else{
                    that.$router.push(name);
                }
            } else {
                window.location.href = name;
            }
        },
        goHome(){
            this.$router.push({path:`/prodIntrod/${getLocalStorage('channelVal')}`})
        }
    }
};
</script>

<style lang="less">
.wrap {
    background-color: #2068fb;
}

.visible {
    visibility: hidden;
}

.backIndex {
    display: inline-block;
    color: #fff;
}
</style>
