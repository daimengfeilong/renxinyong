<style lang="less">
.contact-wrap{
    .weui-cells{
        margin: 0!important;
    }
    .head{
        padding: 10px 0 10px 15px;
        font-size: 14px;
        background: #f7f7f9;
        color: #666
    }
}
</style>

<template>
    <div id="wrapper" class="contact-wrap">
        <group label-width="5.5em">
            <div v-for="(item,index) in params.list" :key="index">
                <div class="head">{{item.title}}</div>
                <x-input title="姓名" v-stat="{key:`parNam${index +1 }`,blur:`parNam${index +1 }`,focus:`CparNam${index +1 }`}" :max="12" v-model="item.contactName" placeholder="请输入联系人姓名"></x-input>
                <x-input title="联系电话" v-stat="{key:`parPho${index +1 }`,blur:`parPho${index +1 }`,focus:`CparPho${index +1 }`}" :max="11" v-model="item.contactTel" placeholder="请输入紧急联系人电话"></x-input>
                <popup-picker title="关系" v-stat="{key:`rela${index +1 }`,click:`Crela${index +1 }`}" v-if="load" :data="item.relaData" v-model="item.relaDef" :show-name="true" @on-change="relaChange" placeholder="请选择联系人关系" value-text-align="left"></popup-picker>
            </div>
        </group>
        <div class="p10 mt70">
            <a class="btn" @click="submit" v-stat="{key:'Csub',click:'Csub'}">提交</a>
        </div>
    </div>
</template>

<script>
import { XInput, Group, PopupPicker } from "vux";
import { checkPhone,saveAuth,checkName } from "@/assets/js/utils.js"
import { Readable } from 'stream';

export default {
    components: {
        XInput,
        Group,
        PopupPicker
    },
    data() {
        return {
            load:false,
            authType:AUTH_TYPE.contact,
            phoneNo:getLocalStorage('phoneNo'),
            params: {
                list: [
                    {
                        contactTel: "",
                        contactName: "",
                        contactRel: "",
                        title:'联系人1',//后端不接收
                        relaData:[],//后端不接收
                        relaDef:[]//后端不接收
                    },
                    {
                        contactTel: "",
                        contactName: "",
                        contactRel: "",
                        title:'联系人2',//后端不接收
                        relaData:[],//后端不接收
                        relaDef:[]//后端不接收
                    }
                ]
            },
        };
    },
    mounted() {
        let that = this;

        that.getCodeQuery()

    },
    methods: {
        getCodeQuery(){
            let that = this;

            that.$axios.post(url.codeQuery, {
                params: {
                    list: [{ type: "Relation" }]
                }
            }).then(res => {
                let {Relation} = res.data.result
                let tempData1 = []
                let tempData2 = []

                for(let item of Relation){
                    if(item.valCode == '20100001' || item.valCode == '20100008'){
                        tempData1.push({ name: item.valName, value: item.valCode })
                    }else{
                        tempData2.push({ name: item.valName, value: item.valCode })
                    }
                }

                that.params.list[0].relaData[0] = tempData1
                that.params.list[1].relaData[0] = tempData2
                
                that.getContctQuery()
            });

        },
        getContctQuery(){
            let that = this;

            that.$axios.post(url.getContctQuery,{params: {phoneNo:that.phoneNo}}).then(res => {
                if(res.data.code === '0000'){

                    if(!res.data.result.length){
                        that.load = true
                        return false;
                    }

                    for(let item in res.data.result){
                        let listItem0 = that.params.list[0]
                        let listItem1 = that.params.list[1]
                        let resultItem = res.data.result[item]

                        //后端返回的list是按contactRel排序，顺序不固定得写死赋值
                        if(resultItem.contactRel == '20100001' || resultItem.contactRel == '20100008'){                            
                            listItem0.contactName = resultItem.contactName
                            listItem0.contactTel = resultItem.contactTel
                            listItem0.contactRel = resultItem.contactRel
                            listItem0.relaDef[0] = resultItem.contactRel
                        }else{
                            listItem1.contactName = resultItem.contactName
                            listItem1.contactTel = resultItem.contactTel
                            listItem1.contactRel = resultItem.contactRel
                            listItem1.relaDef[0] = resultItem.contactRel                            
                        }
                        
                    }

                    that.load = true
                }else {
                    that.$vux.toast.text(res.data.msg, "top");
                }
            })
        },
        relaChange(v){
            let that = this
            
            if(v == '20100001' || v == '20100008'){//联系人1
                that.params.list[0].contactRel = v[0]
            }else{//联系人2
                that.params.list[1].contactRel = v[0]
            }
        },
        submit() {
            let that = this

            //验证
            for (let item of that.params.list) {
                if (!item.contactName) {
                    that.$vux.toast.text(`请输入${item.title}姓名`, "top");
                    return false;
                }if (!checkName(item.contactName)) {
                    that.$vux.toast.text(`${item.title}姓名格式不正确`, "top");
                    return false;
                }else if(!checkPhone(item.contactTel)){
                    that.$vux.toast.text(`${item.title}电话格式不正确`, "top");
                    return false;                    
                }else if(!item.contactRel){
                    that.$vux.toast.text(`请选择${item.title}关系`, "top");
                    return false;                    
                }
            }

            //同盾信息校验
            that.$axios.post(url.tongdun,{
                "selected_data": ["td_customer_info"],
                "user_info":{
                    "id_card_num":getUserInfo('certNo'),  
                    "name": getUserInfo('custName'), 
                    "phone_num": getLocalStorage('phoneNo'),
                    "user_id": getLocalStorage('loanNo'),
                    "platform":"web",
                    "ip_address":""
                }
            })

            that.$axios.post(url.saveContct,{params: that.params}).then(res => {
                if(res.data.code === '0000'){
                    saveAuth(that.authType,(data) => {
                        that.$vux.toast.show({
                            text: "认证成功",
                            onHide() {
                                that.$router.push('authentication')
                            }
                        });
                    });              
                }else {
                    that.$vux.toast.text(res.data.msg, "top");
                }
            })
        }
    }
};
</script>