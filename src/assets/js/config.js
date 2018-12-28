    //系统来源类型
    global.SOURCE_TYPE = '26600005'

    //用户来源类型
    global.SOURCE_USER_TYPE = '30400002'

    //注册来源
    global.REGIST_SOURCE = '39300004'

    //客户端标志
    global.LOGIN_FLAG = "25600004"

    //登录类型
    global.LOGIN_TYPE = "24200004"

    //已注册过的账户
    global.LOGINED = "13900001"

    //验证码类型
    global.CODE_TYPE = {
        MSG : "13900002",
        VOICE : "13900001"
    }

    //http请求超时时间，毫秒
    global.HTTP_TIMEOUT = 30000

    //大数据接口http请求超时时间，毫秒
    global.DSJ_HTTP_TIMEOUT = 120000

    //压缩图片最大宽度
    global.MAX_WIDTH = 800

    //压缩图片最大高度
    global.MAX_HEIGHT = 800


    /**
     * 环境打包自动化配置
     * 详细配置请看 //webpack/config/prod.env.js
     */
    //生产环境
    if(process.env.NODE_ENV == 'production'){
        if(process.env.srconfig == '360' || process.env.srconfig == 'yinliu'){
            //人脸识别次数
            global.FACE_NUM = 10

            //faceId回调地址
            global.FACEID_RETURN_URL = "https://mld-app.boyacx.com:443"

            //公积金/网银认证key
            global.appKey = "ef24c4aea075411aa6bf88e7bb0e1f89"

            //埋点请求的url
            global.STAT_URL = "https://ga.9ffenqigo.com/stat"

            //外部引流url
            global.yinliu_URL = "http://waibuyinliu.boyacx.com/#/partner_list"

            //success.vue页引流url
            global.suc_yinliu_URL = "http://waibuyinliu.boyacx.com/news/#/partner_list"

            //微信授权登录域名
            global.wx_h5_url = "http://yinliu.boyacx.com"
        }

        //360写死渠道
        if(process.env.srconfig == '360'){
            setLocalStorage('channelCode','36500151')
            setLocalStorage('channelVal','360jr')
            setLocalStorage('sourceOsType','30500016')
        }
    }

    //本地环境/测试环境
    if(process.env.NODE_ENV == 'development' || process.env.srconfig == 'test' || process.env.srconfig == ''){
        //人脸识别次数
        global.FACE_NUM = 50

        //faceId回调地址
        //global.FACEID_RETURN_URL = "http://gateway.hn1test.boyacx.com:8730"
        global.FACEID_RETURN_URL = "https://gateway.hn1test.boyacx.com:443"

        //公积金/网银认证key
        global.appKey = "6c5e1df0d026494695f75c41ae539b39"

        //埋点请求的url
        global.STAT_URL = "https://ga-dev.9ffenqigo.com/stat"

        //外部引流url
        global.yinliu_URL = "http://waibuyinliu-test.boyacx.com/#/partner_list"

        //success.vue页引流url
        global.suc_yinliu_URL = "http://waibuyinliu-test.boyacx.com/news/#/partner_list"

        //微信授权登录域名
        global.wx_h5_url = "http://yinliu-test.boyacx.com"

    }

    //Auth_Type（认证类型）
    global.AUTH_TYPE = {
        bank    : "36100001",//储蓄卡认证
        zmxy    : "36100002",//芝麻信用认证
        ds      : "36100003",//电商认证
        credit  : "36100011",//信用卡抓取认证
        ebank   : "36100004",//网银抓取认证
        service : "36100005",//运营商认证
        fund    : "36100006",//公积金认证
        company : "36100007",//公司信息认证
        contact : "36100008",//联系人信息认证
        bankImg : "36100009",//附件（银行卡正反）认证
        vehicle : "36100010",//车主贷认证,
        openBank: "36100012",//银行开户认证
        idcard  : "36100016",//身份信息认证
        face    : "36100017",//人脸识别认证
        baseinfo: "36100018",//补充个人信息
    }
