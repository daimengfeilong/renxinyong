<template>
	<div>
		<div class="list-container has-padding" v-if="orderListStatus">
			<div :class="item.objectClass" v-for="(item,index) in orderList" @click="toOrderDetail(index)" :key="index">
				<h4 class="order-tit text-center" v-stat="{key:'CordSta',click:'CordSta',value:item.statName}"><img src="../../assets/image/order/Home_Icon_Wait.png" /><b>订单状态：{{item.statName | toStrXS}}</b></h4>
				<div class="box">
					<div>
						<p>
							<label>申请额度</label>
							<b>{{item.loanAmt}}</b>
						</p>
					</div>
					<div class="flex-1">
						<label>{{item.prodName | reStrBracket }}</label>
                        <span>还款期限{{item.instNum}}个月</span>
                        <div class="single-line" style="color:#96999D">{{item.rejectRemark}}</div>
                        <!--<div class="single-line" style="color:#96999D" v-else>{{item.rejectRemark}}</div>-->
						<p class="btn-row text-right" v-if="item.stat=='31000009'" v-stat="{key:'CgoSig',click:'CgoSig'}"><strong class="text-center" @click="toSign($event, index)">去签约</strong></p>
<!--						<p class="btn-row text-right" v-if="item.stat=='31000012'"><strong class="text-center" @click="sendOrder(index)">去提交</strong></p>-->
						<p class="btn-row text-right" v-if="item.stat=='17700002'||item.stat=='17700006'" v-stat="{key:'Crepay',click:'Crepay'}"><strong class="text-center" @click="toRepay(index)">去还款</strong></p>
					</div>
				</div>
			</div>
		</div>
		<div class="list-container text-center" v-if="!orderListStatus">
			<img src="../../assets/image/order/Repayment_Img_Empty@2x.png" />
			<p>当前页面暂无数据</p>
		</div>
		<to-contract v-if="isContract"></to-contract>
	</div>
</template>

