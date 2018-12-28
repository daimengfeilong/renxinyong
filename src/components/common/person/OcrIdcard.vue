// /**************************
// 2018-07-17
// 身份证识别组件
// changeImageSize-压缩图片，changeFile-选择图片，upload-上传
// 人员：zxl
// **************************/
<style lang="less">

</style>

<template>
    <div class="flex-1">
        <div class="upload-box" v-stat="{key:name == 'front' ? 'Cshoo1' : 'Cshoo2',click:name == 'front' ? 'Cshoo1' : 'Cshoo2'}">
            <img :src="bmp" alt="">
            <div class="perview" v-if="image" :style="{backgroundImage: `url(${image})`}">
                <template v-if="valid">
                    <img src="@/assets/image/person/success_icon.png" alt="">
                    <p class="green fs16 mt5">认证成功</p>
                </template>
                <template v-else>
                    <img src="@/assets/image/person/reject_icon.png" alt="">
                    <p class="red fs16 mt5">认证失败，请重试</p>
                </template>
            </div>
            <input type="file" accept="image/*" capture="camera" :ref="name" @change="changeFile">
        </div>
        <p class="mt10 text-center fs14">{{desc}}</p>
    </div>
</template>

<script>
import { checkIdCard } from '@/assets/js/angleCal.js'

export default {
    props: {
        name: {
            type: String,
            default: ""
        },
        desc: {
            type: String,
            default: ""
        },
        attTyp: {
            type: String,
            default: ""
        },
        maxWidth: {
            type: Number,
            default: MAX_WIDTH
        },
        maxHeight: {
            type: Number,
            default: MAX_HEIGHT
        },
        quality: {
            type: Number,
            default: 0.8
        },
        bmp: {
            required: true,
            type: String
        },
        image: {
            required: true,
            type: String
        },
        valid: {
            required: true,
            type: Boolean
        },
    },
    methods: {
        changeFile(e) {
            let that = this;
            let files = e.target.files;
            let maxsize = 10 * 1024 * 1024; //10M
            const reader = new FileReader();

            if(!e.target.files.length) return false;
            
            that.$vux.loading.show({text: ''})

            //获取图片文件
            reader.onload = function(e) {
                //that.image = e.target.result;
                that.changeImageSize(e.target.result).then(newSrc => {
                    that.upload(newSrc)
                })
            };
            reader.readAsDataURL(files[0]);
        },
        changeImageSize(src) {
            let that = this;

            return new Promise((resolve,reject) => {
                const img = new Image();
                img.src = src;
                let newSrc = "";
    
                //压缩图片
                img.onload = function() {
                    let iWidth = img.width;
                    let iHeight = img.height;
                    let nWidth = iWidth,
                        nHeight = iHeight;
    
                    if (iWidth > iHeight) {
                        //宽型图片
                        if (iWidth > that.maxWidth) {
                            nWidth = that.maxWidth;
                            nHeight = iHeight / iWidth * nWidth;
                        }
                    } else if (iHeight > iWidth) {
                        //高型图片
                        if (iHeight > that.maxHeight) {
                            nHeight = that.maxHeight;
                            nWidth = iWidth / iHeight * nHeight;
                        }
                    }
    
                    let can = document.createElement("canvas");
                    let ctx = can.getContext("2d");
                    can.width = nWidth;
                    can.height = nHeight;
                    ctx.drawImage(img, 0, 0, nWidth, nHeight);
    
                    newSrc = can.toDataURL("image/jpeg", that.quality);
                    resolve(newSrc);
                };
            })

        },
        uploadBase64(bold){
            let that = this
            
            let uploadParams = {
                image: bold,
                attTyp: that.attTyp,
                oldAtt: 'img',
                busiNo: getLocalStorage('loanNo'),
                busiType: "ios",
                queryType: "temp",
            }
    
            this.$axios.post(url.uploadBase64, { params: uploadParams }).then(res => {
                if(res.data.code == '0000'){
                    // setLocalStorage(`ocr${that.name}`,`/api/bycx-rece-service/tempSysAtt/load/downlowdID?id=${res.data.result.id}`)
                }else {
                    that.$vux.toast.text(res.data.msg, "top");
                }
            })
        },
        reject(msg){
            let that = this
            
            /**
             * 检验不通过方法
             * 1、显示错误信息-设置显示时间
             * 2、显示认证失败
             * 3、清除文本框信息
             */
            that.$vux.toast.show({
                type:'text',
                text:msg,
                position:'top',
                width:'15em',
                time:3000
            });
            that.$emit("setValid", {key:false,name:that.name});
            that.$emit("clearOcrInfo", that.name);
            return false;
        },
        upload(bold) {
            let that = this;
            let obj = {
                image: bold,
                stat:'0'
            };

            //上传操作
            that.$axios.post(url.checkPicture,{params:obj}).then(res => {
                let { result,code,msg } = res.data
                let ua = navigator.userAgent

                //清除input value--某些浏览器不能重复选择一张照片
                that.$refs[that.name].value = ''

                if(code == '0000'){
                    that.$emit("setImage", {image:bold,name:that.name});

                    //识别是否成功
                    if(!result.error){
                        //校验图片-正面
                        if(that.name == 'front' && result.side != 0){
                            return that.reject('请拍摄身份证人像面')
                        }
                        
                        //校验图片-反面
                        if(that.name == 'back' && result.side != 1){
                            return that.reject('请拍摄身份证国徽面')
                        }

                        //校验性别/民族
                        if(that.name == 'front'){
                            if(result.nationality.result == '' || result.gender.result == ''){
                                return that.reject('性别或者民族识别失败，请重试')
                            }
                        }

                        //检测图片完整性
                        if(result.completeness != 0){
                            return that.reject('请拍摄完整的证件照')
                        }

                        //校验图片角度
                        if(!checkIdCard(result.card_rect)){
                            return that.reject('身份证角度倾斜过大，请重试')
                        }

                        //检测图片识别的结果信息
                        if(result.result != 1001){
                            return that.reject('识别存在异常，请重试')
                        }

                        /**
                         * 所有校验通过
                         */
                        //往我们服务器上传图片
                        that.uploadBase64(bold)
                        //显示认证成功提示
                        that.$emit("setValid", {key:true,name:that.name});
                        //通知父组件
                        that.$emit("uploaded", result);
                        
                    }else if(result.error == 'ID_CARD_NOT_FOUND'){
                        return that.reject('请拍摄身份证照片')
                    }else if(result.error == 'INVALID_IMAGE_SIZE: image'){
                        if(/android/gi.test(ua) && /qqbrowser/gi.test(ua)){
                            return that.reject('抱歉，暂不支持QQ浏览器')
                        }else{
                            return that.reject('图片像素过大或者过小')
                        }
                    }else{
                        return that.reject(result.error)
                    }

                }else{
                    that.$vux.toast.text(msg, "top");
                }
            })
        }
    }
};
</script>