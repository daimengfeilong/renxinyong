<template>
  <div>
    <card>
        <div slot="header" class="title">申请条件</div>
        <div slot="content" class="card-padding">
            <p>借款金额：1000~50000（元）</p>
            <p>申请年龄：22~55岁</p>
            <p>到账时间：次日到账</p>
        </div>
    </card>
    <card>
        <div slot="header" class="title">借款详情</div>
        <div slot="content" class="card-padding">
            <p>额度：1000~50000（元）</p>
            <p>期限：6~12（月）</p>
        </div>
    </card>
    <card>
        <div slot="header" class="title">认证资料</div>
        <div slot="content" class="card-padding">
            <div class="detail-list">
                <div>
                    <img src="../../assets/image/notice/Loan_Icon_BaseInf@2x.png" alt="">                        
                </div>
                <div>
                    <h3>基本信息</h3>
                    <p>认证您的基本信息，以便提供更好的服务</p>
                </div>
            </div>
            <div class="detail-list">
                <div>
                    <img src="../../assets/image/notice/Loan_Icon_Phone@2x.png" alt="">                        
                </div>
                <div>
                    <h3>手机认证</h3>
                    <p>认证您所使用的运营商信息，可以加速放款速度</p>
                </div>
            </div>
            <div class="detail-list">
                <div>
                    <img src="../../assets/image/notice/Loan_Icon_Approve@2x.png" alt="">                        
                </div>
                <div>
                    <h3>资质认证</h3>
                    <p>认证您本人名下的信用卡，可以提高您的借款额度</p>
                </div>
            </div>
        </div>
    </card>
    <div class="p10 mt10">
        <a class="btn">立即借款</a>
    </div>
  </div>
</template>
<script>
import {  Card } from 'vux'
export default {
    data(){
        return {
        }
    },
    components: {
        Card
    },
    
}
</script>

<style scoped lang="less">

    .weui-panel{
        &:after, &:before{
            border:none;
        }
        .title{
            margin: 0 16px;
            padding: 20px 0 17px;
            color:@gray;
            font-size: 15px;
            border-bottom:1px dashed @borderColor; 
        }
        .weui-panel__bd{
            .card-padding{
                padding: 15px 16px 22px;
                .detail-list{
                    display: flex;
                    margin-bottom: 27px;
                    &:last-of-type{
                        margin-bottom: 0;
                    }
                    &>div:first-child{
                        margin-right: 20px;
                    }
                    img{
                        width: 32px;
                    }
            
                }
            }
        }
    }
</style>