<script>
	import _ from 'underscore'
	import toContract from '../common/index/toContract.vue'
	export default {
		components: {
	        toContract
	    },
	    data () {
	        return {
	        	orderListStatus: true,
	            phoneNo:"",  //13618096943
	            state:{"list": [
		            {
		                "type": "Aprov_Result" //状态码表 请求参数
		            }
		        ]},
		        statList:[], //状态码表
		        orderList: [],
//	            orderList:{
//				    "loanNo": "", //贷款编号
//				    "loanAmt": "", //贷款金额
//				    "prodName": "", //产品名称
//				    "instNum": "", //期数
//				    "stat": "",  //状态码值
//				    "statName": "", //状态文字
//				    "rejectRemark": "", //驳回原因
//				    "isMainLoanNo": "", //是否为主贷款
//					"subLoanCredit": "", //信用是否充足
//				    "objectClass": "" //颜色class
//				},
				isContract: false
	        }
	    },
	    created(){
	    	let that = this
	    	that.phoneNo = getLocalStorage("phoneNo")
	    	that.getStatName()
	    },
		mounted(){},
//		computed: {
//			orderListStatus:function(){
//				if(this.orderList.length>0){
//					return true
//				}else{
//					return false
//				}
//			}
//		},
        filters:{
            toStrXS(v){
                //返回销售修改，过滤'销售'文字
                return v.replace('销售','')
            }
        },
	    methods: {
	    	getStatName:function(){
	    		let that = this
            	that.$axios.post(url.codeQuery, {"params": that.state})
                .then(function(response) {
                	if(response.data.code === "0000") {
	                	that.statList = response.data.result.Aprov_Result
	                	that.getOrderList()
	                }else {
	                	if(response.data.msg){
                        	that.$vux.toast.text(response.data.msg)
                        }
	                }
                })
                .catch(function (response) {
				})
	    	},
			getOrderList:function(){
	        	let that = this
            	that.$axios.post(url.queryLoanList, {"params": {"phoneNo":that.phoneNo,"stat":"31000000"}})
                .then(function(response) {
                	if(response.data.code === "0000") {
	                	that.orderList = response.data.result
	                	if(that.orderList.length == 0){
	                		that.orderListStatus = false
	                	}
	                	for(let i=0;i<that.orderList.length;i++){
	                    	let thisStat = that.orderList[i].stat
	                    	if(thisStat == "31000001"||thisStat == "31000003"||thisStat == "31000005"||thisStat == "31000007"||thisStat == "31000010"||thisStat == "31000012"||thisStat == "31000014"||thisStat == "31000016"){
	                    		that.orderList[i].objectClass="order-gray"
	                    	}else if(thisStat == "17700002"){
	                    		that.orderList[i].objectClass="order-orange"
		                    	that.orderList[i].statName = "逾期"
		                    }else{
	                    		that.orderList[i].objectClass="order-blue"
	                    		if(thisStat == "17700006"){
			                    	that.orderList[i].statName = "待还款"
			                    }
	                    	}

                            that.orderList[i].statName = _.findWhere(that.statList, {valCode: thisStat}).valName
		                    if(that.orderList[i].stat != "31000006"){
		                    	that.orderList[i].rejectRemark = '从还款银行卡中自动扣款'
		                    }
	                    }
                	}else {
                		if(response.data.msg){
                        	that.$vux.toast.text(response.data.msg)
                        }
	                }
                })
                .catch(function (response) {
				})
	        },
	        toOrderDetail (index){
	        	let that = this
	        	if(that.orderList[index].stat == "17700006"||that.orderList[index].stat == "17700002"){
	        		that.$router.push({path: '/repaymentDetail', query: {loanNo: that.orderList[index].loanNo, isMainLoanNo: that.orderList[index].isMainLoanNo}})
	        	}else{
	        		that.$router.push({path: '/orderDetail', query: {loanNo: that.orderList[index].loanNo}})
	        	}
	        },
	        toSign (event, index){
	        	event.cancelBubble = true
	        	let that = this
                that.$axios.post(url.queryBindStatus, {"params": {"loanNo":that.orderList[index].loanNo}})
                .then(function(response) {
                	if(response.data.code === "0000") {
	                    // 查询是否需要绑卡
	                    if(response.data.result.isOnCard === "13900001") {
	                       // 未绑卡 或者异常就去绑卡界面
		                    if(response.data.result.code !== "44100001") {
		                    	that.$router.push({path: '/repayBank', query: {loanNo: that.orderList[index].loanNo}})
		                    	return false
		                    }
	                    }
	                    if(that.orderList[index].isMainLoanNo === "13900001"){
	                    	that.$axios.post(url.checkSubLoanSignStat,{"params": {"loanNo":that.orderList[index].loanNo}})
			                .then(function(response) {
			                	if(response.data.code === "0000") {
			                		if(response.data.result === "13900002"){
			                			that.$vux.toast.text("请先签约其他订单")
			                			return false
			                		}
			                		that.$router.push({path: '/contractList', query: {loanNo: that.orderList[index].loanNo}})
				                }else {
				                	if(response.data.msg){
			                        	that.$vux.toast.text(response.data.msg)
			                       }
				                }
			                })
	                    	return false
	                    }
	                    that.$router.push({path: '/contractList', query: {loanNo: that.orderList[index].loanNo}})
	                }else {
	                	if(response.data.msg){
                        	that.$vux.toast.text(response.data.msg)
                        }
	                }

                })
                .catch(function (response) {
				})
	        },
	        toRepay (index) {
	        	let that = this
	        	that.$router.push({path: '/repaymentDetail', query: {loanNo: that.orderList[index].loanNo, isMainLoanNo: that.orderList[index].isMainLoanNo}})
	        }
	    }
	}
</script>

<style scoped lang="less">

</style>
