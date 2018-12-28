// /**************************
// 2018-07-13
// 上传视频-face人脸识别
// 人员：zxl
// **************************/

<style lang="less">

</style>

<template>
    <div id="wrapper" class="face-verify">
        <div class="face-success mt30" v-if="faceValid">
            <div class="text-center">
                <img :src="image_best" style="width:150px;" alt="">
                <p class="mt15 bold fs16">恭喜您，认证成功！</p>
            </div>
            <div class="p10 mt70">
                <a class="btn" @click="queryCheckNumber" v-stat="{key:'CnexSte',click:'CnexSte'}">下一步</a>
            </div>
        </div>
        <div class="text-center mt70" v-else>
            <img style="width:130px" src="@/assets/image/person/face_default@2x.png" alt="">
            <p class="fs16 mt20 mb30"><b>录制一段自己朗读如下数字的视频</b></p>
            <div class="random-number">
                <a v-for="(item, index) in randomNumber.split('')" :key="index">{{item}}</a>
            </div>
            <div class="step-text mt30">
                <p>1.请使用<span class="red">前置摄像头</span></p>
                <p>2.请用普通话读一遍</p>
                <p>3.视频时长<span class="red">3-5秒</span></p>
            </div>
            <div class="p15 mt30 upload-video" :class="{'overlay':timeDisabled >= 1}" v-stat="{key:'CstaVid',click:'CstaVid'}">
                <a class="btn disabled" v-if="timeDisabled >= 1">请牢记数字({{timeDisabled}}s后录制)</a>
                <a class="btn" v-else>开始录制</a>
                <input type="file" accept="video/*" capture="user" ref="faceVideo" @change="changeFile" />
            </div>
        </div>
    </div>
</template>

<script>
import { Upload } from '../../common/mixin/Upload'
import { saveAuth } from "@/assets/js/utils.js"

