<template>
	<div>
		<div class="confire-container">
			<p>尊敬的客户：<span>{{confirmData.custName}}</span>，你本次分期明细如下：</p>
			<div>
				<p class="box">
					<label class="flex-1">姓名</label>
					<span>{{confirmData.custName}}</span>
				</p>
				<p class="box">
					<label class="flex-1">身份证号码</label>
					<span>{{confirmData.certNo}}</span>
				</p>
			</div>
			<x-table :cell-bordered="false">
		        <thead>
		          <tr>
		            <th width="120px">产品类型</th>
		            <th>分期总金额(￥)</th>
		            <th>期数</th>
		            <th>月还款</th>
		          </tr>
		        </thead>
		        <tbody>
		          <tr>
		            <td>{{confirmData.mainProdName | reStrBracket}}</td>
		            <td>{{confirmData.mainLoanAmt}}</td>
		            <td>{{confirmData.mainInstNum}}</td>
		            <td><router-link tag="i" v-stat="{key:'CsmaLoo', click:'CsmaLoo'}" :to="{ name: 'repaymentDetail', query: {loanNo: loanNo}}">查看</router-link></td>
		          </tr>
		          <tr>
		            <td>{{confirmData.subProdName | reStrBracket}}</td>
		            <td>{{confirmData.subLoanAmt}}</td>
		            <td>{{confirmData.subInstNum}}</td>
		            <td><router-link tag="i" v-stat="{key:'CinsLoo', click:'CinsLoo'}" :to="{ name: 'repaymentDetail', query: {loanNo: subLoanNo}}">查看</router-link></td>
		          </tr>
		        </tbody>
		   </x-table>
		</div>
		<div class="fixed-bottom p10"><span class="btn" v-stat="{key:'Ccon', click:'Ccon'}" @click="confirm">我已确认</span></div>
	</div>
</template>

<script>
	import { XTable } from 'vux'
	export default{
		components: { XTable },
		data(){
			return{
				loanNo: "",
				confirmData:{
					"loanNo": "",
					"custName": "",
					"certNo": "",
					"mainProdName": "",
					"mainLoanAmt": "",
					"mainInstNum": "",
					"subProdName": "",
					"subLoanAmt": "",
					"subInstNum": ""
				},
				subLoanNo: ""
			}
		},
		created(){
			let that = this
			that.loanNo = that.$route.query.loanNo
			that.confirmData.custName = getUserInfo("custName")
			that.confirmData.certNo = getUserInfo("certNo")
//			that.confirmData.custName = JSON.parse(getLocalStorage("userBaseInfo")).custName
			that.subLoanNo = that.loanNo + "01"
			
			that.getSplitLoanInfo()
		},
		mounted(){},
		methods: {
			getSplitLoanInfo:function(){
				let that = this
				that.$axios.post(url.splitLoanInfo, {"params": {"mainLoanNo":that.loanNo, "subLoanNo":that.subLoanNo}})
				.then(function (response){
					if(response.data.code === "0000") {
						that.confirmData = response.data.result
						if(!that.confirmData.subLoanAmt > 0){
							that.confirmData.subLoanAmt = 0
						}
					}else {
						if(response.data.msg){
                        	that.$vux.toast.text(response.data.msg)
                        }
					}
				})
				.catch(function (response){
					
				})
			},
			confirm:function() {
				let that = this;
				that.$axios.post(url.confirmSplitLoan,{"params": {"mainLoanNo":that.loanNo, "subLoanNo":that.subLoanNo}})
				.then(response => {
					if(response.data.code === "0000") {
						that.$router.push({path: '/orderDetail', query: {"loanNo":that.loanNo}})
					}else {
						if(response.data.msg){
                        	that.$vux.toast.text(response.data.msg)
                        }
					}
				})
				.catch(response => {

				})
			}
		}
	}
</script>