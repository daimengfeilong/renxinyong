export default (Vue)=>{

    let params = {}//埋点参数集合
    let isStartTime = true//开始时间flag
    let isEndTime = true//结束时间flag

    Vue.directive('stat', {
        inserted (el,bind) {

            initParams()

            //开始时间
            if(isStartTime){
                params.k = 'startT'
                params.v = new Date().getTime()
    
                sendStat()

                isStartTime = false
                isEndTime = true
            }

            //点击埋点
            if(bind.value.click){
                el.addEventListener('click',(e) => {
                    params.k = bind.value.click;

                    try{
                        //获取popup-picker组件的值
                        params.v = el.getElementsByClassName('vux-cell-value')[0].innerText || ''
                    }catch(e){
                        //如点击某个文字或者按钮，使用传参过来的值
                        try{
                            params.v = bind.value.value || ''
                        }catch(e){
                            params.v = ''
                        }
                    }
                    
                    sendStat()
                },false)
            }
            //失去/获得焦点埋点
            if(bind.value.focus || bind.value.blur){
                let event = bind.value.focus ? 'focus' : 'blur'
                let node = el.getElementsByTagName('input')[0] || el.getElementsByTagName('textarea')[0]
                
                node.addEventListener(event,(e) => {
                    params.k = bind.value.focus || bind.value.blur;

                    //获取x-input组件的值
                    params.v = node.value
                    
                    sendStat()

                },false)
            }
        },
        unbind (el,bind) {
            //结束时间
            if(isEndTime){
                params.k = 'endT'
                params.v = new Date().getTime()
    
                sendStat()

                isEndTime = false
            }

            //指令解绑的时候发送填写类埋点
            params.k = bind.value.key;

            try{
                //获取popup-picker组件的值
                params.v = el.getElementsByClassName('vux-cell-value')[0].innerText || ''
            }catch(e){
                try{
                    //获取x-input组件的值
                    params.v = el.getElementsByTagName('input')[0].value || ''
                }catch(e){
                    //获取传参的值
                    params.v = bind.value.value || ''
                }
            }
            
            //点击类埋点切换页面的时候不发送
            if(bind.value.key != bind.value.click){
                sendStat()
            }

            isStartTime = true
        }
    })

    //发送埋点
    function sendStat(){
        let img = new Image()
        let rnd = parseInt(Math.random() * 0x7fffffff)

        //过滤key为空的情况
        if(!params.k) return false;
        
        //如果手机号码不存在，不发送埋点
        if(!params.phno) return false;

        //随机数
        params.rnd = rnd
        
        let query = serialize(params)
        
        img.src = `${STAT_URL}?${query}`
        
    }

    //序列化params
    function serialize(obj){
        let arr = []

        for(let i in obj){
            let item = encodeURI(trimStr(obj[i]))
            
            arr.push(`${i}=${item}`)
        }
        
        return arr.join('&')
    }

    //去除首尾空格
    function trimStr(str){
        if(typeof str == 'string'){
            return str.replace(/(^\s*)|(\s*$)/g,'')
        }else{
            return str
        }
    }

    //初始化params
    function initParams(){
        params = {
            m   : getLocalStorage('channelVal'),//来源渠道
            phno: getLocalStorage('phoneNo'),//手机号码
            k   : '',//埋点字段名称key
            v   : '',//埋点字段value值，若没值则传空
            s   : getLocalStorage('statSourcePage') || '',//源页面（客户从哪个页面跳转过来的）
            p   : getLocalStorage('statNowPage') || '',//当前页面（客户所在的当前页面）
            rnd : 0,
            edi : '2.1'
        }
    }
    
}
