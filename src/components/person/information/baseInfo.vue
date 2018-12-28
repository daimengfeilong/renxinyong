<style lang="less">
    .auth-active{
        .vux-cell-align-left{
            color:green!important
        }        
    }
</style>


<template>
    <div id="wrapper">
        <div class="pt10 pl15 fs14">居住地址</div>
        <group label-width="7em" class="group-input-right">
            <popup-picker title="省市区" v-stat="{key:'proCit',click:'CproCit'}" :data="address" :columns="3" v-model="defaultAddr" :show-name="true" @on-change="addrChange" placeholder="请选择现居住址"></popup-picker>
            <x-input title="详细地址" v-stat="{key:'detAre',blur:'detAre',focus:'CdetAre'}" :max="50" v-model="params.liveAddr" placeholder="详细地址精确到门牌号"></x-input>
        </group>
        <div class="pt10 pl15 fs14">其他信息</div>
        <group label-width="7em" class="group-input-right">
            <popup-picker title="学历" v-stat="{key:'deg',click:'Cdeg'}" v-if="load" :data="eduData" show-name v-model="eduDef" placeholder="请选择学历"></popup-picker>
            <popup-picker title="婚姻状况" v-stat="{key:'merr',click:'Cmerr'}" v-if="load" :data="marrData" show-name v-model="marrDef" placeholder="请选择婚姻状况"></popup-picker>
            <popup-picker title="职业" v-stat="{key:'care',click:'Ccare'}" v-if="load" :data="jobData" show-name v-model="jobDef" placeholder="请选择职业"></popup-picker>
            <x-input title="QQ号码" v-stat="{key:'qq',blur:'qq',focus:'Cqq'}" type="tel" :max="11" v-model="params.qq" placeholder="请输入QQ号码"></x-input>
            <!-- 使用input disabled IOS会有问题 -->
            <div class="box p15">
                <div class="flex-1">电子邮箱</div>
                <div class="flex-1 text-right">{{`${params.qq}@qq.com`}}</div>
            </div>
            <popup-picker title="有无贷款" v-stat="{key:'ynSpl',click:'CynSpl'}" v-if="load" :data="overdraftData" show-name v-model="overdraftDef" placeholder="请选择有无分期"></popup-picker>
            <x-input title="分期金额" v-stat="{key:'othLoa',blur:'othLoa',focus:'CothrLoa'}" label-width="10em" type="tel" :max="10" v-if="overdraftDef[0] == '13900001'" v-model="params.othLoanPlatformsUnpaid" placeholder="请输入金额"></x-input>
            <popup-picker title="收入来源" v-if="load" :data="incomeData" show-name v-model="incomeDef" placeholder="请选择收入来源"></popup-picker>
            <popup-picker title="月收入" v-if="load" :data="monthData" show-name v-model="monthDef" placeholder="请选择月收入"></popup-picker>
        </group>
        <div class="pt5 fs14"></div>
        <group label-width="11em" class="group-input-right">
            <popup-picker title="征信报告" :data="creditReportData" v-model="creditReportDef" show-name placeholder="请选择"></popup-picker>
            <popup-picker title="历史是否有逾期" v-if="load" :data="overdueData" v-model="overdueDef" show-name placeholder="请选择历史是否有逾期"></popup-picker>
            <template v-if="creditReportDef[0] == '13900001' && overdueDef[0] == '13900001'">
                <x-input title="发生过逾期的账户数" type="tel" placeholder="请输入"></x-input>
                <x-input title="当前逾期金额（元）" type="tel" placeholder="请输入"></x-input>
            </template>
        </group>
        <div class="p10 mt20">
            <a class="btn" @click="saveInfo()" v-stat="{key:'Csub',click:'Csub'}">提交</a>
        </div>
    </div>
</template>

<script>
import { XInput, Group, PopupPicker, Cell,TransferDom,XDialog } from "vux";
import { checkAuth,checkPrice,saveAuth } from "@/assets/js/utils.js";

