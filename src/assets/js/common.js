global.getQueryString = function(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

global.addcookie = function(name, value, expireHours = 168) {
    var exp = new Date();

    exp.setTime(exp.getTime() + 60 * 60 * 1000 * expireHours); //过期时间，默认1周   
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

global.getcookie = function(name) {
    var strcookie = document.cookie;
    var arrcookie = strcookie.split("; ");

    for (var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split("=");
        if (arr[0] == name) return unescape(arr[1]);
    }
    return "";
}

global.delcookie = function(name) {
    var exp = new Date();

    exp.setTime(exp.getTime() - 1);
    var cval = getcookie(name);
    if (cval != null) document.cookie = name + "=" + cval + "; path=/;expires=" + exp.toGMTString();
}

//获取用户基本信息
global.getUserInfo = function(key) {
    try{
        return JSON.parse(getLocalStorage("userBaseInfo"))[key] || ''
    }
    catch(e){
        return ''
    }
}


/**
 * 比较对象相同值合并
 * @param {} 
 * 
 */
global.mergeObject = function(target, source) {
    let obj = {}

    for (let t in target) {
        let itemT = target[t]

        for (let s in source) {
            let itemS = source[s]

            //两个key都一致并且值不相等，取source的值
            if (t == s) {
                if (itemS) {
                    obj[t] = itemS
                } else {
                    obj[t] = itemT
                }
            } else if (source[t] === undefined) { //如果source不存在target的key，保留target原来的key
                obj[t] = itemT
            }
        }
    }
    return obj
}

/**
 * 封装本地存储保存/获取方法，解决隐私模式使用localStorage的问题
 */
global.setLocalStorage = function(key,value){
    try{
        window.localStorage.setItem(key,value)
    }catch(e){
        addcookie(key,value)
    }
}

global.getLocalStorage = function(key){
    try{
        return window.localStorage.getItem(key)
    }catch(e){
        return getcookie(key) || null
    }
}

global.removeLocalStorage = function(key){
    try{
        window.localStorage.removeItem(key);
    }catch(e){
        delcookie(key);
    }
}

/**
 * ------------------END--------------------
 */