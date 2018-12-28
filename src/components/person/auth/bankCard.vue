// /**************************
// 2018-07-13
// 身份认证-拍摄身份证
// 人员：zxl
// **************************/
<style lang="less">

</style>

<template>
    <div id="wrapper" class="face-verify">
        <p class="face-head">点击拍摄本人银行卡正反面</p>
        <div class="box bg-white upload-wrap">
            <ocr
            v-for="(item,index) in ocrProps"
            :key="index"
            :name="item.name"
            :bmp="item.bmp"
            :image="item.image"
            :desc="item.desc"
            :valid="item.valid"
            :attTyp="item.attTyp"
            @clearOcrInfo="clearOcrInfo"
            @setImage="setImage"
            @setValid="setValid"
            @uploaded="uploaded"
            >
            </ocr>
        </div>
        <group label-width="6.5em" class="group-input-right">
            <p class="face-head">请确认您的银行卡信息</p>
            <x-input title="银行卡号" v-stat="{key:'banCarCod',blur:'banCarCod',focus:'CbanCarCod'}" type="tel" :max="20" v-model="params.acctNo" placeholder="请输入银行卡号"></x-input>
            <popup-picker title="银行卡开户行" v-stat="{key:'banCarTyp',click:'CbanCarTyp'}" :data="bankOrgData" v-model="bankOrgDef" placeholder="请选择开户行" show-name></popup-picker>
            <popup-picker title="开户地区" v-stat="{key:'opeAre',click:'CopeAre'}" :data="address" :columns="3" v-model="defaultAddr" show-name @on-change="addrChange" placeholder="请选择开户地区"></popup-picker>
            <x-input title="手机号" v-stat="{key:'phoNum',blur:'phoNum',focus:'CphoNum'}" style="border-top:10px solid #f5f5f5" type="text" :max="12" v-model="bankPhoneNo" placeholder="请输入银行卡号预留手机号"></x-input>
        </group>
        <p class="p15 red" v-if="returnMsg">{{returnMsg}}</p>
        <p class="tip p15">*温馨提示：当前只支持以下银行卡，请勿绑定其他银行卡，以免导致借款，还款不成功。</p>
        <div class="bank-tips">
            <p class="warnColor2" v-for="(item,index) in bankOrgData[0]" :key="index">{{index + 1}}、{{item.name}}</p>
        </div>
        <div class="p15">
            <a class="btn" @click="checkedIdcard()" v-stat="{key:'CnexSte',click:'CnexSte'}">下一步</a>
        </div>
    </div>
</template>

<script>
import { XInput, Group, PopupPicker } from "vux";
import { checkName,checkIdcard,checkIdcardDate,saveAuth,checkBankCard,checkPhone } from "@/assets/js/utils.js"
import Ocr from "../../common/person/OcrBank";
import frontBmp from "@/assets/image/person/bank_examples_front.png";
import backBmp from "@/assets/image/person/bank_examples_back.png";

