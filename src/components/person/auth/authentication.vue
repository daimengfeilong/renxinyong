<style lang="less">
.auth-list{
    .already{
        .weui-cell__ft{
            padding: 0;
            &:after{
                content: none!important;
            }
        }
    }
}
</style>

<template>
    <div id="wrapper">
        <div class="box box-items bg-white p15">
            <div class="flex-1">
                <p class="fs18">申请借款</p>
                <p class="color-6">分{{instNum}}期</p>
            </div>
            <div class="color">
                <span>&yen;</span>
                <span class="fs30 bold">{{loanAmt}}</span>
            </div>
        </div>
        <group label-width="7em" class="auth-list">
            <cell :title="item.name" class="vux-tap-active weui-cell_access" v-for="(item, index) in authList" :key="index" v-if="item.show" @click.native="doLink(item.link)" :class="{'already':item.auth}" v-stat="{key:item.stat,click:item.stat}">
                <img v-if="item.auth" src="@/assets/image/person/already_auth.png" style="width:16px" />
                <label class="middle">{{item.auth ? '已认证' : '待认证'}}</label>
            </cell>
        </group>
        <div class="p10 mt30">
            <a class="btn" @click="submit">立即提交</a>
        </div>
    </div>
</template>

<script>
import { Group, Cell } from "vux";
import { checkAuth } from "@/assets/js/utils.js";

