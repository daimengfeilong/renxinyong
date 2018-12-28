const path = './api'
const loginPath = './loginApi'
const dsjPath = './dsj'
const jfsPath = './jfs'

global.url = {
    //发送验证码
    sendSms: `${path}/bycx-rece-service/aSysMsgCaptcha/sendSms`,
    //密码登录
    login: `${loginPath}/bycx-passport-service/aSysLogin/cust/login`,
    //图片验证码
    ImgCode: `${path}/bycx-rece-service/aSysMsgCaptcha/getCodeImg`,
    //上传图片
    uploadBase64: `${path}/bycx-rece-service/tempSysAtt/load/uploadbase64`,
    //获取码表
    codeQuery: `${path}/bycx-rece-service/api/sys/code/mobile/query`,
    //保存用户信息
    saveBaseInfoExt: `${path}/bycx-rece-service/tempBCustInfo/saveBaseInfoExt`,
    //查询基础信息
    queryBaseInfo: `${path}/bycx-rece-service/tempBCustInfo/queryBaseInfo`,
    //查询客户认证信息接口
    getTempAuthTypeList: `${path}/bycx-rece-service/tempBLoanAuth/getTempAuthTypeList`,
    //银行卡四要素校验接口
    getBankCardInfo: `${path}/bycx-rece-service/third/bigData/bank/getBankCardInfo`,
    //验证码登录
    loginCode: `${loginPath}/bycx-passport-service/aSysLogin/identify/code/login`,
    //忘记密码
    findPsw: `${loginPath}/bycx-passport-service/aSysLogin/cust/fpwd`,
    //修改密码
    changePsw: `${loginPath}/bycx-passport-service/aSysLogin/cust/mpwd`,
    //查询银行卡信息
    getCardInfo: `${path}/bycx-rece-service/tempBCustBankAcct/getInfo`,
    //银行卡信息保存
    saveCardInfo: `${path}/bycx-rece-service/tempBCustBankAcct/saveInfo`,
    //获取码表信息
    query: `${path}/bycx-syst-service/aSysCodeInfo/mobile/query`,
    //查询首页贷款的状态接口
    getLoanStatus: `${path}/bycx-loan-service/bLoLoanInfo/queryLatelyLoan`,
    //校验客户是否有存在审核的贷款申请
    getRefuseLoan: `${path}/bycx-loan-service/bLoLoanInfo/check/stat`,
    //查询未签约贷款列表
    getUnsignedLoanList: `${path}/bycx-loan-service/bLoLoanInfo/queryUnsignLoanInfo`,
    //获取签约地址
    getContractUrl: `${path}/bycx-loan-service/bLoLoanInfo/getSignUrl`,
    //开户
    openAccount: `${path}/bycx-rece-service/third/jiuFu/openAccount`,
    //根据系统来源查询在售产品
    getSaleProd: `${path}/bycx-prod-service/bPrProd/queryProdBySourceOsType`,
    //查询产品列表
    getProductList: `${path}/bycx-rece-service/receProd/queryProdBySourceOsType`,
    //预生成贷款编号
    getLoanNo: `${path}/bycx-rece-service/tempBLoanInfo/preGenerateLoanNo`,
    //认证
    saveTempAuthType: `${path}/bycx-rece-service/tempBLoanAuth/saveTempAuthType`,
    //获取试算期数
    queryProdInstNum: `${path}/bycx-prod-service/bPrProdFee/queryProdInstNum`,
    //试算产品的费用
    queryCustProdFee: `${path}/bycx-prod-service/bPrProdFee/queryCustProdFee`,
    //保存试算
    saveProdTrial: `${path}/bycx-rece-service/tempBLoanProd/saveProdTrial`,
    //试算
    prodCalc: `${path}/bycx-prod-service/bPrProd/prodCalc`,
    //查询公司信息
    getCustWork: `${path}/bycx-rece-service/tempBCustWork/getCustWork`,
    //保存公司信息
    saveCustWork: `${path}/bycx-rece-service/tempBCustWork/save`,
    //查询联系人信息
    getContctQuery: `${path}/bycx-rece-service/tempBCustContctOther/query`,
    //保存联系人信息
    saveContct: `${path}/bycx-rece-service/tempBCustContctOther/saveContct`,
    //还款银行卡-发送验证码
    repaymentSendMsg: `${path}/bycx-loan-service/cAccLoanAcctStat/repaymentSendMsg`,
    //进件-提交订单
    submitOrder: `${path}/bycx-rece-service/api/loan/submitData/neworder`,
    //身份证ocr识别
    checkIdcard: `${path}/bycx-rece-service/third/faceId/checkIdcard`,
    //查询附件
    getUploadedAtts: `${path}/bycx-rece-service/tempSysAtt/getUploadedAtts`,
    //大数据-认证通话详单
    dsjPostData: `${dsjPath}/api/v1/jxl/post_data`,
    //大数据-验证是否支持修改服务密码
    dsjResstPwd: `${dsjPath}/api/v1/jxl/reset_pwd`,
    //获取token
    getToken: `${loginPath}/bycx-passport-service/aSysLogin/cust/access`,
    //token加密
    inerLogin: `${loginPath}/bycx-passport-service/aSysLogin/cust/inerLogin`,
    //贷款列表
    queryLoanList: `${path}/bycx-loan-service/bLoLoanInfo/queryLoanList`,
    //贷款详情
    queryLoanDetail: `${path}/bycx-loan-service/bLoLoanInfo/queryLoanDetail`,
    //签约前判断是否绑定银行卡
    queryBindStatus: `${path}/bycx-loan-service/cAccLoanAcctStat/queryBindStatus`,
    //签约前判断子贷款是否已签约
    checkSubLoanSignStat: `${path}/bycx-loan-service/bLoLoanInfo/checkSubLoanSignStat`,
    //还款计划
    getRepayList: `${path}/bycx-loan-service/cAccLoanAcctStat/getRepayList`,
    //取消贷款
    affirmcancelloans: `${path}/bycx-loan-service/bLoLoanInfo/affirmcancelloans`,
    //获取还款验证码
    isNeedAuthCode: `${path}/bycx-loan-service/cAccLoanAcctStat/isNeedAuthCode`,
    //还款代扣
    loanwithhold: `${path}/bycx-loan-service/cAccLoanAcctStat/loanwithhold`,
    //取消还款
    veriPayCancel: `${path}/bycx-loan-service/cAccLoanAcctStat/veriPayCancel`,
    //签约地址
    getSignUrl: `${path}/bycx-loan-service/bLoLoanInfo/getSignUrl`,
    //合同签约状态
    signstatus: `${path}/bycx-loan-service/bLoLoanInfo/query/signstatus`,
    //保单状态
    insudetail: `${path}/bycx-loan-service/bLoInsuPurchaseRecord/insudetail`,
    //获取保险产品
    recommend: `${path}/bycx-loan-service/bLoInsuPurchaseRecord/recommend`,
    //核保
    insurecheck: `${path}/bycx-loan-service/bLoInsuPurchaseRecord/insurecheck`,
    //获取人脸识别token
    faceidGetToken: `${path}/bycx-rece-service/third/faceId/getToken`,
    //获取人脸识别结果
    faceidGetResult: `${path}/bycx-rece-service/third/faceId/getResult`,
    //保存人脸识别相似度
    saveFaceSimilarity: `${path}/bycx-rece-service/third/bigData/saveFaceSimilarity`,
    //保存人脸识别次数
    addCheckNumber: `${path}/bycx-rece-service/aSysCheckNumber/addCheckNumber`,
    //查询人脸识别次数
    queryCheckNumber: `${path}/bycx-rece-service/aSysCheckNumber/queryCheckNumber`,
    //查询贷款拆分明细
    splitLoanInfo: `${path}/bycx-loan-service/bLoLoanInfo/query/splitLoanInfo`,
    //贷款拆分明细确认
    confirmSplitLoan: `${path}/bycx-loan-service/bLoLoanInfo/confirm/splitLoanInfo`,
    //提交绑定还款银行卡
    repaymentBindCard: `${path}/bycx-loan-service/cAccLoanAcctStat/repaymentBindCard`,
    //车主贷认证
    vehicle: `${path}/bycx-rece-service/third/bigData/getVehicleLoanInfo`,
    //同盾信息校验
    tongdun: `${dsjPath}/api/v1/main/post_data`,
    //重新绑卡
    saveSyncInfo: `${path}/bycx-rece-service/tempBCustBankAcct/saveSyncInfo`,
    //提现
    withdrawal: `${path}/bycx-rece-service/third/jiuFu/withdrawal`,
    //获取产品信息
    queryProdInfo: `${path}/bycx-prod-service/bPrProd/queryProdInfo`,
    //rong360
    clientBrowseRecord: `${path}/bycx-rece-service/tempBCustViewRecord/clientBrowseRecord`,
    //开户新接口
    openAccountProds: `${path}/bycx-rece-service/third/jiuFu/openAccountProds`,
    // 360金融对接相关接口
    skiph5Api: `${path}/bycx-rece-service/third/dock/360/skiph5Api`,
    // 获取前置开户产品
    openAccountProds: `${path}/bycx-rece-service/third/jiuFu/openAccountProds`,
    // 前置开户接口
    openAccountBefore: `${path}/bycx-rece-service/third/jiuFu/openAccountBefore`,
    //绑定渠道（虚拟标签）
    saveChannel: `${path}/bycx-rece-service/tempBCustChannelInfo/saveChannel`,
    // 试算协议
    queryAgreementInfo: `${path}/bycx-loan-service/bLoLoanInfo/queryAgreementInfo`,
    // 合同服务协议
    queryLoanSignInfo: `${path}/bycx-rece-service/tempBLoanInfo/queryLoanSignInfo`,
    // 验证验证码
    validatePhoneVerifyCode: `${path}/bycx-rece-service/aSysMsgCaptcha/validatePhoneVerifyCode`,
    // 默签
    saveSignRecord: `${path}/bycx-rece-service/tempBLoanInfo/saveSignRecord`,
    // 获取芝麻分认证
    getZmScoreUrl: `${path}/bycx-rece-service/third/bigData/getZmScoreUrl`,
    // 获取客户已签约的合同列表
    querySignedLoanInfo: `${path}/bycx-loan-service/bLoLoanInfo/querySignedLoanInfo`,
    // 玖富协议支付-用户签约状态查询
    querySignStatus: `${path}/bycx-rece-service/third/jiuFu/querySignStatus`,
    // 玖富协议支付-用户签约申请
    signApply: `${path}/bycx-rece-service/third/jiuFu/signApply`,
    // 玖富协议支付-用户签约确认
    signConfirm: `${path}/bycx-rece-service/third/jiuFu/signConfirm`,
    // 众安保险核保接口
    zhongAnCheck:  `${path}/bycx-rece-service/zhongan/check`,
    // 众安保险获取验证码接口
    zhongAnVCode:  `${path}/bycx-rece-service/zhongan/getValiCode`,
    // 众安保险绑卡接口
    zhongAnBind:  `${path}/bycx-rece-service/zhongan/bindCard`,
    // 校验是否要重置提现密码接口
    isNeedResetPwd: `${path}/bycx-rece-service/third/jiuFu/isNeedResetPwd`,
    // 重置提现密码接口
    resetPasswd: `${path}/bycx-rece-service/third/jiuFu/resetPasswd`,
    // face身份证ocr识别
    checkPicture: `${path}/bycx-rece-service/third/faceId/checkPicture`,
    // face人脸识别获取随机数
    getRandomNumber: `${path}/bycx-rece-service/third/faceId/getRandomNumber`,
    // face人脸识别
    validateVideo: `${path}/bycx-rece-service/third/faceId/validateVideo`,
    // face人脸识别源对比
    rawVerify: `${path}/bycx-rece-service/third/faceId/rawVerify`,
    // 获取用户协议列表
    loanInquiry: `${path}/bycx-rece-service/third/jiuFu/loanInquiry`,
    // 授权相关接口
    authChange: `${path}/bycx-rece-service/third/jiuFu/authChange`,
    // 注销接口
    destroyAcct: `${path}/bycx-rece-service/third/jiuFu/destroyAcct`,
    // 查询开户信息
    openBankNoQuery: `${jfsPath}/9fservice/anon/base/ctrl/openBankNoQuery`,
    // 绑定新银行卡
    bindBankCard: `${jfsPath}/9fservice/anon/base/ctrl/bindBankCard`,
    // 更换开户银行卡
    accountInfoModify: `${jfsPath}/9fservice/anon/base/ctrl/accountInfoModify`,
    // 开户信息变更接口
    openInfoUpdate: `${jfsPath}/9fservice/anon/base/ctrl/openInfoUpdate`,
    // 获取Banner
    getPictureAD: `${path}/bycx-drainage-service/bMarketAdvertisementInfo/getPictureAD`,
    // 微信登录授权
    loginAuth: `${path}/bycx-passport-service/weixin/auth`,
    // 获取微信openID
    getOpenId: `${path}/bycx-passport-service/weixin/getOpenId`,
    // 聚合支付-过滤资方
    filterChannel: `${path}/bycx-loan-service/anon/jh/filter`,
    // 聚合支付-支付请求
    wxRepay: `${path}/bycx-loan-service/anon/jh/pay`
}
