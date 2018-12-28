<style lang="less">

</style>

<template>
    <div id="wrapper">
        <!-- <img src="/api/bycx-rece-service/tempSysAtt/load/downlowdID?id=b9e69ec8b3e3412f818dab8332ac14a870wp" alt=""> -->
        <div class="p15">
            <p class="fs14 color-3">1.拍照示范：上传本人身份证证件照时</p>
            <img src="@/assets/image/person/face_tips@2x.png" class="mt10" alt="">
        </div>
        <div class="p15">
            <p class="fs14 color-3">2.拍摄您本人人脸请使用前置摄像头，坐姿端正光线充足</p>
            <div class="text-center">
                <img v-if="disabled" src="@/assets/image/person/face_default@2x.png" style="width:130px;" class="mt10" alt="">
                <img v-else src="@/assets/image/person/face_success@2x.png" style="width:130px;" class="mt10" alt="">
            </div>
        </div>
        <div class="p15 mt30">
            <a class="btn" v-if="disabled" :class="{'disabled':isUpload}" v-stat="{key:'CperAut',click:'CperAut'}" @click="toFace">我知道了，去认证</a>
            <a class="btn" v-else v-stat="{key:'Cnex',click:'Cnex'}" @click="queryCheckNumber">下一步</a>
        </div>
    </div>
</template>

<script>
import { Upload } from '../../common/mixin/Upload'
import { checkName,checkIdcard } from "@/assets/js/utils.js"