export default {
    components:{
        Group,
        Cell
    },
    data () {
        return {
            authList : this.getAuthList(),
            loanAmt:getLocalStorage('loanAmt'),//分期金额
            instNum:getLocalStorage('instNum'),//分期数
            inviteStatus:getLocalStorage('inviteStatus'),//邀请码格式
            loanNo   : getLocalStorage('loanNo'),
            credit   : '',//信用卡
            bank     : '',//银行卡
            ebank    : '',//网银
            fund     : '',//公积金
            vehicle  : '',//车主贷
            zmxy     : '',//芝麻信用
            isAuth   : {},//产品认证项
            toZmxyUrl: '',//芝麻信用链接
            zmxyErr  : ''//芝麻信用错误提示
        }
    },
    mounted () {
        let that = this
        let source = this.$route.query.source

        //保存返回修改标识
        if(source){
            setLocalStorage('returnSource',source)
            //如果是返修清除邀请码
            that.inviteStatus = '';
            removeLocalStorage('inviteStatus')
        }

        that.credit = that.getAuthItem('credit')
        that.bank   = that.getAuthItem('bank')
        that.ebank  = that.getAuthItem('ebank')
        that.fund   = that.getAuthItem('fund')
        that.vehicle= that.getAuthItem('vehicle')
        that.zmxy   = that.getAuthItem('zmxy')

        that.fund.link = that.toExtAuth('fundlist')
        that.ebank.link = that.toExtAuth('banklist')

        that.getZmxyAuth()
        that.getAuth()
        that.getTempAuthTypeList()
        that.openAccountProds()
    },
    methods: {
        getAuthList(){
            //import会缓存之前的认证信息状态
            return [
                {
                    key:'idcard',
                    name:'身份认证',
                    link:'face',
                    auth:false,
                    show:true,
                    stat:'CideAut'
                },
                // {
                //     key:'face',
                //     name:'人脸识别',
                //     link:'videoverify',
                //     auth:false,
                //     show:true,
                //     stat:'CfacRec'
                // },
                {
                    key:'baseinfo',
                    name:'补充个人信息',
                    link:'baseinfo',
                    auth:false,
                    show:true,
                    stat:'CsupPerInf'
                },
                {
                    key:'contact',
                    name:'联系人信息',
                    link:'contactsInfo',
                    auth:false,
                    show:true,
                    stat:'CcontPer'
                },
                {
                    key:'company',
                    name:'公司信息',
                    link:'companyInfo',
                    auth:false,
                    show:true,
                    stat:'CcomInf'
                },
                {
                    key:'service',
                    name:'运营商登录',
                    link:'service',
                    auth:false,
                    show:true,
                    stat:'CphoLog'
                },
                {
                    key:'bank',
                    name:'绑定银行卡',
                    link:'bankCard',
                    auth:false,
                    show:true,
                    stat:'CbouBan'
                },
                {
                    key:'zmxy',
                    name:'芝麻分认证',
                    link:'zmxy',
                    auth:false,
                    show:true,
                    stat:'CzmAut'
                },
                {
                    key:'vehicle',
                    name:'车主贷认证',
                    link:'vehicle',
                    auth:false,
                    show:false,
                    stat:'CqownAut'
                },
                {
                    key:'fund',
                    name:'公积金认证',
                    link:'',
                    auth:false,
                    show:false,
                    stat:'CfunAut'
                },
                {
                    key:'credit',
                    name:'信用卡认证',
                    link:'creditCard',
                    auth:false,
                    show:false,
                    stat:'CcreAut'
                },
                {
                    key:'ebank',
                    name:'网银认证',
                    link:'',
                    auth:false,
                    show:false,
                    stat:'CqnetBan'
                },
                {
                    key:'openBank',
                    name:'开户',
                    link:'openBankAcct',
                    auth:false,
                    show:true,
                    stat:'Copen'
                }
            ]

        },
        getZmxyAuth(callback){
            let that = this

            that.$axios.post(url.getZmScoreUrl,{params: {
                id_card_num : getUserInfo('certNo'),
                name        : getUserInfo('custName'),
                phone_num   : getUserInfo('phoneNo'),
                user_id     : getLocalStorage('loanNo'),
                callback_url: `${window.location.origin}/#/success?taskType=zmxy`
            }}).then(res => {
                let { result } = res.data

                if(result.code === 0){
                    if(result.data.has_authorized){
                        that.zmxy.auth = true
                    }else{
                        that.zmxy.auth = false
                        that.toZmxyUrl = result.data.url

                        //callback是否是function
                        if(Object.prototype.toString.call(callback) == '[object Function]') callback()
                    }
                }else{
                    that.zmxyErr = result.msg
                    that.$vux.toast.text(result.msg,'top')
                }
            })
        },
        getAuthItem(key){
            let that = this

            //通过key返回一个认证列表项的指针对象
            for(let item of that.authList){
                if(item.key == key){
                    return item
                }
            }
        },
        doLink(link){
            let that = this
            let source = this.$route.query.source
            let idcard = that.getAuthItem('idcard')
            let face = that.getAuthItem('face')

            //其他认证必须完成身份认证/人脸识别
            if(link != 'face' && link != 'videoverify'){
                if(!idcard.auth){
                    that.$vux.toast.text('请先完成身份认证','top')
                    return false;
                }
                // else if(!face.auth){
                //     that.$vux.toast.text('请先完成人脸识别','top')
                //     return false;
                // }
            }
            
            //身份识别返修状态传递
            if(link == 'face' && source){
                link = `${link}?source=${source}`
            }

            //开户认证必须绑定银行卡
            if(link == 'openBankAcct' && !that.bank.auth){
                that.$vux.toast.text('请先绑定银行卡','top')
                return false;
            }

            if(link == 'zmxy'){
                that.toZmxyAuth()
            }else if(link.indexOf('http') > -1){
                window.location.href = link
            }else{
                that.$router.push(link)
            }
        },
        toZmxyAuth(){
            let that = this

            if(that.zmxyErr){
                that.$vux.toast.text(that.zmxyErr,'top')
                return false;
            }

            that.getZmxyAuth(() => {
                if(that.toZmxyUrl) window.location.href = that.toZmxyUrl
            })
        },
        getAuth(){
            let that = this

            if(getLocalStorage('isAuth')){
                that.isAuth = JSON.parse(getLocalStorage('isAuth'))
                that.setAuth()
            }else{
                //查询产品，获取认证项
                that.$axios.post(url.queryProdInfo,{params: {
                    prodNo:getLocalStorage('prodNo')
                }}).then(res => {
                    let {isCredit,isEasyCard,isFund,isOwner,isSel,isSplitLoan,isVip} = res.data.result

                    if (res.data.code == "0000") {
                        const isAuth = {
                            isCredit: that.isNO(isCredit),//是否信用卡产品
                            isEasyCard: that.isNO(isEasyCard),
                            isFund: that.isNO(isFund),//是否公积金产品
                            isOwner: that.isNO(isOwner),//是否是车主贷
                            isSel: that.isNO(isSel),//是否需要选择商品
                            isSplitLoan: that.isNO(isSplitLoan),
                            isVip: that.isNO(isVip)//是否办理全机审流程的产品
                        }
                        that.isAuth = isAuth
                        that.setAuth()
                        setLocalStorage('isAuth', JSON.stringify(isAuth))
                    }
                })
            }
        },
        setAuth(){
            let that = this

            //显示需要认证项
            if(that.isAuth.isCredit){//网银/信用卡
                that.credit.show = true
                that.ebank.show = true
            }else if(that.isAuth.isFund){//公积金
                that.fund.show = true
            }else if(that.isAuth.isOwner){//车主贷
                that.vehicle.show = true
            }
        },
        toExtAuth(type){
            let that = this

            return `https://api.51datakey.com/h5/importV3/index.html#/${type}/CREDITCARD?apiKey=${appKey}&userId=${that.loanNo}&_k=1idz1p&alertOnFailMax=YES&quitOnFail=yes&quitOnLoginDone=yes&goBackEnable=YES&backUrl=${window.location.origin}/#/success`;
        },
        getTempAuthTypeList(){
            let that = this

            //查询认证
            that.$axios.post(url.getTempAuthTypeList, { params: { loanNo: that.loanNo } }).then(res => {
                let {code,msg,result} = res.data

                if (code == "0000") {
                    let checkAuthObj = checkAuth(result)

                    //返修-认证状态保持
                    if(Array.isArray(result)){
                        let authType = JSON.stringify(result.map(item => item.authType))
                        
                        setLocalStorage('authItems',authType)
                    }

                    for(let item in checkAuthObj){
                        that.getAuthItem(item).auth = checkAuthObj[item]
                    }
                }else {
                    that.$vux.toast.text(msg, "top");
                }
            });
        },
        openAccountProds(){
            let that = this

            //是否开户
            /**
            开户失败  44300003	Open_Status
            已开户	  44300001	Open_Status
            未开户	  44300002	Open_Status
            开户中	  44300000	Open_Status
            */
            that.$axios.post(url.openAccountProds,{params: {
                loanNo:getLocalStorage('loanNo')
            }}).then(res => {
                if(res.data.code == '0000'){
                    let { data } = res.data.result

                    that.getAuthItem('openBank').auth = data.every(item => item.openStatus != '44300002')

                }
            })
        },
        isNO(val){
            return val == '13900001'
        },
        submit(){
            let that = this

            for(let item of that.authList){
                if(item.show && !item.auth){
                    that.$vux.toast.text(`请先完成[${item.name}]`, "top")
                    return false;
                }
            }

            //是否有邀请码
            if(that.inviteStatus || getLocalStorage('channelVal') == "rxH5"){
                that.$router.push('inviteCode')
            }else{
                that.$router.push('readAgreement')
            }
        }
    }
}
</script>
