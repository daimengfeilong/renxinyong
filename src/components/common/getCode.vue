<template>
  <div>

  </div>
</template>
<script>
	export default {
		data(){
			return {}
		},
    created(){
			this.getAuth()
		},
		methods:{
      GetRequest () {
        var url = window.location.search // 获取url中"?"符后的字串
        var theRequest = {};
        if (url.indexOf("?") != -1) {
          var str = url.substring(url.indexOf("?") + 1);
          var strs = str.split("&");
          for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
          }
        }
        return theRequest;
      },
			getAuth(){
        let that = this, requestData = that.GetRequest(), params = {code: requestData.code, state: "STATE", phoneNo: getLocalStorage("phoneNo")}
        console.log(requestData)
        that.$axios.post(url.getOpenId, params)
          .then(function (res) {

            if (res.data.code == '0000') {
              var da = res.data.result || ''
//              根据返回值将对于的参数赋值到本地变量
              setLocalStorage("openId", da.openId)
              location.href = window.location.origin + "/#/prodIntrod/" + getLocalStorage("channelVal");
            }

          })
          .catch(function (response) {

          })

			}
		}
	}
</script>