export default {
    data () {
        return {
            timeDisabled:5,//倒计数5s
            conutDownTimer:null,//定时器
            randomNumber:'0000',//face随机数
            token_random_number:'',//face随机数token
            image_best:'',//人脸图片
            token_video:'',//人脸识别之后token
            faceValid:false,//人脸识别验证结果
            authType: AUTH_TYPE.face,
            params: {//大数据-保存人脸识别信息
                user_id: getLocalStorage('loanNo'),
                data_list: [
                    {
                        key: "face_score",
                        data: {
                            id_card: "",
                            phone_num: getLocalStorage('phoneNo'),
                            name: "",
                            score: '0'//相似度必须是字符串
                        }
                    }
                ]
            }
        }
    },
    mixins:[Upload],
    mounted () {
        let that = this
        
        //获取随机数
        that.getRandomNumber()
    },
    beforeDestroy(){
        removeLocalStorage('returnSource')
    },
    methods: {
        conutDownDisabled () {
            let that = this;

            that.conutDownTimer = window.setInterval(() => {
                if((that.timeDisabled--) <= 1) {
                    window.clearInterval(that.conutDownTimer);
                }
            }, 1000)              
        },
        getRandomNumber(){
            let that = this
            
            //获取人脸识别随机数-params必须传空→_→
            that.$axios.post(url.getRandomNumber,{params:{}}).then(res => {
                if (res.data.code == "0000") {
                    let {random_number,token_random_number,error_message} = res.data.result

                    if(!error_message){
                        that.randomNumber = random_number
                        that.token_random_number = token_random_number
                        that.conutDownDisabled()
                    }else{
                        that.showToast(error_message);
                    }
                } else {
                    that.showToast(res.data.msg);
                }
            })
        },
        showToast(msg){
            let that = this
            
            //显示错误信息-设置显示时间
            that.$vux.toast.show({
                type:'text',
                text:msg,
                position:'top',
                width:'17em',
                time:4000
            });
        },
        changeFile(e) {
            let that = this;
            let files = e.target.files[0];
            let maxsize = 20 * 1024 * 1024; //20M
            let formData = new FormData()
            
            //视频大小不超过20M
            if(files.size > maxsize){
                that.showToast('视频文件过大，请控制时长在3-5秒');
                return false;
            }

            that.showToast('上传视频时间可能过长，请耐心等待')

            formData.append('token_random_number',that.token_random_number)
            formData.append('video',files)
            formData.append('return_image','1')
            formData.append('api_key','9LsGEsYhe25ZayUxAyPtVqSrHhTiiC96')
            formData.append('api_secret','iSlUm0jWeFG_j4XAV_vfu2mvIThWpfJd')

            that.$axios.post('/faceApi/faceid/lite/raw/validate_video',formData,{timeout:300000}).then(res => {
                let {error_message,image_best,token_video} = res.data

                that.$refs.faceVideo.value = ''

                if(!error_message){
                    that.image_best = image_best
                    that.token_video = token_video

                    that.videoVerify()
                } 
                
            }).catch(error => {
                that.$vux.loading.hide()

                console.log(error);

                if(error.data){
                    let { error_message } = error.data
    
                    if(error_message == 'VIDEO_FACE_NOT_FOUND'){
                        that.showToast('上传的视频中没有检测到人脸')
                    }else if(error_message == 'VIDEO_LOW_FACE_QUALITY'){
                        that.showToast('上传的视频中人脸质量太差')
                    }else if(error_message == 'VIDEO_INVALID_DURATION'){
                        that.showToast('上传的视频时长不对')
                    }else if(error_message == 'VIDEO_MULTIPLE_FACES'){
                        that.showToast('上传的视频中有多张人脸')
                    }else if(error_message == 'VIDEO_NO_AUDIO'){
                        that.showToast('上传视频中没有声音，请打开手机录音权限')
                    }else{
                        that.showToast(error_message)
                    }
                }else{
                    that.$vux.toast.show({
                        text: '连接超时',
                        type: 'text'
                    })
                }

            });
        },
        getOcrInfo(key){
            try{
                return JSON.parse(getLocalStorage('ocridcard'))[key]
            }catch(e){
                that.showToast("获取身份证信息失败！");
                return null
            }
        },
        videoVerify(){
            let that = this
            
            //检测人脸视频信息-源比对
            that.$axios.post(url.rawVerify,{params: {
                token:that.token_video,
                comparison_type:'1',
                idcard_name:that.getOcrInfo('name'),
                idcard_number:that.getOcrInfo('id_card_number'),
                image_ref1:that.image_best
            }}).then(res => {
                let {code,msg,result} = res.data
                let {result_faceid} = result
                let {face_genuineness,procedure_validation} = result.liveness

                if (code == "0000") {
                    
                    if(procedure_validation == 'PASSED'){
                        //假脸验证
                        if(face_genuineness == 'PASSED'){
                            //人脸相似度
                            if(result_faceid.confidence > 70){

                                //相似度
                                that.params.data_list[0].data.score = ''+result_faceid.confidence
                                //身份信息
                                that.params.data_list[0].data.name = that.getOcrInfo('name')
                                that.params.data_list[0].data.id_card = that.getOcrInfo('id_card_number')

                                //人脸
                                that.upload(that.image_best,20800022).then(data => {
                                    //活体
                                    return that.upload(that.image_best,20800001)
                                }).then(data => {
                                    //12依次上传完成
                                    that.faceValid = true
                                })

                            }else{
                                that.showToast("人脸识别度小于70请重新认证");
                            }
                        }
                    }else if(procedure_validation == 'VIDEO_SR_ERROR'){
                        that.showToast('语音识别结果与要求不符')
                    }else if(procedure_validation == 'VIDEO_NOT_SYNCHRONIZED'){
                        that.showToast('视频中唇语识别错误')
                    }else{
                        that.showToast(procedure_validation)
                    }
                } else {
                    that.showToast(msg);
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
                        that.showToast("操作过于频繁，请明日再试");
                        return false;
                    }
                }
            })

        },
        addCheckNumber(){
            let that = this

            //追加人脸识别次数
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
                    that.showToast(res.data.msg);
                }
            })
        },
        submit() {
            let that = this;
            let source = getLocalStorage('returnSource')

            //保存人脸识别次数
            that.$axios.post(url.saveFaceSimilarity,{params: that.params}).then(res => {
                if(res.data.code == '0000'){
                    saveAuth(that.authType,data => {
                        that.$router.push("authentication"); 
                    })
                }else {
                    that.showToast(res.data.msg);
                }
            })

        }

    }
}
</script>