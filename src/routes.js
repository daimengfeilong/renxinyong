const routes = [{
    path: '/',
    name: 'home',
    redirect: '/login/zrH5',
    meta: {
        title: '任信用-登录领取5万额度',
        type: 'login',
        page: 'Plog1'
    }
},
{
    path: '/prodIntrod/:channelVal',
    name: 'prodIntrod',
    component: resolve => require.ensure([], () => resolve(require('./components/index.vue')), "prodIntrod"),
    meta: {
        title: '任信用',
        type: 'home',
        page: 'Pmai'
    }
},
{
    path: '/loginPassword/:channelVal',
    name: 'loginPassword',
    component: resolve => require.ensure([], () => resolve(require('./components/login/login.vue')), "login"),
    meta: {
        title: '任信用-登录领取5万额度',
        type: 'login',
        page: 'Plog1'
    }
},
{
    path: '/login/:channelVal',
    name: 'login',
    component: resolve => require.ensure([], () => resolve(require('./components/login/loginCode.vue')), "login"),
    meta: {
        title: '任信用-登录领取5万额度',
        type: 'login',
        page: 'Plog2'
    }
},
// {
//     path: '/prodIntrod/:channelVal',
//     name: 'prodIntrod',
//     component: resolve => require.ensure([], () => resolve(require('./components/prodIntrod/index.vue')), "prodIntrod"),
//     meta: {
//         title: '任信用-登录领取5万额度',
//         type: 'prodIntrod'
//     }
// },
{
    path: '/passwordSet',
    name: 'passwordSet',
    component: resolve => require.ensure([], () => resolve(require('./components/login/passwordSet.vue')), "login"),
    meta: {
        title: '设置密码',
        type: 'login',
        page: 'PsetPas'
    }
},
{
    path: '/passwordForget',
    name: 'passwordForget',
    component: resolve => require.ensure([], () => resolve(require('./components/login/passwordForget.vue')), "login"),
    meta: {
        title: '忘记密码',
        type: 'login',
        page: 'PresPas'
    }
},
{
    path: '/getCode',
    name: 'getCode',
    component: resolve => require.ensure([], () => resolve(require('./components/common/getCode.vue')), "getCode"),
    meta: {
      title: '获取登录状态信息中'
    }
},
{
    path: '/my',
    name: 'my',
    component: resolve => require.ensure([], () => resolve(require('./components/my/my.vue')), "my"),
    meta: {
        title: '我的',
        type: 'my',
        page: 'PaboMe'
    }
},
// {
//     path: '/cardInfo',
//     name: 'cardInfo',
//     component: resolve => require.ensure([], () => resolve(require('./components/my/cardInfo.vue')), "cardInfo"),
//     meta: {
//         title: '银行卡信息',
//         type: 'cardInfo',
//         page: 'PbanBou'
//     }
// },
// {
//     path: '/faq',
//     name: 'faq',
//     component: resolve => require.ensure([], () => resolve(require('./components/my/faq.vue')), "faq"),
//     meta: {
//         title: '常见问题',
//         type: 'faq'
//     }
// },
{
    path: '/myInfo',
    name: 'myInfo',
    component: resolve => require.ensure([], () => resolve(require('./components/my/myInfo.vue')), "myInfo"),
    meta: {
        title: '个人资料',
        type: 'myInfo',
        page: 'PperInf'
    }
},
// {
//     path: '/productList',
//     name: 'productList',
//     component: resolve => require.ensure([], () => resolve(require('./components/product/productList.vue')), "productList"),
//     meta: {
//         title: '产品选择',
//         type: 'productList',
//         page: 'PproCho'
//     }
// },
// {
//     path: '/productDetail',
//     name: 'productDetail',
//     component: resolve => require.ensure([], () => resolve(require('./components/product/productDetail.vue')), "productDetail"),
//     meta: {
//         title: '产品详情',
//         type: 'productDetail',
//         page: 'PproDet'
//     }
// },
{
    path: '/companyInfo',
    name: 'companyInfo',
    component: resolve => require.ensure([], () => resolve(require('./components/person/information/companyInfo.vue')), "companyInfo"),
    meta: {
        title: '公司信息',
        type: 'companyInfo',
        page: 'PcomInf'
    }
},
{
    path: '/contactsInfo',
    name: 'contactsInfo',
    component: resolve => require.ensure([], () => resolve(require('./components/person/information/contactsInfo.vue')), "contactsInfo"),
    meta: {
        title: '联系人信息',
        type: 'contactsInfo',
        page: 'PlinPerInf'
    }
},
{
    path: '/openBankAcct',
    name: 'openBankAcct',
    component: resolve => require.ensure([], () => resolve(require('./components/person/auth/openBankAcct.vue')), "openBankAcct"),
    meta: {
        title: '开户银行绑定',
        type: 'openBankAcct',
        page: 'PopeBanBou'
    }
},
{
    path: '/changeAuthorization',
    name: 'changeAuthorization',
    component: resolve => require.ensure([], () => resolve(require('./components/person/auth/changeAuthorization.vue')), "changeAuthorization"),
    meta: {
        title: '华夏银行开户',
        type: 'openBankAcct',
        page: 'PopeBanBou'
    }
},
{
    path: '/idenitiy',
    name: 'idenitiy',
    component: resolve => require.ensure([], () => resolve(require('./components/person/auth/idenitiy.vue')), "idenitiy"),
    meta: {
        title: '实名认证',
        type: 'idenitiy',
        page: 'PperIDInfo'
    }
},
// {
//     path: '/aptitude',
//     name: 'aptitude',
//     component: resolve => require.ensure([], () => resolve(require('./components/person/auth/aptitude.vue')), "aptitude"),
//     meta: {
//         title: '资质认证',
//         type: 'aptitude',
//         page: 'PquaAut'
//     }
// },
{
    path: '/creditCard',
    name: 'creditCard',
    component: resolve => require.ensure([], () => resolve(require('./components/person/auth/creditCard.vue')), "creditCard"),
    meta: {
        title: '信用卡认证',
        type: 'creditCard',
        page: 'PcreCarAut'
    }
},
{
    path: '/bankCard',
    name: 'bankCard',
    component: resolve => require.ensure([], () => resolve(require('./components/person/auth/bankCard.vue')), "bankCard"),
    meta: {
        title: '银行卡认证',
        type: 'bankCard',
        page: 'PbanCar'
    }
},
{
    path: '/service',
    name: 'service',
    component: resolve => require.ensure([], () => resolve(require('./components/person/auth/service.vue')), "service"),
    meta: {
        title: '运营商登录',
        type: 'service',
        page: 'PopeLog'
    }
},
{
    path: '/serviceCaptcha',
    name: 'serviceCaptcha',
    component: resolve => require.ensure([], () => resolve(require('./components/person/auth/serviceCaptcha.vue')), "serviceCaptcha"),
    meta: {
        title: '运营商登录',
        type: 'serviceCaptcha',
        page: 'PopeAutLog'
    }
},
{
    path: '/serviceAgreement',
    name: 'serviceAgreement',
    component: resolve => require.ensure([], () => resolve(require('./components/person/auth/serviceAgreement.vue')), "serviceAgreement"),
    meta: {
        title: '通话记录授权协议',
        type: 'serviceAgreement',
        page: 'PphoRecAut'
    }
},
// {
//     path: '/uploadBank',
//     name: 'uploadBank',
//     component: resolve => require.ensure([], () => resolve(require('./components/person/auth/uploadBank.vue')), "uploadBank"),
//     meta: {
//         title: '附件认证',
//         type: 'uploadBank',
//         page:'PbanAut'
//     }
// },
{
    path: '/face',
    name: 'face',
    component: resolve => require.ensure([], () => resolve(require('./components/person/auth/face.vue')), "face"),
    meta: {
        title: '实名认证',
        type: 'face',
        page: 'PperAuth'
    }
},
{
    path: '/vehicle',
    name: 'vehicle',
    component: resolve => require.ensure([], () => resolve(require('./components/person/auth/vehicle.vue')), "vehicle"),
    meta: {
        title: '车主贷认证',
        type: 'vehicle',
        page: 'PcarAuth'
    }
},
{
    path: '/forgetServicePwd',
    name: 'forgetServicePwd',
    component: resolve => require.ensure([], () => resolve(require('./components/person/auth/forgetServicePwd.vue')), "forgetServicePwd"),
    meta: {
        title: '重设服务密码',
        type: 'forgetServicePwd',
        page: 'PgetPas'
    }
},
{
    path: '/baseInfo',
    name: 'baseInfo',
    component: resolve => require.ensure([], () => resolve(require('./components/person/information/baseInfo.vue')), "baseInfo"),
    meta: {
        title: '补充个人信息',
        type: 'baseInfo',
        page: 'PsupPerInf'
    }
},
{
    path: '/repayBank',
    name: 'repayBank',
    component: resolve => require.ensure([], () => resolve(require('./components/person/information/repayBank.vue')), "repayBank"),
    meta: {
        title: '还款银行绑定',
        type: 'repayBank',
        page: 'PrepBan'
    }
},
// {
//     path: '/calculation',
//     name: 'calculation',
//     component: resolve => require.ensure([], () => resolve(require('./components/person/information/calculation.vue')), "calculation"),
//     meta: {
//         title: '分期试算',
//         type: 'calculation',
//         page: 'PstaTes'
//     }
// },
{
    path: '/protocol',
    name: 'protocol',
    component: resolve => require.ensure([], () => resolve(require('./components/person/information/protocol.vue')), "protocol"),
    meta: {
        title: '合同及协议',
        type: 'protocol',
        page: 'PconAgr'
    }
},
{
    path: '/readAgreement',
    name: 'readAgreement',
    component: resolve => require.ensure([], () => resolve(require('./components/person/information/readAgreement.vue')), "readAgreement"),
    meta: {
        title: '合同及协议',
        type: 'readAgreement',
        page: 'PaffPro'
    }
},
{
    path: '/userProtocol',
    name: 'userProtocol',
    component: resolve => require.ensure([], () => resolve(require('./components/order/userProtocol.vue')), "userProtocol"),
    meta: {
        title: '用户协议',
        type: 'protocol',
        page: 'PconAgr'
    }
},
{
    path: '/orderList',
    name: 'orderList',
    component: resolve => require.ensure([], () => resolve(require('./components/order/orderList.vue')), "orderList"),
    meta: {
        title: '订单',
        type: 'orderList',
        page: 'PmyOrd'
    }
},
{
    path: '/orderDetail',
    name: 'orderDetail',
    component: resolve => require.ensure([], () => resolve(require('./components/order/orderDetail.vue')), "orderDetail"),
    meta: {
        title: '订单详情',
        type: 'orderDetail',
        page: 'PordDet'
    }
},
{
    path: '/repaymentDetail',
    name: 'repaymentDetail',
    component: resolve => require.ensure([], () => resolve(require('./components/order/repaymentDetail.vue')), "repaymentDetail"),
    meta: {
        title: '还款计划',
        type: 'repaymentDetail',
        page: 'PrepPla'
    }
},
{
    path: '/safeOrder',
    name: 'safeOrder',
    component: resolve => require.ensure([], () => resolve(require('./components/order/safeOrder.vue')), "safeOrder"),
    meta: {
        title: '购买保险',
        type: 'safeOrder',
        page: 'PbuyIns'
    }
},
{
    path: '/advanceRepayment',
    name: 'advanceRepayment',
    component: resolve => require.ensure([], () => resolve(require('./components/order/advanceRepayment.vue')), "advanceRepayment"),
    meta: {
        title: '提前还款',
        type: 'advanceRepayment',
        page: 'PaheRep'
    }
},
// {
//     path: '/returnRevise',
//     name: 'returnRevise',
//     component: resolve => require.ensure([], () => resolve(require('./components/order/returnRevise.vue')), "returnRevise"),
//     meta: {
//         title: '返回修改',
//         type: 'returnRevise',
//         page:'PretCha'
//     }
// },
{
    path: '/contractList',
    name: 'contractList',
    component: resolve => require.ensure([], () => resolve(require('./components/order/contractList.vue')), "contractList"),
    meta: {
        title: '合同列表',
        type: 'contractList',
        page: 'Pcontr'
    }
},
{
    path: '/success',
    name: 'success',
    component: resolve => require.ensure([], () => resolve(require('./components/common/success.vue')), "success"),
    meta: {
        title: '开户成功',
        type: 'success',
        page: 'PactSuc'
    }
},
{
    path: '/confirmation',
    name: 'confirmation',
    component: resolve => require.ensure([], () => resolve(require('./components/order/confirmation.vue')), "confirmation"),
    meta: {
        title: '确认函',
        type: 'confirmation',
        page: 'PconLet'
    }
},
{
    path: '/notice',
    name: 'notice',
    component: resolve => require.ensure([], () => resolve(require('./components/person/face/notice.vue')), "notice"),
    meta: {
        title: '身份认证须知',
        type: 'notice',
        page: 'PperNot'
    }
},
{
    path: '/ocridcard',
    name: 'ocridcard',
    component: resolve => require.ensure([], () => resolve(require('./components/person/face/ocridcard.vue')), "ocridcard"),
    meta: {
        title: '身份认证',
        type: 'ocridcard',
        page: 'PideAut'
    }
},
{
    path: '/videoverify',
    name: 'videoverify',
    component: resolve => require.ensure([], () => resolve(require('./components/person/face/videoverify.vue')), "videoverify"),
    meta: {
        title: '人脸识别',
        type: 'videoverify',
        page: 'PfacRec'
    }
},
{
    path: '/authentication',
    name: 'authentication',
    component: resolve => require.ensure([], () => resolve(require('./components/person/auth/authentication.vue')), "authentication"),
    meta: {
        title: '确认信息',
        type: 'authentication',
        page: 'PcheInf'
    }
},
{
    path: '/inviteCode',
    name: 'inviteCode',
    component: resolve => require.ensure([], () => resolve(require('./components/person/information/inviteCode.vue')), "inviteCode"),
    meta: {
        title: '电销邀请码',
        type: 'inviteCode',
        page: 'PinvCod'
    }
},
{
    path: '/signApply',
    name: 'signApply',
    component: resolve => require.ensure([], () => resolve(require('./components/person/auth/signApply.vue')), "signApply"),
    meta: {
        title: '协议支付绑定',
        type: 'signApply',
        page: 'PpayBou'
    }
},
{
    path: '/confirmInsurance',
    name: 'confirmInsurance',
    component: resolve => require.ensure([], () => resolve(require('./components/person/auth/confirmInsurance.vue')), "confirmInsurance"),
    meta: {
        title: '确认投保',
        type: 'confirmInsurance'
    }
},
{
    path: '/resetPwdError',
    name: 'resetPwdError',
    component: resolve => require.ensure([], () => resolve(require('./components/order/resetPwdError.vue')), "resetPwdError"),
    meta: {
        title: '重置密码失败',
        type: 'resetPwdError'
    }
},
{
    path: '/orderSuccess',
    name: 'orderSuccess',
    component: resolve => require.ensure([], () => resolve(require('./components/person/information/orderSuccess.vue')), "orderSuccess"),
    meta: {
        title: '审核中',
        type: 'orderSuccess',
        page: 'Pwait'
    }
},
{
    path: '/saveAccountInfo',
    name: 'saveAccountInfo',
    component: resolve => require.ensure([], () => resolve(require('./components/order/saveAccountInfo.vue')), "saveAccountInfo"),
    meta: {
        title: '更改开户信息',
        type: 'saveAccountInfo'
    }
},
{
    path: '/changeOpenAcct',
    name: 'changeOpenAcct',
    component: resolve => require.ensure([], () => resolve(require('./components/order/changeOpenAcct.vue')), "changeOpenAcct"),
    meta: {
        title: '更换开户银行卡',
        type: 'changeOpenAcct',
    }
}
]
export default routes
