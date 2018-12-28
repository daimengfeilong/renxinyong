'use strict'
const buildType = process.argv.splice(2)[0]

const obj = {
    NODE_ENV: '"production"'
}
switch(buildType){
    case 'test' ://引流测试
        process.env.srconfig = 'test'
        obj.srconfig = '"test"'
        break;
    case 'yinliu' ://引流生产
        process.env.srconfig = 'yinliu'
        obj.srconfig = '"yinliu"'
        break;
    case '360' ://融360生产
        process.env.srconfig = '360'
        obj.srconfig = '"360"'
        break;
    default :
        process.env.srconfig = ''
        obj.srconfig = '""'
        break;
}

module.exports = obj
