<template>
    <div class="my-info">
        <group>
            <cell title="头像"> 
                <!-- <Cropper></Cropper>  -->
                <img src="../../assets/image/Me_HeadPortrait_Default@2x.png" alt="">
            </cell>  
            　
            <cell title="手机号" :value="phoneNum"></cell>
            <cell title="姓名" :value="custName"></cell>
        </group>
    </div>
</template>
<script>
import { Group, Cell, XInput } from 'vux'
// import Cropper from "./head.vue"
export default {
    data(){
        return{
            phoneNum: getLocalStorage("phoneNo"),
            custName: this.$route.query.custName
        }
    },
    components: {
        Group,
        Cell,
        XInput,
    },

    methods: {
        
    }
}
</script>
<style lang="less">

</style>


