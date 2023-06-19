const alphanum = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
const alphanumLen = 62

function getRandomAlphanum() {
    return alphanum.charAt(Math.floor(Math.random() * alphanumLen)) // Index 0...61
}

function generateAlphanumericCode(len) {
    let ret = ''
    for(let i = 0; i < len; i++) {
        ret += getRandomAlphanum()
    }
    return ret
}
module.exports = { generateAlphanumericCode }