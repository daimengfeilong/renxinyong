<style lang="less">

</style>

<template>
    <div id="wrapper">
        <p class="p15 warnColor2 fs14">* 请将储蓄卡及手机摆横拍摄；请确保储蓄卡字体清晰可见；请确保您的储蓄卡是在有效期内。</p>
        <div class="upload-wrap">
            <upload v-for="item in uploadProps" v-stat="{key:item.name == 'front' ? 'CuplBan1' : 'CuplBan2',click:item.name == 'front' ? 'CuplBan1' : 'CuplBan2'}" :key="item.attTyp" :name="item.name" :attTyp="item.attTyp" :bmp="item.bmp" :image="item.image" @upload="upload"></upload>
        </div>
        <div class="p10">
            <a class="btn" @click="submit" v-stat="{key:'Cnex',click:'Cnex'}">下一步</a>
        </div>
    </div>
</template>

<script>
import Upload from "../../common/person/Upload";
import frontBmp from "@/assets/image/person/Bank_Img_Front@2x.png";
import backBmp from "@/assets/image/person/Bank_Img_Back@2x.png";
import { saveAuth } from "../../../assets/js/utils.js"

export default {
    components: {
        Upload
    },
    data() {
        return {
            busiNo: getLocalStorage('loanNo'),
            authType:AUTH_TYPE.bankImg,
            uploadProps: [
                {
                    name: "front",
                    attTyp: "20800002",
                    bmp: frontBmp,
                    valid: false,
                    image: '',
                    errMsg: "请上传储蓄卡正面照片"
                },
                {
                    name: "back",
                    attTyp: "20800003",
                    bmp: backBmp,
                    valid: false,
                    image: '',
                    errMsg: "请上传储蓄卡背面照片"
                }
            ]
        };
    },
    mounted() {
        let that = this;

        that.$axios
            .post(url.getUploadedAtts, {
                params: { busiNo: that.busiNo }
            })
            .then(res => {
                if (res.data.result.length === 0) return false;

                //回显图片
                res.data.result.map(i => {
                    that.uploadProps.map(k => {
                        if (i.attTyp == k.attTyp) {
                            k.valid = true;
                            k.image = `/api/bycx-rece-service/tempSysAtt/load/downlowdID?id=${
                                i.id
                            }`;
                        }
                    });
                });
            });
    },
    methods: {
        upload(params) {
            let that = this;
            let formData = new FormData()

            let uploadParams = {
                busiNo: that.busiNo,
                busiType: "ios",
                queryType: "temp",
                ...params
            };

            this.$axios.post(url.uploadBase64, { params: uploadParams }).then(res => {
                if (res.data.code == "0000") {
                    that.uploadProps.map(item => {
                        if (item.name == params.oldAtt){
                            item.valid = true;
                            item.image = uploadParams.image;
                        }
                    });
                    that.$vux.toast.text("上传成功", "top");
                } else {
                    that.$vux.toast.text(res.data.msg, "top");
                }
            });
        },
        submit() {
            let that = this;
            let source = that.$route.query.source

            //验证
            for (let item of that.uploadProps) {
                if (!item.valid) {
                    that.$vux.toast.text(item.errMsg, "top");
                    return false;
                }
            }
            saveAuth(that.authType,(data) => {
                that.$vux.toast.show({
                    text: "认证成功",
                    onHide() {
                        if(source){
                            that.$router.push(source)
                        }else{   
                            that.$router.push("authentication");
                        }
                    }
                });
            });  
        }
    }
};
</script>