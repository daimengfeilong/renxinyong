<style lang="less">

</style>

<template>
    <div id="wrapper">
        <img src="@/assets/image/person/Prove_Img_IdentityProved@2x.png" alt="">
        <group label-width="6.5em">
            <x-input title="真实姓名:" v-stat="{key:'realNam',blur:'realNam',focus:'CrealNam'}" v-model="params.custName" readonly placeholder="请输入真实姓名"></x-input>
            <x-input title="身份证号:" v-stat="{key:'carId',blur:'carId',focus:'CcarId'}" v-model="params.certNo" readonly placeholder="请输入身份证号"></x-input>
            <popup-picker v-if="load" v-stat="{key:'sex',click:'Csex'}" title="性别:" :data="sexData" show-name v-model="sexDef" placeholder="请选择性别" value-text-align="left"></popup-picker>
            <popup-picker v-if="load" v-stat="{key:'nat',click:'Cnat'}" title="民族:" :data="ethnicData" show-name v-model="ethnicDef" placeholder="请选择民族" value-text-align="left"></popup-picker>
            <x-input title="户藉所在地:" v-stat="{key:'addOri',blur:'addOri',focus:'CaddOri'}" :max="50" v-model="params.regAddr" placeholder="请输入户藉所在地"></x-input>
            <datetime title="签发日期:" v-stat="{key:'staTimID',click:'CstaTimID',value:params.certIssueDate}" start-date="1960-01-01" end-date="2050-12-31" v-model="params.certIssueDate" value-text-align="left"></datetime>
            <datetime title="有效期至:" v-stat="{key:'worTim',click:'CworTim',value:params.certValidDate}" start-date="1960-01-01" end-date="2050-12-31" v-model="params.certValidDate" value-text-align="left"></datetime>
            <x-input title="签发机关:" v-stat="{key:'idcOff',click:'CidcOff'}" :max="50" v-model="params.certOrg" placeholder="请输入签发机关"></x-input>
        </group>
        <p class="p10 warnColor2 fs14">*以上信息如有错误请校正修改。</p>
        <div class="p10 mt20 mb30">
            <a class="btn" :class="{'disabled':!isOnly}" v-stat="{key:'Cnex',click:'Cnex'}" @click="submit">下一步</a>
        </div>
    </div>
</template>

<script>
import { XInput, Group, PopupPicker, Datetime} from "vux";
import { checkName,checkIdcard,saveAuth,checkIdcardDate } from "@/assets/js/utils.js"

