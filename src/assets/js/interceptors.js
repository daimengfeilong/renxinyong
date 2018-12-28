import Vue from 'vue';
import axios from 'axios';

//$ajax
Vue.prototype.$axios = axios;

//http请求拦截器
Vue.prototype.$axios.interceptors.request.use((config) => {
    
    //请求之前loading
    Vue.$vux.loading.show({
        text: ''
    })

    //请求之前做一些操作
    config.headers = {
        Authorization: getLocalStorage('token'),
        sourceOsType: getLocalStorage('sourceOsType'),
        sourceType: SOURCE_TYPE,
        phoneNo: getLocalStorage('phoneNo')
    }

    if (config.url.indexOf('getPictureAD') > -1) config.headers.Authorization = "";

    //连接超时时间-大数据接口分开设置
    if(config.timeout == 0){
        if(config.url.indexOf('/dsj') != -1){
            config.timeout = DSJ_HTTP_TIMEOUT
        }else{
            config.timeout = HTTP_TIMEOUT
        }
    }
    
    return config;
})

//http响应拦截器
Vue.prototype.$axios.interceptors.response.use((res) => {
    //关闭loading
    Vue.$vux.loading.hide()

    //更新token
    if (res.headers.Authorization) setLocalStorage('token', res.headers.Authorization);

    //登录过期，清除token
    if (res.data.code == '9997' || res.data.code == '9998' ) {
        Vue.$vux.toast.show({
            text: res.data.msg,
            type: 'text',
            width: '10rem',
            onHide() {
                removeLocalStorage('token')
                let type = router.history.current.meta.type,
                    refererUrl = ''                    
                if(getQueryString('mobile')) {
                    if(type !== 'prodIntrod') {
                        refererUrl = `?mobile=${getLocalStorage('phoneNo')}#/prodIntrod`
                    }
                }else {
                    if(type !== 'login') {
                        refererUrl = '/#/login'
                    }
                }
                
                
                //解决微信路由不刷新
                window.location.href = `${window.location.origin}${refererUrl}/${getLocalStorage('channelVal')}`
            }
        })
        return false;
    }

    return res;
},error => {
    let res = error.response

    Vue.$vux.toast.show({
        text: '连接超时',
        type: 'text',
        onHide() {
            Vue.$vux.loading.hide()
        }
    })
    
    console.log(res);
    return Promise.reject(res);
})