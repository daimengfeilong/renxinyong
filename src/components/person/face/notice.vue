// /**************************
// 2018-07-13
// 身份认证-拍摄证件须知
// 人员：zxl
// **************************/

<style lang="less">

</style>

<template>
    <div id="wrapper" class="face-verify">
        <p class="face-head">拍摄证件须知</p>
        <div class="box p15 bg-white">
            <div class="notice-img">
                <img src="@/assets/image/person/face_notice_img1.png" alt="">
            </div>
            <div class="flex-1 ml10">
                <p class="fs16">标准拍摄证件照片</p>
            </div>
        </div>
        <div class="box p15 bg-white mt10">
            <div class="notice-img">
                <img src="@/assets/image/person/face_notice_img2.png" alt="">
            </div>
            <div class="flex-1 ml10">
                <p class="fs16">边角完整，不要倾斜</p>
                <p class="color-6 mt10">确认证件完全处于图片内</p>
            </div>
        </div>
        <div class="box p15 bg-white">
            <div class="notice-img">
                <img src="@/assets/image/person/face_notice_img3.png" alt="">
            </div>
            <div class="flex-1 ml10">
                <p class="fs16">字体清晰</p>
                <p class="color-6 mt10">保证精准对焦，使证件上文字和照片清晰可见</p>
            </div>
        </div>
        <div class="box p15 bg-white">
            <div class="notice-img">
                <img src="@/assets/image/person/face_notice_img4.png" alt="">
            </div>
            <div class="flex-1 ml10">
                <p class="fs16">标准拍摄证件照片</p>
                <p class="color-6 mt10">避免图片出现遮挡光线、反光等情况</p>
            </div>
        </div>
        <div class="p15 mt30">
            <router-link to="ocridcard" class="btn" v-stat="{key:'CiKno',click:'CiKno'}">我知道了，下一步</router-link>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    mounted () {
        let that = this
    },
    methods: {

    }
}
</script>