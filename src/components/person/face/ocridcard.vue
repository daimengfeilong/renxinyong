// /**************************
// 2018-07-13
// 身份认证-拍摄身份证
// 人员：zxl
// **************************/
<style lang="less">

</style>

<template>
    <div id="wrapper" class="face-verify">
        <p class="face-head">点击拍摄本人身份证正反面</p>
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
            <p class="face-head">请确认您的身份证信息</p>
            <x-input title="真实姓名" type="text" v-stat="{key:'reaNam',blur:'reaNam',focus:'CreaNam'}" :max="12" v-model="realname" placeholder="请输入真实姓名"></x-input>
            <x-input title="身份证号" type="text" v-stat="{key:'perIdCod',blur:'perIdCod',focus:'CperIdCod'}" :max="18" v-model="idcard_number" placeholder="请输入身份证号"></x-input>
            <div class="box box-items p15">
                <div style="width:4.5em">
                    有效期
                </div>
                <div class="flex-1">
                    <div class="box box-items">
                        <div class="flex-1 text-right" @click="showTime(validStart,'start')" v-stat="{key:'Cdealin1',click:'Cdealin1',value:validStart}">{{validStart}}&nbsp;<x-icon type="ios-arrow-down" size="20" class="middle" fill="#b2b2b2"></x-icon></div>
                        <div style="width:100px" @click="showTime(validEnd,'end')" v-stat="{key:'Cdealin2',click:'Cdealin2',value:validEnd}">--&nbsp;&nbsp;{{validEnd}}</div>
                        <x-icon type="ios-arrow-down" size="20" fill="#b2b2b2"></x-icon>
                    </div>
                </div>
            </div>
        </group>
        <div class="p15 mt30">
            <a class="btn" @click="submit" v-stat="{key:'CnexSte',click:'CnexSte'}">下一步</a>
        </div>
    </div>
</template>

<script>
import { XInput, Group, PopupPicker, Datetime } from "vux";
import { checkName,checkIdcard,checkIdcardDate,saveAuth } from "@/assets/js/utils.js"
import Ocr from "../../common/person/OcrIdcard";
import frontBmp from "@/assets/image/person/face_examples_front.png";
import backBmp from "@/assets/image/person/face_examples_back.png";

