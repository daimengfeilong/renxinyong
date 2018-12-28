<template>
    <div class="prodIntrod">
        <group>
            <cell title="任信用" inline-desc="最高50000额度随便用" class="title">
                <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/image/prodIntrod/ProductDetail_Logo_RXY@2x.png">
            </cell>
        </group>
        <group>
            <cell title="借款额度" inline-desc="1000~50000" class="flex-2">
                <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/image/prodIntrod/ProductDetail_Logo_Limit@2x.png">
            </cell>
            <cell title="参考费率" inline-desc="≤3%" class="flex-2">
                <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/image/prodIntrod/ProductDetail_Logo_Rate@2x.png">
            </cell>
            <cell title="借款期数" inline-desc="3~12期" class="flex-2">
                <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/image/prodIntrod/ProductDetail_Logo_Volume@2x.png">
            </cell>
            <cell title="放款时间" inline-desc="最快1分钟" class="flex-2">
                <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/image/prodIntrod/ProductDetail_Logo_Time@2x.png">
            </cell>
        </group>
        <group>
            <cell title="产品详情">
                <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/image/prodIntrod/ProductDetail_Logo_Detail@2x.png">
            </cell>
            <cell title="申请条件" inline-desc="1.年龄限制： 22~55周岁" class="condition">
            </cell>
            <cell title="所需材料" class="materials">
                <p slot="inline-desc">1.身份证<br></p>                
                <p slot="inline-desc">2.储蓄卡<br></p>
                <p slot="inline-desc">3.信用卡<br></p>
                <p slot="inline-desc">4.手机实名认证<br></p>
            </cell>
        </group>
        <div class="login-btn pb40">
            <p class="mb10">点击“立即申请”视为同意<a href='http://apk.boyacx.com/jifen/renxinyong_agreement.html'>《注册协议》</a></p>
            <x-button :disabled="isAbled" @click.native="submit">立即申请</x-button>
        </div>
    </div>
</template>
<script>
import { Group, Cell, XButton} from 'vux'
import _ from 'underscore';
import codeList from "@/data/channel.code.json"
import {GetToken} from './../common/mixin/GetToken'
import {GetChannel} from "./../common/mixin/GetChannel"
export default {
    data(){
        return {
            channelList: {
				"channelName":"",
				"channelCode":"",
				"sourceOsType":"",
				"channelVal":""
            },
            codeList: codeList,
            isAbled: true, //按钮不能点击
            saveJson: {
                phoneNo:getQueryString('mobile'),
                sourceOsType: getLocalStorage('sourceOsType'), // 来源
                channNo: getLocalStorage('channelCode')
            },
        }
    },
    mixins: [GetToken,GetChannel], //获取Token,获取渠道
    components: {
        Group,
        Cell,
        XButton
    },
    created(){
        let routeVal = this.$route.params.channelVal
        let hash = window.location.hash.split('/')[2]

        this.channelList = _.findWhere(this.codeList,{"channelVal": routeVal || hash})
        if (getQueryString('mobile')) { // 免密登录
            this.isAbled = false
            removeLocalStorage('token')
            if(this.channelList.isSaveBrowseRecord && this.channelList.isSaveBrowseRecord === "0000") {
                // 针对360金融引流用户保存客户浏览记录
                this.saveBrowseRecord()
                return false
            }
            setLocalStorage('channelCode',this.channelList.channelCode)
            setLocalStorage('channelVal',this.channelList.channelVal)
            setLocalStorage('sourceOsType',this.channelList.sourceOsType)
            this.getToken()
        }
        else{
            this.isAbled = true
            this.$vux.toast.text("链接地址有误", 'top');
        }
    },
    methods:{
        submit() {
            this.$router.push({path:`/prodIntrod/${getLocalStorage('channelVal')}`})
        },
        saveBrowseRecord() {
            this.$axios.post(url.clientBrowseRecord,{params:this.saveJson}).then((response) => { 
                if(response.data.code == "0000") {
                // 将转码得到的用户的电话号码保存在本地缓存中
                    this.getTokenData.loginNo = response.data.result
                    setLocalStorage("phoneNo", response.data.result)
                    this.getToken()
                }else {
                    this.$vux.toast.text(response.data.msg, 'top');
                }
            })
        }
    }
}
</script>
<style lang="less">
    
</style>

