<style lang="less">

</style>

<template>
    <div id="wrapper">
        <group label-width="5.5em" class="group-input-right">
            <x-input title="公司名称" v-stat="{key:'comNam',blur:'comNam',focus:'CcomNam'}" :max="30" v-model="params.workUnit" placeholder="请输入公司名称"></x-input>
            <x-input title="公司电话" v-stat="{key:'comPho',blur:'comPho',focus:'CcomPho'}" :max="15"  v-model="params.unitTel" placeholder="请输入公司电话(例:02800000000)"></x-input>
            <popup-picker title="所属行业:" v-stat="{key:'comInd',click:'CcomInd'}" v-if="load" v-model="industryDef" :data="industryData" :show-name="true" placeholder="请选择公司所属行业"></popup-picker>
            <popup-picker title="公司地址" v-stat="{key:'comAdd',click:'CcomAdd'}" v-if="load" :data="address" :columns="3" v-model="defaultAddr" :show-name="true" @on-change="addrChange" placeholder="请选择公司地址"></popup-picker>
            <x-textarea title="详细地址" v-stat="{key:'comAddDet',blur:'comAddDet',focus:'CcomAddDet'}" :max="50" v-model="params.unitAddr" placeholder="请输入详细地址信息，如道路、门牌号、小区、楼栋号、单元室等"></x-textarea>
            <div class="p15 color-6">
                <p>温馨提示</p>
                <p class="mt15 mb5">1.为了保证审核通过率，请<span class="red">务必确保电话可以接通</span></p>
                <p>2.公司电话可以输入单位固话（如02800000）或手机号</p>
            </div>
        </group>
        <div class="p10 mt70">
            <a class="btn" @click="submit" v-stat="{key:'Csub',click:'Csub'}">提交</a>
        </div>
    </div>
</template>

<script>
import { XInput, Group, PopupPicker, XTextarea } from "vux";
import { saveAuth,checkTel } from "@/assets/js/utils.js"

export default {
    components: {
        XInput,
        Group,
        PopupPicker,
        XTextarea
    },
    data() {
        return {
            address: require("@/data/address.json"),
            params: {
                phoneNo: getLocalStorage("phoneNo") || "",
                workUnit: "",
                unitTel: "",
                industry: "",
                unitProv: "",
                unitCity: "",
                unitArea: "",
                unitAddr: ""
            },
            authType:AUTH_TYPE.company,
            defaultAddr: [],
            industryData: [],
            industryDef: [],
            load:false
        };
    },
    mounted() {
        let that = this;

        that.$axios.post(url.codeQuery, {
                params: {
                    list: [{ type: "Industry" }]
                }
        }).then(res => {
            let { Industry } = res.data.result

            that.industryData = that.toData(Industry);

        });

        //查询公司信息
        that.$axios.post(url.getCustWork,{params: {phoneNo:that.params.phoneNo}}).then(res => {
            if(res.data.code == '0000'){
                if(!res.data.result.workUnit){
                    that.load = true
                    return false;
                }

                that.params = mergeObject(that.params, res.data.result);

                let {unitProv,unitCity,unitArea,industry} = that.params

                that.industryDef[0] = industry

                if(unitProv) that.defaultAddr = [unitProv,unitCity,unitArea]
                
                that.load = true
            }else {
                that.$vux.toast.text(res.data.msg, "top");
            }

        })        
    },
    methods: {
        addrChange(val) {
            let that = this

            that.params.unitProv = val[0]
            that.params.unitCity = val[1]
            that.params.unitArea = val[2]
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
        submit(){
            let that = this
            let {unitTel,workUnit,unitAddr} = that.params

            if(!workUnit){
                that.$vux.toast.text("请输入公司名称", "top");
                return false;
            }else if(!unitTel){
                that.$vux.toast.text("请输入公司电话", "top");
                return false;
            }else if(!checkTel(unitTel)){
                that.$vux.toast.text("公司电话格式不正确", "top");
                return false;
            }else if(!that.industryDef[0]){
                that.$vux.toast.text("请选择所属行业", "top");
                return false;
            }else if(!that.defaultAddr.length){
                that.$vux.toast.text("请选择公司地址", "top");
                return false;
            }else if(unitAddr.replace(/(^\s*)|(\s*$)/g, "").length == 0){
                that.$vux.toast.text("请输入详细地址", "top");
                return false;
            }else if(unitAddr.length < 5){
                that.$vux.toast.text("详细地址不能小于5个字", "top");
                return false;
            }

            that.params.industry = that.industryDef[0]

            that.$axios.post(url.saveCustWork,{params: that.params}).then(res => {
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