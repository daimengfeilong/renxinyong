<style lang="less">
.ua-input {
    width: 100%;
    margin: 20px 0;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
}
</style>

<template>
    <div>
        <x-dialog
            v-model="show"
            :dialog-style="{'max-width': '90%','border-rudius':'10px', width: '100%', height: '50%', 'background-color': 'transparent'}"
        >
            <div class="p30 text-left" style="background:#fff;border-radius: 5px;">
                <div class="box">
                    <div class="pr15">修改类型</div>
                    <div
                        class="flex-1"
                        v-for="item in tabs"
                        :key="item.value"
                        @click="itemChose(item)"
                    >
                        <img
                            src="@/assets/image/person/check_Icon_Chose@2x.png"
                            v-if="item.checked"
                            style="width:14px;"
                            alt
                        >
                        <img
                            src="@/assets/image/person/check_Icon_Default@2x.png"
                            v-else
                            style="width:14px;"
                            alt
                        >
                        <label class="middle">{{item.name}}</label>
                    </div>
                </div>
                <input
                    v-model="params.changeValue"
                    v-if="params.changeType === '01'"
                    class="ua-input"
                    type="text"
                    placeholder="请输入姓名"
                >
                <input
                    v-model="params.changeValue"
                    v-if="params.changeType === '02'"
                    class="ua-input"
                    type="tel"
                    placeholder="请输入手机号"
                >
                <a class="btn" @click="submit">确定</a>
            </div>
            <x-icon
                type="ios-close-outline"
                @click="closeDialog"
                style="fill:#fff;margin-top:20px;width:45px;height:45px;"
            ></x-icon>
        </x-dialog>
        <Rocket v-if="showRocket"></Rocket>
    </div>
</template>

<script>
import { XDialog } from "vux";
import Rocket from "../Rocket";
import { checkPhone, checkName } from "@/assets/js/utils.js";

export default {
    components: {
        XDialog,
        Rocket
    },
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            showRocket: false, //火箭
            tabs: [
                {
                    checked: true,
                    name: "名字",
                    value: "01"
                },
                {
                    checked: false,
                    name: "手机号",
                    value: "02"
                }
            ],
            params: {
                chanNo: "045",
                certNo: getUserInfo("certNo"),
                backUrl: window.location.href,
                changeType: "01", //修改类型(01 名字,02 手机号)
                changeValue: "" //姓名或者手机号
            }
        };
    },
    mounted() {},
    methods: {
        closeDialog() {
            this.$emit("closeDialog", false);
        },
        formSubmit(url) {
            let that = this;

            that.showRocket = true;
            setTimeout(() => {
                // 判断到底以哪种方式进行页面跳转 星火返回js代码
                if (url.indexOf("<script") === -1) {
                    window.location.href = url;
                    return false;
                }

                let node = document.createElement("div");
                node.id = "innerHtmlContainer";
                document.body.appendChild(node);
                document.querySelector(
                    "#innerHtmlContainer"
                ).innerHTML = url.split("<script")[0];
                document.querySelector("#innerHtmlContainer form").submit();
            }, 2000);
        },
        itemChose(item) {
            this.tabs.map(item => (item.checked = false));

            item.checked = true;
            this.params.changeType = item.value;
            this.params.changeValue = "";
        },
        valid() {
            const { changeType, changeValue } = this.params;

            if (changeType == "01") {
                if (!checkName(changeValue)) {
                    this.$vux.toast.text("请输入正确的姓名", "top");
                    return false;
                }
            } else if (changeType == "02") {
                if (!checkPhone(changeValue)) {
                    this.$vux.toast.text("请输入正确的手机号", "top");
                    return false;
                }
            }

            return true;
        },
        submit() {
            if (!this.valid()) return false;

            this.$axios
                .post(url.openInfoUpdate, {
                    params: this.params
                })
                .then(res => {
                    if (res.data.code === "0000") {
                        this.closeDialog()
                        this.formSubmit(res.data.result.url);
                    } else {
                        this.$vux.toast.text(res.data.msg, "top");
                    }
                });
        }
    }
};
</script>