export default {
    components: {
        XInput,
        Group,
        PopupPicker,
        Ocr
    },
    data () {
        return {
            ocrBankInfo:{},//银行卡信息
            authType: AUTH_TYPE.bank,
            bankOrgData: [],
            bankOrgDef: [],
            defaultAddr: [],
            load:false,
            returnMsg:this.$route.query.returnMsg,
            bankPhoneNo:getLocalStorage("phoneNo"),//银行预留手机号码
            address: require("@/data/address.json"),
            params: {
                phoneNo: getLocalStorage("phoneNo"),
                acctNo: "",
                acctName: getUserInfo("custName"),
                openProv: "",
                openCity: "",
                openAddr: "",
                bankName:"",
                openOrg: "",
                idCard: getUserInfo("certNo")
            },
            ocrProps: [//ocr数据模型
                {
                    name: "front",
                    bmp: frontBmp,
                    valid: false,
                    image: '',
                    attTyp:'20800002',
                    desc:'点击拍摄银行卡正面'
                },
                {
                    name: "back",
                    bmp: backBmp,
                    valid: false,
                    image: '',
                    attTyp:'20800003',
                    desc:'点击拍摄银行卡反面'
                }
            ]
        }
    },
    mounted () {
        let that = this
        let source = that.$route.query.source

        //订单详情跳转过来的重新绑卡-错误信息
        if(that.returnMsg){
            that.$vux.toast.text(that.returnMsg, "top");
            setLocalStorage('loanNo',that.$route.query.loanNo)
        }
        if(source){
            setLocalStorage('returnSource',source)
        }
        that.$axios
            .post(url.query, { params: { list: [{ type: "OPEN_ORG" }] } })
            .then(res => {
                if (res.data.code == "0000") {
                    that.bankOrgData = that.toData(res.data.result.OPEN_ORG);
                }else {
                    that.$vux.toast.text(res.data.msg, "top");
                }
            });
    },
    methods: {
        toData(data) {
            let that = this;

            //vux格式处理
            return [
                data.map(item => {
                    return { name: item.valName, value: item.valCode };
                })
            ];
        },
        addrChange(val) {
            let that = this;

            that.params.openProv = val[0];
            that.params.openCity = val[1];
            that.params.openAddr = val[2];
        },
        setValid(obj){
            let that = this

            if(obj.name == 'front'){
                that.ocrProps[0].valid = obj.key
            }else if(obj.name == 'back'){
                that.ocrProps[1].valid = obj.key
            }
        },
        setImage(obj){
            let that = this

            if(obj.name == 'front'){
                that.ocrProps[0].image = obj.image
            }else if(obj.name == 'back'){
                that.ocrProps[1].image = obj.image
            }
        },
        clearOcrInfo(name){
            let that = this

            //正面
            if(name === 'front'){
                that.params.acctNo = ''
                that.bankOrgDef = []
            }else if(name === 'back'){//反面

            }

        },
        uploaded(data) {
            let that = this
            let {side,number,bank} = data

            if(number != 'null'){
                that.params.acctNo = number.replace(/\s/g,'')
            }
            that.matchBank(bank)
            that.load = true
        },
        matchBank(bank){
            let that = this
            let spec = '';

            //过滤文字
            if(bank === '中国银行'){
                spec = bank
            }else{
                spec = bank.replace('中国','').replace('银行','')
            }

            //匹配码表
            for(let item of that.bankOrgData[0]){
                if(item.name.indexOf(spec) > -1){
                    that.bankOrgDef = [item.value]
                    return false;
                }
            }
            //that.$vux.toast.text(`暂时不支持${bank}卡`, "top");
            that.bankOrgDef = []
        },
        valid(){
            let that = this

            that.params.openOrg = that.bankOrgDef[0];

            for(let item of that.ocrProps){
                if(!item.valid){
                    that.$vux.toast.text(`请${item.desc}`,'top')
                    return false;
                }
            }

            if (!checkBankCard(that.params.acctNo)) {
                that.$vux.toast.text("请输入15-19位卡号", "top");
                return false;
            }else if (!that.bankOrgDef.length) {
                that.$vux.toast.text("请选择开户行", "top");
                return false;
            } else if (!that.defaultAddr.length) {
                that.$vux.toast.text("请选择开户地区", "top");
                return false;
            }else if(!checkPhone(that.params.phoneNo)){
                that.$vux.toast.text('手机号码不正确','top')
                return false;
            }

            return true
        },
        checkedIdcard() {
            let that = this;
            let source = that.$route.query.source

            if(!that.valid()) return false;

            that.$axios.post(url.getBankCardInfo, {
                params: {
                    name: that.params.acctName,
                    id_card_num: that.params.idCard,
                    bank_card_num: that.params.acctNo,
                    phone_num: that.bankPhoneNo
                }
            }).then(res => {
                if (res.data.code === "0000") {
                    let {card_type,bank_name,is_matched} = res.data.result.bankInfo

                    //银行卡类别，DC:借记卡、CC:贷记卡、SCC:准贷记卡、PC:预付费卡、null:未知
                    if(is_matched){//是否是本人
                        if(card_type === "DC"){//是否储蓄卡
                            that.params.bankName = bank_name

                            if(source && source == 'my'){
                                that.submit()
                            }else{
                                that.querySignStatus()
                            }

                        }else{
                            that.$vux.toast.text(
                                "请绑定储蓄卡",
                                "top"
                            );
                        }
                    }else{
                        that.$vux.toast.text(
                            "身份证、姓名和银行卡不匹配",
                            "top"
                        );
                    }
                }else {
                    that.$vux.toast.text(res.data.msg, "top");
                }
            });
        },
        querySignStatus(){
            let that = this

            //获取是否需要协议支付
            that.$axios.post(url.querySignStatus,{params: {
                signPhoneNo:getLocalStorage('phoneNo'),
                certNo:getUserInfo('certNo'),
                bankCardNo:that.params.acctNo,
                prodNo:getLocalStorage('prodNo'),
                realName:that.params.acctName
            }}).then(res => {
                let {code,msg,result,params} = res.data

                if(code == '0000'){
                    //玖富过滤民生、农业银行
                    if(params.chanNo == '045'){
                        if(that.bankOrgDef[0] == '20200006' || that.bankOrgDef[0] == '20200007'){
                            that.$vux.toast.text("暂时不支持民生、农业银行，请选择其他银行", "top");
                            //更新银行列表
                            that.bankOrgData = [that.bankOrgData[0].filter(item => item.value != '20200006' && item.value != '20200007')]
                            return false;
                        }
                    }

                    if(result.isCreate == 'yes' && result.code == '000000'){
                        //跳转到协议支付
                      setLocalStorage("bankPhoneNo", that.bankPhoneNo)
                      that.params.phoneNo = that.bankPhoneNo
                        that.$router.push({
                            path: '/signApply',
                            query: {
                                params: JSON.stringify(that.params)
                            }
                        })
                    }else{
                        that.submit()
//                      if (getLocalStorage("isCheckPolicy") == "13900001") {
//                        that.checkZhongAn()
//                      } else {
//                        that.submit()
//                      }
                    }
                }else{
                    that.$vux.toast.text(msg, "top");
                }
            })
        },
        submit() {
            let that = this;
            let source = that.$route.query.source
            let sUrl = url.saveCardInfo

            //订单详情跳转过来的重新绑卡
            if(source && source != 'my'){
                that.params.loanNo = getLocalStorage('loanNo')
                that.params.bankType = '42800001'
                sUrl = url.saveSyncInfo
            }

            that.$axios.post(sUrl, {
                params: that.params
            }).then(res => {
                if (res.data.code === "0000") {
                    if(source){
                        that.$vux.toast.show({
                            text: "保存成功",
                            onHide() {
                                that.$router.push(source)
                            }
                        });
                    }else{
                        saveAuth(that.authType,(data) => {
                            that.$vux.toast.show({
                                text: "认证成功",
                                onHide() {
                                    setLocalStorage('bankNo',that.params.acctNo)
                                    that.$router.push('authentication')
                                }
                            });
                        });
                    }
                }else{
                    that.$vux.toast.text(res.data.msg, "top");
                }
            });
        },
      checkZhongAn () {
        //核保众安保险是否成功
        const that = this
        that.$axios.post(url.zhongAnCheck, {
          params: {
            "loanNo": getLocalStorage("loanNo"),
            "prodNo": getLocalStorage("prodNo")
          }
        }).then(function (res) {
          let result = res.data
          if (result.code == "0000") {
            if (result.result.code == "0000") {
              that.$router.push({
                path: '/confirmInsurance',
                query: {
                  params: JSON.stringify(that.params)
                }
              })
            } else {
              that.$vux.toast.show({
                text: result.result.msg,
                onHide() {
                  that.submit()
                }
              });
            }
          } else {
            that.$vux.toast.text(result.msg, "top");
          }
        })
      }
    }
}
</script>