export default {
    data() {
        return {
            phoneNo:getLocalStorage('phoneNo'),
            busiNo: getLocalStorage('loanNo'),
            biz_id:'',//face唯一标识
            disabled:true,//流程操作是否成功
            isUpload:false,//正在上传状态
            params: {
                user_id: getLocalStorage('loanNo'),
                data_list: [
                    {
                        key: "face_score",
                        data: {
                            id_card: "",
                            phone_num: getLocalStorage('phoneNo'),
                            name: "",
                            score: '0'//次数必须是字符串
                        }
                    }
                ]
            }
        }

    },
    mixins:[Upload],
    created(){
        let that = this
        let biz_id = this.$route.query.biz_id
        let bizObj = {}

        if(!biz_id) return false;

        //保存biz_id与手机号码绑定
        that.biz_id = biz_id
        bizObj[that.phoneNo] = biz_id
        setLocalStorage('biz_id',JSON.stringify(bizObj))

    },
    mounted() {
        let that = this;
        let source = this.$route.query.source

        if(!that.getBizId()) return false;

        if(source){
            that.disabled = true

            that.$vux.confirm.show({
                title: '操作提示',
                content: '是否重新进行实名认证？',
                onConfirm () {
                    that.toFace()
                },
                onCancel(){
                    that.getFaceResult()
                }
            })
            return false;
        }

        that.getFaceResult()

    },
    methods: {
        getBizId(){
            let that = this

            try{
                return JSON.parse(getLocalStorage('biz_id'))[that.phoneNo]
            }
            catch(e){
                return ''
            }
        },
        getFaceResult(){
            let that = this

            if(!that.getBizId()) return false;

            //按钮置灰
            that.isUpload = true

            //获取人脸识别信息
            that.$axios.post(url.faceidGetResult,{params: {
                biz_id:that.getBizId(),
                return_image:'4'
            }}).then(res => {
                if(res.data.code == '0000'){
                    let {verify_result,status,idcard_info,images} = res.data.result

                    if(status === 'OK'){
                        let {confidence} = verify_result.result_faceid

                        if(confidence > 70){
                            try{
                                that.setLocalOcr(res.data.result)
                            }catch(e){
                                that.$vux.toast.text("身份识别信息不完整，请重新认证。", "top");
                                that.isUpload = false;
                                return false;
                            }
                            //相似度
                            that.params.data_list[0].data.score = ''+confidence
                            //身份证、姓名
                            let {idcard_name,idcard_number} = idcard_info

                            that.params.data_list[0].data.name = idcard_name
                            that.params.data_list[0].data.id_card = idcard_number

                            //如果识别出来的姓名/身份证不正确提示重新认证
                            if (!checkName(idcard_name) || !checkIdcard(idcard_number)) {
                                that.$vux.confirm.show({
                                    title: '操作提示',
                                    content: `识别信息：${idcard_name}或${idcard_number}失败！请重新认证`,
                                    onConfirm () {
                                        that.toFace()
                                    }
                                })
                                return false;
                            }

                            //自动上传图片
                            if(Object.keys(images).length){
                                let{image_idcard_front,image_idcard_back,image_best} = images

                                
                                //正面
                                that.upload(image_idcard_front,20800004).then(data => {
                                    //反面
                                    return that.upload(image_idcard_back,20800005)
                                }).then(data => {
                                    //人脸
                                    return that.upload(image_best,20800022)
                                }).then(data => {
                                    //活体
                                    return that.upload(image_best,20800001)
                                }).then(data => {
                                    //1234依次上传完成
                                    that.disabled = false
                                })

                            }

                        }else{
                            that.$vux.toast.text("人脸识别度小于70请重新认证", "top");
                            that.isUpload = false
                        }
                    }else{
                        that.$vux.toast.text("人脸识别失败，请重新认证", "top");
                        that.isUpload = false
                    }
                }else{
                    that.$vux.toast.text(res.data.msg, "top");
                    that.isUpload = false
                }
            })
        },
        perseDate(n){
            return n > 10 ? n : '0'+n
        },
        toFace(){
            let that = this

            that.$axios.post(url.faceidGetToken,{"params":{
                return_url:`${FACEID_RETURN_URL}/bycx-rece-service/third/faceId/getTokenCallback`,//faceid回调后端接口地址
                notify_url:`${FACEID_RETURN_URL}/bycx-rece-service/third/faceId/getTokenCallback`,
                redirect_url:`${window.location.origin}/#/face`,//后端重定向到前端的地址
                comparison_type:"1",
                idcard_mode:"2"
            }}).then(res => {
                let {token,error,error_message} = res.data.result

                if(token){
                    window.location.href = `https://api.megvii.com/faceid/lite/do?token=${token}`
                }else{
                    that.$vux.toast.text(error || error_message, "top");
                }
            })
        },
        setLocalOcr(data){
            let that = this
            let localOcr = {}

            let {issued_by,valid_date} = data.idcard_info.back_side.ocr_result
            let {birthday,address,race,gender,name,id_card_number} = data.idcard_info.front_side.ocr_result

            //正面
            localOcr.address          = address
            localOcr.race             = race
            localOcr.gender           = gender
            localOcr.name             = name
            localOcr.id_card_number   = id_card_number
            localOcr.birthday = `${birthday.year}-${that.perseDate(birthday.month)}-${that.perseDate(birthday.day)}`

            //反面
            localOcr.issued_by = issued_by
            localOcr.valid_date_start = valid_date.split('-')[0].split('.').join('-')
            localOcr.valid_date_end   = valid_date.split('-')[1].split('.').join('-')

            setLocalStorage('ocridcard',JSON.stringify(localOcr))
        },
        addCheckNumber(){
            let that = this

            //保存人脸识别次数
            that.$axios.post(url.addCheckNumber,{
                "params": {
                    "phoneNo": getLocalStorage('phoneNo'),
                    "checkType": "36700001",
                    "appType": "25800006",
                    "checkResult":that.params.data_list[0].data.score
                }
            }).then(res => {
                if(res.data.success){
                    that.submit()
                }else{
                    that.$vux.toast.text(res.data.msg, "top");
                }
            })
        },
        queryCheckNumber(){
            let that = this

            //查询人脸识别次数
            that.$axios.post(url.queryCheckNumber,{
                "params": {
                    "phoneNo": getLocalStorage('phoneNo'),
                    "checkType": "36700001",
                    "appType": "25800006"
                }
            }).then(res => {
                if(res.data.success){
                    if(res.data.result < FACE_NUM){
                        that.addCheckNumber()
                    }else{
                        that.$vux.toast.text("操作过于频繁，请明日再试", "top");
                        return false;
                    }
                }
            })

        },
        submit() {
            let that = this;

            that.$axios.post(url.saveFaceSimilarity,{params: that.params}).then(res => {
                if(res.data.code == '0000'){

                    that.$router.push("idenitiy");
                    
                }else {
                    that.$vux.toast.text(res.data.msg, "top");
                }
            })

        }
    }
};
</script>