import Vue from 'vue';

const $axios = Vue.prototype.$axios
const $vux = Vue.$vux

//认证
export function saveAuth(key,callback) {
    //保存认证项
    setAuthItem(key)

    let arr = JSON.parse(getLocalStorage('authItems'))
    let authItems = arr.map(item => item.toString())
    
    $axios.post(url.saveTempAuthType, {
        params: {
            loanNo: getLocalStorage("loanNo"),
            authType: authItems
        },
        })
        .then(res => {
            if (res.data.code === "0000") {
                if(Object.prototype.toString.call(callback) === '[object Function]'){
                    callback(res.data)
                }
            }else{
                $vux.toast.text(res.data.msg,'top')
            }
        });
}
//验证认证项
export function checkAuth(data){
    let obj = {}

    for(let k of data){
        for(let j in AUTH_TYPE){
            let authItem = AUTH_TYPE[j]

            if(k.authType == authItem){
                obj[j] = true
            }
        }
    }
    return obj
}

//保存认证项--存在跳过，不存在追加
function setAuthItem(key){
    if(!key) return false;

    let items = getLocalStorage('authItems')
    key = parseInt(key)
    
    if(items){
        let arr = JSON.parse(items)
        
        if(arr.indexOf(key) == -1){
            arr.push(key)
            setLocalStorage('authItems',`[${arr.toString()}]`)
        }
    }else{
        setLocalStorage('authItems',`[${key}]`)
    }
}

//登录初始化
export function initGlobal(){
    //清除产品认证项
    removeLocalStorage('isAuth')

    //清除认证项
    removeLocalStorage('authItems')

    //清除开户操作次数
    removeLocalStorage('openBankAcctState')

    //清除返修状态
    removeLocalStorage('returnSource')

    //清除邀请码
    removeLocalStorage('inviteCode')

    //保存用户基本休息
    $axios.post(url.queryBaseInfo, {
        params: {
            phoneNo: getLocalStorage('phoneNo')
        }
    }).then(res => {
        if (res.data.code === "0000") {
            let {phoneNo,custName,sex,ethnic,certNo,certOrg,certIssueDate,certValidDate,regAddr} = res.data.result;

            let obj = {phoneNo,custName,sex,ethnic,certNo,certOrg,certIssueDate,certValidDate,regAddr};

            setLocalStorage(
                "userBaseInfo",
                JSON.stringify(obj)
            );
        }
    });
}


//手机号码验证
export function checkPhone(val){
    return /^1[3456789]\d{9}$/.test(val)
}
//卡号验证
export function checkBankCard(val){
    return /^\d{15,19}$/.test(val)
}
//价格-正整数
export function checkPrice(val){
    return /^[1-9]\d*$/.test(val)
}
//固定电话
export function checkTel(val){
    return /^\d{7,14}$/.test(val)
}
//运营商服务密码
export function checkCaptcha(val){
    return /^\d{6,8}$/.test(val)
}
//中文姓名
export function checkName(val){
    return /^([a-zA-Z\u4e00-\u9fa5\·]{1,13})$/.test(val)
}
//身份证号码
export function checkIdcard(val){
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val)
}
//登录密码验证
export function checkPassWord(val){
    return /^[0-9A-Za-z]{6,20}$/.test(val)
}
//身份识别-身份证有效期
export function checkIdcardDate(val){
    return /(^\d{4}-\d{2}-\d{2}$)|(^长期$)/.test(val)
}