export default {
    components: {
        XInput,
        Group,
        PopupPicker,
        Datetime
    },
    data() {
        return {
            params: {
                phoneNo      : getLocalStorage("phoneNo") || "",
                custName     : '',
                sex          : '',
                ethnic       : '',
                certNo       : '',
                certOrg      : '',
                certIssueDate: '',
                certValidDate: '',
                regAddr      : ''
            },
            authType: AUTH_TYPE.idcard,
            load: false,
            isOnly:true,
            sexData: [],
            sexDef: [],
            ethnicData: [],
            ethnicDef: []
        };
    },
    mounted() {
        let that = this;

        //获取码表
        that.$axios.post(url.codeQuery, {
                params: {
                    list: [{ type: "sex" }, { type: "nation" }]
                }
        }).then(res => {
                let {sex,nation} = res.data.result

                that.sexData = that.toData(sex);
                that.ethnicData = that.toData(nation);

                const gender = that.matchDef(that.sexData,this.getOcrInfo('gender'))
                const race = that.matchDef(that.ethnicData,this.getOcrInfo('race'),'族')
                that.sexDef = gender ? [gender] : []
                that.ethnicDef = race ? [race] : []
                
                //校验身份证号码
                that.validIdCard()
        });

    },
    methods: {
        getAge(strBirthday){         
            let returnAge = 0;  
            let strBirthdayArr = strBirthday.split("-");  
            let birthYear = strBirthdayArr[0];  
            let birthMonth = strBirthdayArr[1];  
            let birthDay = strBirthdayArr[2];
            
            let d = new Date();  
            let nowYear = d.getFullYear();  
            let nowMonth = d.getMonth() + 1;  
            let nowDay = d.getDate();  
            
            if(nowYear == birthYear){  
                returnAge = 0;//同年 则为0岁  
            }else{  
                let ageDiff = nowYear - birthYear ; //年之差  
                if(ageDiff > 0){  
                    if(nowMonth == birthMonth){  
                        let dayDiff = nowDay - birthDay;//日之差  
                        if(dayDiff < 0){  
                            returnAge = ageDiff - 1;  
                        }else{  
                            returnAge = ageDiff ;  
                        }  
                    }else{  
                        let monthDiff = nowMonth - birthMonth;//月之差  
                        if(monthDiff < 0){  
                            returnAge = ageDiff - 1;  
                        }else{  
                            returnAge = ageDiff ;  
                        }  
                    }  
                }else{  
                    returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天  
                }  
            }
            
            return returnAge;//返回周岁年龄  
            
        },
        validIdCard(){
            let that = this
            let certNo = getUserInfo('certNo').toLocaleLowerCase()
            let idCardNumber = this.getOcrInfo('id_card_number').toLocaleLowerCase()

            //强校验身份证号码与帐户信息身份证号码
            if(certNo){
                if(idCardNumber == certNo){
                    //一致取人脸识别信息
                    that.setParams()
                }else{
                    //不一致取服务器的
                    that.$vux.confirm.show({
                        title: '温馨提示',
                        content: `实名认证信息(${idCardNumber})与帐户信息不一致`,
                        confirmText:'重新认证',
                        onConfirm () {
                            removeLocalStorage('biz_id')
                            that.$router.push('face')
                        }
                    })

                    that.queryBaseInfo()
                    that.isOnly = false;
                }
            }else{
                that.setParams()
            }

        },
        setParams(){
            let that = this

            that.params = {
                phoneNo      : window.getLocalStorage("phoneNo") || "",
                custName     : this.getOcrInfo('name'),
                sex          : this.getOcrInfo('gender'),
                ethnic       : this.getOcrInfo('race'),
                certNo       : this.getOcrInfo('id_card_number'),
                certOrg      : this.getOcrInfo('issued_by'),
                certIssueDate: this.getOcrInfo('valid_date_start'),
                certValidDate: this.getOcrInfo('valid_date_end'),
                regAddr      : this.getOcrInfo('address')                
            }
            that.load = true;
        },
        matchDef(arr,name,tag = ''){
            let that = this
            let code = ''

            arr[0].map(item => {
                if(item.name == `${name}${tag}`){
                    code = item.value
                }
            })
            
            return code
        },
        queryBaseInfo(){
            let that = this

            //查询信息回显
            that.$axios.post(url.queryBaseInfo, {
                    params: {
                        phoneNo: that.params.phoneNo
                    }
                }).then(res => {
                    if(res.data.code == '0000'){
                        that.params = mergeObject(that.params, res.data.result);
                        that.sexDef[0] = that.params.sex;
                        that.ethnicDef[0] = that.params.ethnic;
    
                        that.load = true;
                    }else {
                        that.$vux.toast.text(res.data.msg, "top");
                    }
            });            
        },
        getOcrInfo(key){
            let that = this
            
            try{
                return JSON.parse(getLocalStorage('ocridcard'))[key] || ''
            }
            catch(e){
                that.queryBaseInfo()
            }
        },
        getDay(AddDayCount = 0) {
            let date = new Date();

            //AddDayCount当前日期加几天
            date.setDate(date.getDate() + AddDayCount || 0);
            let y = date.getFullYear();
            let m = date.getMonth() + 1;
            let d = date.getDate();

            //今天
            return `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}`;
        },
        toData(data) {
            let that = this;

            //vux格式处理
            return [
                data.map(item => {
                    return { name: item.valName, value: item.valCode };
                })
            ];
        },
        submit() {
            let that = this;
            let { custName, certNo, certOrg,ethnic,sex,regAddr,certIssueDate,certValidDate } = that.params;
            let age = that.getAge(that.getOcrInfo('birthday'))

            
            //年龄校验
            if(age < 22 || age > 55){
                that.$vux.toast.text("申请人年龄必须在22-55岁之间", "top");
                return false;
            }

            if (!checkName(custName)) {
                that.$vux.toast.text("真实姓名不正确", "top");
                return false;
            } else if (!checkIdcard(certNo)) {
                that.$vux.toast.text("身份证号码不正确", "top");
                return false;
            } else if (!that.sexDef[0]) {
                that.$vux.toast.text("请选择性别", "top");
                return false;
            } else if (!that.ethnicDef[0]) {
                that.$vux.toast.text("请选择民族", "top");
                return false;
            } else if (!regAddr) {
                that.$vux.toast.text("请输入户藉所在地", "top");
                return false;
            } else if (regAddr.length <= 6) {
                that.$vux.toast.text("户藉所在地必须大于6个字符", "top");
                return false;
            } else if (!checkIdcardDate(certIssueDate)) {
                that.$vux.toast.text("签发日期格式不正确", "top");
                return false;
            } else if (!checkIdcardDate(certValidDate)) {
                that.$vux.toast.text("有效期格式不正确", "top");
                return false;
            } else if (!certOrg) {
                that.$vux.toast.text("请输入签发机关", "top");
                return false;
            }

            //性别/民族
            that.params.ethnic = that.ethnicDef[0];
            that.params.sex = that.sexDef[0];

            //保存
            that.$vux.confirm.show({
                title: '',
                content: '请确认您个人身份证信息准确无误',
                onConfirm () {
                    that.$axios
                        .post(url.saveBaseInfoExt, { params: that.params })
                        .then(data => {
                            if (data.data.code == "0000") {
                                that.$vux.toast.show({
                                    text: data.data.msg,
                                    onHide() {
                                        setLocalStorage(
                                            "userBaseInfo",
                                            JSON.stringify(data.data.params)
                                        );
                    
                                        saveAuth(that.authType,data => {
                                            that.$router.push("authentication");
                                        });  
                                        
                                    }
                                });
                            } else {
                                that.$vux.toast.text(data.data.msg, "top");
                            }
                        });                    
                }
            })

        }
    }
};
</script>