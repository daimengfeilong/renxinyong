import _ from 'underscore';
import {GetToken} from './GetToken'
export const GetChannel = {
	data() {
		return {
			inviteStat: false, // 邀请码的开关
			codeList: require("static/data/channel.code.json"),
			channelList: {
				"channelName": "",
				"channelCode": "",
				"sourceOsType": "",
				"channelVal": ""
			}
		}
	},
    mixins: [GetToken], //获取Token,获取渠道
	created(){
        let hash = window.location.hash.split('/')[2]
        let routeVal = this.$route.params.channelVal

		if(routeVal || hash){			
			this.getChannelCode();
		}
	},
	methods: {		
		getChannelCode() {
            let hash = window.location.hash.split('/')[2]
            let routeVal = this.$route.params.channelVal

            this.channelList = _.findWhere(this.codeList,{"channelVal": routeVal || hash})
            if(this.channelList.inviteStatus) {
                //后置邀请码
                setLocalStorage('inviteStatus',this.channelList.inviteStatus)

				// 表示需要邀请码
				//this.inviteStat = true
            }else{
                removeLocalStorage('inviteStatus')
            }
            setLocalStorage('channelCode',this.channelList.channelCode)
            setLocalStorage('channelVal',this.channelList.channelVal)
            setLocalStorage('sourceOsType',this.channelList.sourceOsType)
            
            //禁止卡牛webview下拉刷新
            if(this.channelList.channelVal == 'knH5'){
                location.href='cardniu://app/webview/config?isCanPullRefresh=false'
            }

            this.initParams()
		},
		checkInviteCode() {
			if (this.channelList.channelVal !== "rxH5") {
				let invite_reg_exp = new RegExp(`^[${this.channelList.inviteStatus.substr(0,2)}]{1}[${this.channelList.inviteStatus.substr(2)}]{1}\\d{4}$`)
				if (this.formData.inviteCode && !invite_reg_exp.test(this.formData.inviteCode)) {
					let str = this.channelList.inviteStatus.substr(0, 1) + this.channelList.inviteStatus.substr(2, 1)
					this.$vux.toast.text(`请输入${str}开头(不区分大小写)加四位数字组成的六位邀请码`)
					return false
				}
			} else {
				let invite_reg_exp = new RegExp(`^[a-zA-Z0-9]{6}$`)
				if (this.formData.inviteCode && !invite_reg_exp.test(this.formData.inviteCode)) {
					this.$vux.toast.text(`请输入数字加字母组成的六位邀请码`)
					return false
				}
			}
			return true
		}
	}
}
