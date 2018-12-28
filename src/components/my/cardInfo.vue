<template>
    <div class="my-card-info">
        <group label-width="6.5em">
            <x-input name="acctName" ref="acctName" title="银行卡户名:" placeholder="请输入开户人姓名" text-align="right" v-model="formData.acctName" readonly></x-input>
            <popup-picker title="银行卡开户行:" :data="bankName" :columns="1" v-model="currentOrg" placeholder="请选择开户行" value-text-align="right" show-name></popup-picker>
            <x-input name="acctNo" ref="acctNo" type="number" keyboard="number" title="银行账户:" placeholder="请输入银行账户" text-align="right" v-model="formData.acctNo" required></x-input>
            <popup-picker title="开户地区:"  placeholder="请选择开户地区" :data="address" :columns="3" v-model="defaultAddr" :show-name="true" @on-change="addrChange"  value-text-align="right"></popup-picker>
        </group>
        <p class="tip">*温馨提示：当前只支持以下银行卡，请勿绑定其他银行卡，以免导致借款不成功。</p>
        <div class="bank-tips">
            <p class="warnColor2" v-for="item in tipsBankArr" :key="item.index">{{item.index}}、{{item.name}}</p>
        </div>
        <div class="p10 mt70">
            <a class="btn" @click="submit">提交</a>
        </div>
    </div>
</template>
<script>
import { XInput,Group,PopupPicker } from 'vux'
import Address from '../../data/address.json'
import { checkName } from "../../assets/js/utils.js"

export default {
    components: {
        XInput,
        Group,
        PopupPicker
    },
    data () {
        return {
            defaultAddr:[], //选中的地区
            address: Address, //地区列表
            bankName: [], //银行列表
            currentOrg: [], //选中的开户机构
            formData: {
                phoneNo: getLocalStorage("phoneNo"),
                acctNo: "", //银行卡号
                acctName: "", //开户名字
                openProv: "",  //开户省
                openCity: "",  //开户城市
                openAddr: "", //开户地区
                openOrg: "", //开户行
                bankName:""
            },
            myErrorsTitle: {
                acctNo: "银行账户",
                acctName: "银行卡户名",
            },
            tipsBankArr:[],
            validTotal: false, //是否可以提交
        }
    },
    methods: {
        initOpenOrg() {//获取银行列表
            this.$axios.post(url.query, {params: {list: [{"type": "OPEN_ORG", "level": "1"}]}}).then((response) => {
                if (response.data.code == "0000") {   
                    let orgList = response.data.result.OPEN_ORG||[]
                    let _orgList = orgList.filter(item => {return item.valCode !== '20200013'})

                    this.tipsBankArr = _orgList.map((item,index)=>{
                        return {name: item.valName, index: index + 1}
                    })
                    this.bankName = _orgList.map((item)=>{
                        return {name: item.valName, value: item.valCode}
                    })
                }
            });     
        },
        initCardInfo() {//获取银行卡信息
            this.$axios.post(url.getCardInfo, {params: {phoneNo: this.formData.phoneNo}}).then((response) => {
                if (response.data.code == "0000") { 
                    let data = response.data.result;
                    this.formData.acctName = data.acctName;
                    this.formData.acctNo = data.acctNo;

                    //过滤掉后端老数据返回为空的地址
                    if(data.openProv){
                        this.defaultAddr = [data.openProv, data.openCity, data.openAddr];
                    }
                    this.currentOrg = [data.openOrg]
                }
            });       
        },
        addrChange(val) { //添加地区
            this.formData.openProv = val[0];
            this.formData.openCity = val[1];
            this.formData.openAddr = val[2];
        },
        checkBankCard() { //验证银行卡
            let data = {
                name: this.formData.acctName,
                id_card_num: getUserInfo('certNo'),
                bank_card_num: this.formData.acctNo
            }
            this.$axios.post(url.getBankCardInfo, {params: data}).then((response) => {
               if (response.data.code == "0000") { 
                    if(!response.data.result.bankInfo.is_matched) {
                        this.$vux.toast.text("身份证、姓名和银行卡不匹配")
                        return false
                    }
                    if(response.data.result.bankInfo.card_type === "DC") {
                        this.formData.bankName = response.data.result.bankInfo.bank_name;
                        this.saveCardInfo();
                    } else {
                        this.$vux.toast.text("请输入正确的储蓄卡卡号")
                    }
                    
                }else{
                    this.$vux.toast.text(response.data.msg, 'top');
                }
            });  
        },
        saveCardInfo() {//保存银行卡
            this.$axios.post(url.saveCardInfo, {params: this.formData}).then((response) => {
                if (response.data.code == "0000") {   
                    var that = this
                    this.$vux.toast.show({
                        text: "保存成功!",
                        onHide() {
                            that.$router.go(-1)
                        }
                    });
                }else{
                    this.$vux.toast.text(response.data.msg, 'top');
                }
            });   
        },
        submit(){
            let that = this;
            this.formData.openOrg = this.currentOrg[0];
            let ref = that.$refs;   

            if (!checkName(this.formData.acctName)) {
                that.$vux.toast.text("姓名格式不正确", "top");
                return false;
            }

            for (let i of Object.keys(ref)) {
                if(ref[i].valid) { 
                    if(this.currentOrg.length && this.defaultAddr.length) {                        
                        that.validTotal = true;
                    }else if(!this.currentOrg.length) {
                        that.validTotal = false;
                        that.$vux.toast.text("请选择开户行", 'top');
                    }else if(!this.defaultAddr.length){
                        that.validTotal = false;
                        that.$vux.toast.text("请选择开户地区", 'top');
                    }else{
                        that.validTotal = false;
                    }
                }else{
                    that.validTotal = false
                    for(var j in ref[i].errors){
                        let msg = ref[i].errors[j];
                        if(j === 'required'){
                            msg = `${that.myErrorsTitle[i]}${msg}`;
                            that.$vux.toast.text(msg, 'top');
                        }else{
                            that.$vux.toast.text(msg, 'top');
                        }
                        break;                        
                    }
                    break;
                }
            }
            if(that.validTotal) {
                this.checkBankCard()                
            }
        }
    },
    created(){
        this.initOpenOrg();  
        this.initCardInfo(); 
    }
}
</script>
<style lang="less">
</style>
