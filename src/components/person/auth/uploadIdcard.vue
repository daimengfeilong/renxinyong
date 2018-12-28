<style lang="less">

</style>

<template>
    <div id="wrapper">
        <p class="p15 warnColor2">*请将身份证及手机摆横拍摄；请确保身份证字体清晰可见；请确保您的身份证是在有效期内；本人手拿身份证正面拍上半身照，脸部清晰无遮挡。</p>
        <div class="upload-wrap">
            <upload v-for="item in uploadProps" :key="item.attTyp" :name="item.name" :attTyp="item.attTyp" :bmp="item.bmp" @upload="ocrIdcard"></upload>
        </div>
        <div class="p10">
            <a class="btn" @click="submit">下一步</a>
        </div>
    </div>
</template>

<script>
import Upload from "../../common/person/Upload";
import frontBmp from "@/assets/image/person/Identity_Img_Front@2x.png";
import backBmp from "@/assets/image/person/Identity_Img_Opposite@2x.png";
import holdBmp from "@/assets/image/person/Identity_Img_HoldIt@2x.png";

export default {
    components: {
        Upload
    },
    data() {
        return {
            busiNo: getLocalStorage('loanNo'),
            uploadProps: [
                {
                    name: "front",
                    attTyp: "20800004",
                    bmp: frontBmp,
                    valid: false,
                    errMsg: "请上传身份证国徽面照片"
                },
                {
                    name: "back",
                    attTyp: "20800005",
                    bmp: backBmp,
                    valid: false,
                    errMsg: "请上传身份证人像面照片"
                },
                {
                    name: "hold",
                    attTyp: "20800023",
                    bmp: holdBmp,
                    valid: false,
                    errMsg: "请上传手持身份证照片"
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
                            k.bmp = `/api/bycx-rece-service/tempSysAtt/load/downlowdID?id=${
                                i.id
                            }`;
                        }
                    });
                });
            });
    },
    methods: {
        perseDate(n){
            return n > 10 ? n : '0'+n
        },
        ocrIdcard(params) {
            let that = this;

            let upladParams = {
                busiNo: that.busiNo,
                busiType: "ios",
                queryType: "temp",
                ...params
            };


            let ocrParams = {
                legality:1,
                image:upladParams.image
            }

            //手持照片
            if(upladParams.oldAtt == 'hold'){
                that.upload(upladParams)
                return false;
            }

            that.$axios.post(url.checkIdcard,{params:ocrParams}).then(res => {
                if(res.data.code == '0000'){
                    const result = res.data.result
                    let n = 0

                    //上传的是否是身份证照片检测
                    for(let i in result.legality){
                        let item = result.legality[i]
                        if(item === 0){
                            n++
                        }

                    }

                    if(n === 5){
                        that.$vux.toast.text("请上传身份证照片", "top");
                        return false;
                    }
                    
                    that.setLocalOcr(result,upladParams)
                    
                }else{
                    that.$vux.toast.text(res.data.msg, "top");
                }
            })
        },
        setLocalOcr(data,params){
            let that = this
            
            let {
                birthday       = '',
                address        = '',
                race           = '',
                gender         = '',
                name           = '',
                id_card_number = '',
                issued_by      = '',
                valid_date     = '',
                side
            } = data

            let localOcr = {}
            
            //国徽面
            if(side == 'back'){
                localOcr.issued_by = issued_by
                localOcr.valid_date_start = valid_date.split('-')[0].split('.').join('-')
                localOcr.valid_date_end   = valid_date.split('-')[1].split('.').join('-')
            }else if(side == 'front'){
                //人像面
                localOcr.address          = address
                localOcr.race             = race
                localOcr.gender           = gender
                localOcr.name             = name
                localOcr.id_card_number   = id_card_number
                localOcr.birthday = `${birthday.year}-${that.perseDate(birthday.month)}-${that.perseDate(birthday.day)}`
            }

            setLocalStorage('ocridcard',that.mergeLocal(localOcr))
            that.upload(params)

        },
        mergeLocal(o){
            let that = this
            let local = JSON.parse(getLocalStorage('ocridcard'))

            if(local){
                for(let i in o){
                    local[i] = o[i]
                }
                return JSON.stringify(local)
            }else{
                return JSON.stringify(o)
            }

        },
        upload(params) {
            let that = this;

            this.$axios.post(url.uploadBase64, { params: params }).then(res => {
                if (res.data.code == "0000") {
                    that.uploadProps.map(item => {
                        if (item.name == params.oldAtt){
                            item.valid = true;
                            item.bmp = params.image;
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

            if(source){
                that.$router.push(source)
            }else{   
                that.$router.push("idenitiy");
            }
        }
    }
};
</script>