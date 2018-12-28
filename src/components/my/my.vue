<template>
    <div class="my pb60">
        <group class="head-cell">
            <router-link v-stat="{key:'CappPerInf',click:'CappPerInf'}" :to="{ path: '/myInfo', query: { custName: custName }}" tag="div">
                <cell :title="custName" :inline-desc="phoneNo" is-link>
                    <img slot="icon" class="headImg" width="20" style="display:block;margin-right:5px;" src="@/assets/image/Me_HeadPortrait_Default@2x.png">
                </cell>
            </router-link>
        </group>
        <group>
            <router-link v-stat="{key:'CmyOrd',click:'CmyOrd'}" to="/orderList" tag="div">
                <cell title="我的订单" is-link :class="isCertNo?'hasBorder':''">
                    <img slot="icon" class="icon" width="20" style="display:block;margin-right:5px;" src="@/assets/image/my/Me_Icon_MyOrder@2x.png">
                </cell>
            </router-link>
            <router-link v-stat="{key:'CmyBan',click:'CmyBan'}" :to="{path:'bankCard',query:{source:'my'}}" tag="div" v-if="isCertNo">
                <cell title="我的银行卡" is-link>
                    <img slot="icon" class="icon" width="20" style="display:block;margin-right:5px;" src="@/assets/image/my/Me_Icon_MyCard@2x.png">
                </cell>
            </router-link>
        </group>
        <group>
            <cell v-stat="{key:'Cprob',click:'Cprob'}" title="常见问题" is-link @click.native="goFaq" class="hasBorder">
                <img slot="icon" class="icon" width="20" style="display:block;margin-right:5px;" src="@/assets/image/my/Me_Icon_Question@2x.png">
            </cell>
            <cell v-stat="{key:'CintCon',click:'CintCon'}" title="智能客服" is-link @click.native="goService">
                <img slot="icon" class="icon" width="20" style="display:block;margin-right:5px;" src="@/assets/image/my/Me_Icon_Service@2x.png">
            </cell>
            <!-- <cell title="预约回电" is-link @click.native="goFeedback">
                <img slot="icon" class="icon" width="20" style="display:block;margin-right:5px;" src="@/assets/image/my/Me_Icon_Feedback@2x.png">
            </cell> -->
        </group>
        <group v-if="isMoney">
            <cell v-stat="{key:'CrapRoa',click:'CrapRoa'}" title="快速领钱通道" is-link @click.native="goMoney">
                <img slot="icon" class="icon" width="20" style="display:block;margin-right:5px;" src="@/assets/image/my/Me_Icon_Money@2x.png">
            </cell>
        </group>
        <group v-if="isExit">
            <cell v-stat="{key:'Cexi',click:'Cexi'}" title="退出" @click.native="logout">
                <img slot="icon" class="icon" width="20" style="display:block;margin-right:5px;" src="@/assets/image/my/Me_Icon_Exit@2x.png">
            </cell>
        </group>
    </div>
</template>
<script>
import { Group, Cell } from "vux";

export default {
    data() {
        return {
            phoneNo: getLocalStorage("phoneNo"),
            custName: "", //用户姓名
            isCertNo: getUserInfo("certNo") ? true : false, //有身份证号显示我的银行卡
            isExit: getQueryString("mobile") ? false : true, //是否显示退出按钮，免密登录不显示
            isMoney: getLocalStorage("refuseStat") === "13800002" ? true : false //是否显示快速领钱通道按钮
        };
    },
    components: {
        Group,
        Cell
    },
    methods: {
        goFaq() {
            //跳转到常见问题
            window.location.href = `http://help.boyacx.com/wap/my_kefu.html`;
        },
        goService() {
            //跳转智能客服
            window.location.href = `http://ymn.boyacx.com/#/AI`;
        },
        goMoney() {
            //跳转快速领钱通道
            let isBar =
                getLocalStorage("fromApp") === "0000" ? "&?fromApp=0000" : "";
            window.location.href = `${yinliu_URL}?mobile=${getLocalStorage(
                "phoneNo"
            )}${isBar}&token=${getLocalStorage("token")}&target=h5`;
        },
        goFeedback(){
            window.location.href = `http://rxyh5.boyacx.com/feedback/#/index?name=${getUserInfo("custName")}&phone=${getLocalStorage('phoneNo')}&idcard=${getUserInfo("certNo")}`
        },
        logout() {
            //退出登录,删掉所以信息回到登录界面
            removeLocalStorage("phoneNo");
            removeLocalStorage("code"); //首次注册的密码默认是验证码
            removeLocalStorage("token");
            this.$router.push({ path: "/" });
        },
        initInfo() {
            this.$axios
                .post(url.queryBaseInfo, { params: { phoneNo: this.phoneNo } })
                .then(response => {
                    if (response.data.code == "0000") {
                        localStorage.setItem("custNo", response.data.result.custNo)
                        this.custName = response.data.result.custName;
                    } else {
                        this.$vux.toast.text(response.data.msg, "top");
                    }
                });
        }
    },
    created() {
        this.initInfo();
    }
};
</script>
<style lang="less">
</style>

