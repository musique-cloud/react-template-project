import request from '@/api/request'
import JSEncrypt from 'jsencrypt'


const publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQClQdpsecEofT7MNz9HIf3oHC2djEzKrhNI0uCpvMISCCwAt2V6+PW7QONmAaF1+1BFpqA9ME/eCvT+ow2BNGQV05vvsKpvXHPLEeO2ba9kUMTSyHbZLRBB83us469oPKO3I6DvxtKKCTFEIbDMUKPh9hkFYA22JDatRa4VIWE6CQIDAQAB";


// 登录
export function login(loginId, pubPassword) {

    let encryptor = new JSEncrypt()  // 创建加密对象实例
    encryptor.setPublicKey(publicKey)//设置公钥
    let password = encryptor.encrypt(pubPassword)  // 对内容进行加密

    const data = {
        loginId,
        password
    }

    return request({
        url: '/web/user/login',
        method: 'post',
        data
    })
}
