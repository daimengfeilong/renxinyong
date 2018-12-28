//去除产品名称中的括号
const reStrBracket = val => {
    return val.replace(/\（[^\）]+\）|\([^\)]+\)/,'')
}

export { reStrBracket }