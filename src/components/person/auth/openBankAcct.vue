<style lang="less">

</style>

<template>
    <div id="wrapper" class="openBankAcct">
        <p class="fs14">尊敬的用户：您好！目前根据国家监管部门新规，在进行网贷业务前，需跳转至银行系统开通或重新激活银行存管账户，并设置存管银行交易密码，该交易密码用于网贷交易前的验证，进一步保证您的资金安全，感谢您的支持与配合！</p>
        <div class="mt30">
            <p class="bg-white text-center pt40 pb40" v-if="isAllOpen">您的帐户已完成开户，请点击提交继续完成操作。</p>
            <div class="bankList" v-for="item in bankList" :key="item.id" v-if="item.needAccount == '13900001'">
              <div class="box box-items p15 bg-white">
                <div class="flex-1 fs16 bold">{{item.acctBankName}}</div>
                <div>
                  <a class="btn-outline bold" @click="toBind(item)" v-if="item.openStatus == '44300001'">已开户</a>
                  <a class="btn-outline bold" @click="toBind(item)" v-else-if="item.openStatus == '44300000'">开户中</a>
                  <a class="btn-outline bold" @click="toBind(item)" v-else-if="item.openStatus == '44300003'">开户失败</a>
                  <a class="btn-outline bold" @click="toBind(item)" v-stat="{key:'CgoBou',click:'CgoBou'}" v-else>去绑定</a>
                </div>
              </div>
            </div>
        </div>
        <div class="acct-tips">
            <p>开户银行绑定越多，向您推荐成功率越高！</p>
            <h3>绑定攻略：</h3>
            <p>1.开户银行卡和储蓄卡认证银行卡需一致</p>
            <p>2.开户银行预留手机号和注册手机号需相同</p>
            <p class="mt15">
                <img class="middle" src="@/assets/image/person/BandBinding_Icon_Lamp@2x.png" alt="">
                <span class="middle">开户银行绑定失败，请联系客服 <a class="bule-link" v-stat="{key:'CconSer',click:'CconSer'}" href="tel:028-400-6688-000">028-400-6688-000</a></span>
            </p>
        </div>
        <div v-transfer-dom>
            <x-dialog v-model="showAccountView" hide-on-blur>
            <div class="account-point">
                <h4>温馨提示</h4>
                <label class="text-left">为保证正常放款，开户银行卡与绑定储蓄卡必须一致。</label>
                <strong class="text-left">卡号&nbsp;&nbsp;{{bankAcct | toBankNum}}</strong>
                <p class="text-left" v-if="agreementUrl">
                    <i><img src="@/assets/image/order/Insurance_Icon_Chose.png" /></i>
                    <b>我已阅读并接受<i><a class="bule-link" :href="agreementUrl">《银行存管授权委托书》</a></i></b>
                </p>
                <a class="btn" @click="openAccount">确认</a>
            </div>
            </x-dialog>
        </div>
        <div class="mt30">
            <a class="btn" @click="submit" v-stat="{key:'Csub',click:'Csub'}">提交</a>
        </div>
        <rocket v-if="showRocket"></rocket>
    </div>
</template>

<script>
import { TransferDom,XDialog } from 'vux'
import { saveAuth } from "@/assets/js/utils.js"
import Rocket from '../../common/Rocket'