export default {
    components: {
        XInput,
        Group,
        PopupPicker,
        Cell,
        TransferDom,
        XDialog
    },
    data() {
        return {
            params: {//基础信息
                phoneNo: getLocalStorage('phoneNo') || getUserInfo('phoneNo'),
                qq: "",
                workJob: "",
                edu: "",
                marriage: "",
                liveProv: "",
                liveCity: "",
                liveArea: "",
                liveAddr: "",
                postAlCode:"",
                othLoanPlatformsInfo:"",//有无分期
                othLoanPlatformsUnpaid:"",//其他平台金额
                jfIncomeSource:"",//收入来源
                jfIncome:"",//月收入
                isCreditOverdue:"",//是否有逾期
            },
            authType:AUTH_TYPE.baseinfo,
            loanNo:getLocalStorage('loanNo'),
            defaultAddr: [],
            address: require("@/data/address.json"),
            jobData: [],//职业
            jobDef: [],
            eduData: [],//学历
            eduDef: [],
            marrData: [],//婚姻
            marrDef: [],
            overdraftData:[[{value:"13900001",name:"是"},{value:"13900002",name:"否"}]],//有无分期
            overdraftDef:[],
            creditReportData:[[{value:"13900001",name:"是"},{value:"13900002",name:"否"}]],//征信报告
            creditReportDef:[],
            overdueData:[[{value:"13900001",name:"是"},{value:"13900002",name:"否"}]],//逾期
            overdueDef:[],
            incomeData: [],//收入来源
            incomeDef: [],
            monthData: [],//月收入
            monthDef: [],
            load:false
        };
    },
    created(){
        let that = this
    },
    mounted() {
        let that = this;

        that.queryBaseInfo()
        that.codeQuery()
    },
    methods: {
        codeQuery(){
            let that = this
            
            //获取码表
            that.$axios.post(url.codeQuery, {
                    params: {
                        list: [
                            { type: "Work_Job" },
                            { type: "Education" },
                            { type: "Marriage_Status" },
                            { type: "Income_Source" },
                            { type: "Month_Income" }
                        ]
                    }
            }).then(res => {
                let { Work_Job, Education, Marriage_Status, Income_Source, Month_Income } = res.data.result;

                that.jobData = that.toData(Work_Job);
                that.eduData = that.toData(Education);
                that.marrData = that.toData(Marriage_Status);
                that.incomeData = that.toData(Income_Source);
                that.monthData = that.toData(Month_Income);
            });
        },
        queryBaseInfo(){
            let that = this
            
            //查询信息回显
            that.$axios.post(url.queryBaseInfo, {
                    params: {
                        phoneNo: that.params.phoneNo
                    }
                }).then(res => {
                    let {othLoanPlatformsInfo,othLoanPlatformsUnpaid,qq} = res.data.result

                    if (!qq) {
                        that.load = true;
                        return false;
                    }
                    
                    that.params = mergeObject(that.params, res.data.result);
                    let {workJob,edu,marriage,liveProv,liveCity,liveArea,jfIncomeSource,jfIncome,isCreditOverdue} = that.params

                    if(workJob) that.jobDef[0] = workJob;
                    if(edu) that.eduDef[0] = edu;
                    if(marriage) that.marrDef[0] = marriage;
                    if(jfIncomeSource) that.incomeDef[0] = jfIncomeSource;
                    if(jfIncome) that.monthDef[0] = jfIncome;
                    if(isCreditOverdue) that.overdueDef[0] = isCreditOverdue;

                    if(liveProv) that.defaultAddr = [liveProv,liveCity,liveArea]
                    
                    //有无分期
                    that.overdraftDef[0] = othLoanPlatformsInfo
                    
                    
                    //其他平台未还本金
                    if(othLoanPlatformsUnpaid){
                        that.params.othLoanPlatformsUnpaid = othLoanPlatformsUnpaid.split('.')[0]
                    }

                    that.load = true;
                });
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
        addrChange(val) {
            let that = this;

            that.params.liveProv = val[0];
            that.params.liveCity = val[1];
            that.params.liveArea = val[2];
        },
        valid(){
            let that = this;
            let qqReg = /^[\d]{5,11}$/;
            let { qq, liveAddr,postAlCode } = that.params;
            let postCodeReg = /^\d{6}$/

            if(!that.defaultAddr.length){
                that.$vux.toast.text("请选择现居地址", "top");
                return false;
            }else if (liveAddr.replace(/(^\s*)|(\s*$)/g, "").length == 0) {
                that.$vux.toast.text("详细地址不能为空", "top");
                return false;
            }else if (liveAddr.length <= 6) {
                that.$vux.toast.text("详细地址不能小于6个字符", "top");
                return false;
            }else if (!that.eduDef[0]) {
                that.$vux.toast.text("请选择学历", "top");
                return false;
            } else if (!that.marrDef[0]) {
                that.$vux.toast.text("请选择婚姻状况", "top");
                return false;
            } else if (!that.jobDef[0]) {
                that.$vux.toast.text("请选择职业", "top");
                return false;
            }else if (!qqReg.test(qq)) {
                that.$vux.toast.text("QQ号码格式不正确", "top");
                return false;
            } else if (!that.overdraftDef[0]) {
                that.$vux.toast.text("请选择有无分期", "top");
                return false;
            } else if (that.overdraftDef[0] == '13900001') {
                if(!that.params.othLoanPlatformsUnpaid){
                    that.$vux.toast.text("请输入分期金额", "top");
                    return false;
                }else if(!checkPrice(that.params.othLoanPlatformsUnpaid)){
                    that.$vux.toast.text("分期金额只支持正整数", "top");
                    return false;
                }
            }

            if (!that.incomeDef[0]) {
                that.$vux.toast.text("请选择收入来源", "top");
                return false;
            } else if (!that.monthDef[0]) {
                that.$vux.toast.text("请选择月收入", "top");
                return false;
            } else if (!that.creditReportDef[0]) {
                that.$vux.toast.text("请选择征信报告", "top");
                return false;
            } else if (!that.overdueDef[0]) {
                that.$vux.toast.text("请选择历史是否有逾期", "top");
                return false;
            }
            

            return true;
        },
        saveInfo() {
            let that = this;
            let source = that.$route.query.source

            if(!that.valid()) return false;
            
            //职业/学历/婚姻
            that.params.workJob = that.jobDef[0];
            that.params.edu = that.eduDef[0];
            that.params.marriage = that.marrDef[0];
            that.params.othLoanPlatformsInfo = that.overdraftDef[0]
            that.params.jfIncomeSource = that.incomeDef[0]
            that.params.jfIncome = that.monthDef[0]
            that.params.isCreditOverdue = that.overdueDef[0]

            //保存
            that.$axios.post(url.saveBaseInfoExt, { params: that.params }).then(data => {
                if (data.data.code == "0000") {
                    saveAuth(that.authType,data => {
                        that.$router.push('authentication')
                    });

                } else {
                    that.$vux.toast.text(data.data.msg, "top");
                }
            });
        }
    }
};
</script>
