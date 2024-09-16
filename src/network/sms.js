import request from '@/network/request'

const base = '/sms'

//发送验证码
export function sendMsg(data) {
  return request({
    url: base + '/sendMsg',
    method: 'post',
    data
  })
}

//短信修改密码
export function modifyPassBySms(id,data) {
  return request({
    url: base + '/modifyPass/' + id,
    method: 'post',
    data
  })
}