export default {
    data () {
        return {
            showAccountView:false,//弹窗口
            agreementUrl:'',//协议地址
            bankAcct:getLocalStorage('bankNo'),//卡号
            bankList:[],
            state:getLocalStorage('openBankAcctState'),//认证操作次数
            isOpen:false,//当前产品是否已认证
            isAllOpen:false,//所有产品是否完成开户
            showRocket:false,//显示火箭Loading
            params:{
                chanNo:"",
                prodNo:getLocalStorage('prodNo'),
                loanNo:getLocalStorage('loanNo'),
                phoneNo:getLocalStorage('phoneNo'),
                backUrl: window.location.href,
                errorUrl: window.location.href,
                sourceUserType: SOURCE_USER_TYPE,
                sourceOsType: getLocalStorage('sourceOsType'),
                sourceType: SOURCE_TYPE
            },
            changePwdParams:{
              loanNo: getLocalStorage('loanNo'),
              chanNo: "045",
              certNo: "",
              backUrl: window.location.href,
              pwd_success_url: window.location.href,
              pwd_fail_url: `${window.location.origin}/#/resetPwdError?source=openBankAcct`,
              transaction_url: window.location.href
            }
        }
    },
    components:{
        XDialog,
        Rocket
    },
    directives:{
        TransferDom
    },
    filters:{
        toBankNum(v){
            return v ? v.slice(0,4)+ " **** **** "+v.slice(-4) : ''
        }
    },
    mounted () {
        let that = this
        that.changePwdParams.certNo = JSON.parse(getLocalStorage('userBaseInfo')).certNo
        that.$axios.post(url.openAccountProds,{params: {
            loanNo:getLocalStorage('loanNo')
        }}).then(res => {
            if(res.data.code == '0000'){
                that.bankList = res.data.result.data

                //所有列表
                that.isAllOpen = that.bankList.every(item => item.needAccount == '13900002')

                //单项
                that.getIsOpen()

            }else{
                that.$vux.toast.text(res.data.msg,'top')
            }
        })
    },
    methods: {
        getIsOpen(){
            let that = this
            //返回所有列表的认证状态
            /**
            开户失败  44300003	Open_Status
            已开户	  44300001	Open_Status
            未开户	  44300002	Open_Status
            开户中	  44300000	Open_Status
            */
            that.isOpen = that.bankList.every(item => item.openStatus != '44300002')
        },
        openAccount(){
            let that = this

            that.$axios.post(url.openAccountBefore,{params: that.params}).then(res => {
                if(res.data.code == '0000'){
                    let {resultType,url} = res.data.result.data
                    let {msg,bankMsg} = res.data.result

                    //设置认证操作状态
                    that.setOpenBankAcctState()

                    //开户状态：1待开户；2已开户；0开户异常
                    if(resultType == '1'){
                        //显示小火箭
                        that.showRocket = true

                        setTimeout(function(){
                            // 判断到底以哪种方式进行页面跳转 目前只有首金的是返回js代码
                            if(url.indexOf("<script") === -1) {
                                window.location.href = url
                                return false
                            }

                            let node = document.createElement('div')
                                node.id = 'innerHtmlContainer'
                            document.body.appendChild(node)
                            document.querySelector("#innerHtmlContainer").innerHTML = url.split("<script")[0]
                            document.querySelector("#innerHtmlContainer form").submit();
                        },2000)


                    }else if(resultType == '2'){
                        that.bankList.map(item => {
                            if(item.chanNo == that.params.chanNo){
                                item.openStatus = '44300001'
                            }
                        })
                        that.getIsOpen()
                    }else if(resultType == '0'){
                        //与已开户银行卡号不一致
                        that.bankList.map(item => {
                            if(item.chanNo == that.params.chanNo){
                                item.openStatus = '44300000'
                            }
                        })
                        that.getIsOpen()
                        that.$vux.toast.text(bankMsg || msg,'top')
                    }

                    that.showAccountView = false

                }else{
                    that.$vux.toast.text(res.data.msg,'top')
                }
            })
        },
        setOpenBankAcctState(){
            let that = this
            let chanNo = that.params.chanNo
            let obj = {}

            //本地是否存在，存在就追加
            if(that.state){
                let localState = JSON.parse(getLocalStorage('openBankAcctState'))
                localState[chanNo] = 1
                setLocalStorage('openBankAcctState',JSON.stringify(localState))
            }else{
                obj[chanNo] = 1
                setLocalStorage('openBankAcctState',JSON.stringify(obj))
            }


        },
        toBind(item){
          let that = this

          that.agreementUrl = item.agreementUrl
          that.params.chanNo = item.chanNo

          if (item.chanNo == "045") {
            that.$router.push("changeAuthorization")
          } else if (item.openStatus !== '44300001') {
            that.showAccountView = true
          }

        },
        toSaveAuth(){
            let that = this

            //认证
            saveAuth(AUTH_TYPE.openBank,(data) => {
                that.$vux.toast.show({
                    text: "认证成功",
                    onHide() {
                        that.$router.push('authentication')
                    }
                });
            });
        },
        submit(){
            let that = this
            let localState = JSON.parse(that.state)

            //列表判断
            if(!that.isOpen){
                //本地是否存在
                if(that.state){
                    for(let item of that.bankList){
                        //本地不存在并且状态为未开户
                        if(Object.keys(localState).indexOf(item.chanNo) == -1 &&  item.openStatus == '44300002'){
                            that.$vux.toast.text('请完成开户银行绑定','top')
                            return false;
                        }
                    }
                }else{
                    that.$vux.toast.text('请完成开户银行绑定','top')
                    return false;
                }
            }

            that.toSaveAuth()

        },
        changePwd () {   //修改开户密码
          let that = this
          that.$axios.post(url.resetPasswd, {params: that.changePwdParams}).then(function (res) {
            let result = res.data
            if (result.code == "0000") {
              if (result.result.url) {
                window.location.href = result.result.url
              } else {
                that.$vux.toast.text("跳转地址有误", 'top')
              }
            } else {
              that.$vux.toast.text(result.msg,'top')
            }
          }).catch()
        }
    }
}
</script>