export default {
    components: {
        XInput,
        Group,
        PopupPicker,
        Datetime,
        Ocr
    },
    data () {
        return {
            ocrInfo:{},//正反面的信息
            realname:'',
            idcard_number:'',
            validStart:'',
            validEnd:'',
            authType: AUTH_TYPE.idcard,
            sexData: [],
            sexDef: [],
            ethnicData: [],
            ethnicDef: [],
            ocrProps: [//ocr数据模型
                {
                    name: "front",
                    bmp: frontBmp,
                    valid: false,
                    image: '',
                    attTyp:'20800004',
                    desc:'拍摄身份证人像面'
                },
                {
                    name: "back",
                    bmp: backBmp,
                    valid: false,
                    image: '',
                    attTyp:'20800005',
                    desc:'拍摄身份证国徽面'
                }
            ]
        }
    },
    mounted () {

    },
    methods: {
        showTime(time,type){
            let that = this
            
            that.$vux.datetime.show({
                value: time,
                startDate:"1960-01-01",
                endDate:"2050-12-31",
                confirmText:'确认',
                cancelText:'取消',
                onConfirm (v) {
                    if(type == 'start'){
                        that.validStart = v
                    }else{
                        that.validEnd = v
                    }
                },
            })
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
                that.realname = ''
                that.idcard_number = ''
            }else if(name === 'back'){//反面
                that.validStart = ''
                that.validEnd = ''
            }
            
        },
        parseDate(str){
            if(str.length === 2){//长期
                return str
            }else{
                return `${str.substr(0,4)}-${str.substr(4,2)}-${str.substr(6,4)}`
            }
        },
        getOcrInfo(key){
            try{
                return JSON.parse(getLocalStorage('ocridcard'))[key]
            }catch(e){
                return ''
            }
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
        getCodeQuery(){
            let that = this
            
            //获取名族/性别码表做匹配
            that.$axios.post(url.codeQuery, {
                    params: {
                        list: [{ type: "sex" }, { type: "nation" }]
                    }
            }).then(res => {
                    let {sex,nation} = res.data.result
                    that.sexData = that.toData(sex);
                    that.sexDef[0] = that.matchDef(that.sexData,this.getOcrInfo('gender'))
                    that.ethnicData = that.toData(nation);
                    that.ethnicDef[0] = that.matchDef(that.ethnicData,this.getOcrInfo('race'),'族')
                    
                    that.setParams()
            });

        },
        uploaded(data) {
            let that = this
            let {name,idcard_number,side,valid_date_start,valid_date_end} = data
            
            //正面
            if(side === 0){
                that.realname = name.result
                that.idcard_number = idcard_number.result
            }else if(side === 1){//反面
                that.validStart = that.parseDate(valid_date_start.result)
                that.validEnd = that.parseDate(valid_date_end.result)
            }

            //ocrInfo只提供给localOcr使用，业务逻辑到OcrIdcard.vue里面处理
            that.ocrInfo = Object.assign(that.ocrInfo,data)
        },
        setLocalOcr(){
            let that = this
            let localOcr = {}

            let {
                birth_year       = {},//生日-年
                birth_month      = {},//生日-月
                birth_day        = {},//生日-日
                address          = {},//户藉地址
                nationality      = {},//民族
                gender           = {},//性别
                name             = {},//名字
                idcard_number    = {},//身份证号码
                issued_by        = {},//发证机关
                valid_date_start = {},//身份证有效期
                valid_date_end   = {},//身份证有效期
            } = that.ocrInfo

            //正面
            localOcr.address          = address.result
            localOcr.race             = nationality.result
            localOcr.gender           = gender.result
            localOcr.name             = name.result
            localOcr.id_card_number   = idcard_number.result
            localOcr.birthday         = `${birth_year.result}-${birth_month.result}-${birth_day.result}`

            //反面
            localOcr.issued_by        = issued_by.result
            localOcr.valid_date_start = that.parseDate(valid_date_start.result)
            localOcr.valid_date_end   = that.parseDate(valid_date_end.result)

            setLocalStorage('ocridcard',JSON.stringify(localOcr))
        },
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
        getOcrInfo(key){
            let that = this
            
            try{
                return JSON.parse(getLocalStorage('ocridcard'))[key] || ''
            }
            catch(e){
                that.queryBaseInfo()
            }
        },
        setParams(){
            let that = this

            that.params = {
                phoneNo      : getLocalStorage("phoneNo"),
                custName     : this.getOcrInfo('name'),
                sex          : that.sexDef[0],
                ethnic       : that.ethnicDef[0],
                certNo       : this.getOcrInfo('id_card_number'),
                certOrg      : this.getOcrInfo('issued_by'),
                certIssueDate: this.getOcrInfo('valid_date_start'),
                certValidDate: this.getOcrInfo('valid_date_end'),
                regAddr      : this.getOcrInfo('address')                
            }
        },
        submit(){
            let that = this

            for(let item of that.ocrProps){
                if(!item.valid){
                    that.$vux.toast.text(`请${item.desc}`,'top')
                    return false;
                }
            }

            //存储ocr信息
            that.setLocalOcr()
            that.getCodeQuery()

            let certNo = getUserInfo('certNo').toLocaleLowerCase()
            let idCardNumber = that.getOcrInfo('id_card_number').toLocaleLowerCase()
            let age = that.getAge(that.getOcrInfo('birthday'))


            if (!checkName(that.realname)) {
                that.$vux.toast.text("真实姓名不正确", "top");
                return false;
            } else if (!checkIdcard(that.idcard_number)) {
                that.$vux.toast.text("身份证号码不正确", "top");
                return false;
            } else if (!checkIdcardDate(that.validStart)) {
                that.$vux.toast.text("签发日期格式不正确", "top");
                return false;
            } else if (!checkIdcardDate(that.validEnd)) {
                that.$vux.toast.text("有效期格式不正确", "top");
                return false;
            }

            
            //年龄校验
            if(age < 22 || age > 55){
                that.$vux.toast.text("申请人年龄必须在22-55岁之间", "top");
                return false;
            }
            
            //强校验身份证号码与帐户信息身份证号码
            if(certNo){
                if(idCardNumber != certNo){
                    that.$vux.toast.text(`实名认证信息(${idCardNumber})与帐户信息不一致，请重新认证`, "top");
                    return false;
                }
            }

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
                                    text: '认证成功',
                                    onHide() {
                                        setLocalStorage(
                                            "userBaseInfo",
                                            JSON.stringify(data.data.params)
                                        );
                                        saveAuth(that.authType,data => {
                                            that.$router.push('authentication')
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
}
</script>