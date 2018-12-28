<template>
	<div>
		<ul class="rev-container right-point" v-if="hasData">
			<li class="box" v-for='(item,index) in contractList' @click="sing(index)" v-stat="{key:'Clook', click:'Clook'}" :key="index">
				<span class="flex-1"><span v-if='item.isShowCtrt==="13900001"'>合同协议</span><span v-else>合同</span>{{item.num}}</span>
				<span>
					<i v-if='item.status==="31000009"'>未签约</i>
					<i v-if='item.status==="31000002"'>已签约</i>
					<i v-if='item.isShowCtrt==="13900001"'>点击查看</i>
				</span>
			</li>
		</ul>
		
		<!--<div class="order-btn has-padding text-center">-->
			<!--<template v-if="showSend">-->
				<!--<span class="btn" @click="sendSign">下一步</span>-->
            <!--</template>
            <template v-else>
                 <router-link :to="{path: 'orderDetail', query: {loanNo: loanNo}}">返回上一页</router-link>
            </template>-->
		<!--</div>-->
	</div>
</template>

<script>
	export default{
		data(){
			return{
				loanNo: "",
				hasData: false,
				contractList: {
					"contractNo": "", //合同编号
					"isStatus":"", //是否是玖富固定l
					"status":"", //签约状态
					"num": "",
					"isShowCtrt":"", // 是否是只显示，不需要签约（13900001）
					"url": ""
//					"url": "https://www.bestsign.info/openpagepp/getSignPageSignimagePc.json?mid=f63cc611d9054d0891e1808c37223c6d&sign=bAFwceLLhoxfPMpGdxwrp1Wi4VPEyBlZeqoeh1YAYp%2FY%2BnwjTut%2FpwRjFh4pJMc5uibgoY0TNZqe6pn2J7u9JzTVjywV%2B9r7dwCGk9Hwo6BIYyjfcIu8EiKZN9X350BiXRqXFnm4dcGBO09Y%2F6yGLoYNVY2sZkuy%2B1Rhhh1%2BZ6o%3D&fsid=1526371113154FBEM2&Coordinatelist=[{signy=0.2, signType=22200002, pagenum=7, signx=0.16}]&typedevice=2&email=59986764@qq.com&returnurl=http://47.96.37.167:8080/contract-service/anon/ssqian/callback&pushurl=http://47.96.37.167:8080/contract-service/anon/ssqian/notify"
				}
			}
		},
		created(){ 
			let that = this
	    	that.loanNo = that.$route.query.loanNo
	    	that.getContract()
		},
		mounted(){},
		methods: {
			getContract:function(){
	    		let that = this
            	that.$axios.post(url.getSignUrl, {"params": {"loanNo":that.loanNo, "isAppH5":"H5"}})
                .then(function(response) {
					if(response.data.code === "13900001"){
//						that.$vux.toast.text("签约完成")
//						setLocalStorage('path','orderDetail')
//          			that.$router.push({path: 'success'})
            			that.$vux.toast.show({
	                        text:"签约完成", 
	                        onHide(){
	                            setLocalStorage('path','orderDetail')
	                            that.$router.push('success')
	                        }
                        })
					}else if(response.data.code === "13900002") {
            			that.contractList = response.data.result
	                	for(let i=0;i<that.contractList.length;i++){
                			that.contractList[i].num = i+1
                		}
	                	that.hasData = true
	                	return false
               		}else {
	                    if(response.data.msg){
                        	that.$vux.toast.text(response.data.msg)
                        }
	                }
                })
                .catch(function (response) {
				})
	    	},
	    	sing(index){
	    		let that = this
	    		if(that.contractList[index].status !== "31000002"){
	    			window.location.href = `${that.contractList[index].url}&backUrl=${window.location.origin}/#/contractList?loanNo=${getLocalStorage('loanNo')}`
	    			return false
	    		}
	    	}
//	    	sendSign(){
//	    		let that = this
//          	that.$axios.post(url.signstatus, {"params": {"loanNo":that.loanNo}})
//              .then(function(response) {
//              	if(response.data.code === "0000") {
//              		for(let i=0;i<response.data.result.length;i++){
//              			if(response.data.result[i].status === "3"){
//              				let num = i+1
//              				that.$vux.toast.text("合同"+num+"未签约")
//              				return false
//              			}
//              			setLocalStorage('path','orderDetail')
//              			that.$router.push({path: 'success'})
//              		}
//	                }else {
//	                	that.$vux.toast.text(response.data.msg)
//	                }
//              })
//              .catch(function (response) {
//				})
//	    	}
		}
	}
</script>