import request from '@/network/request'

const base = '/user'

//data是用户id和身份证号
export function idconfirm(data) {
  return request({
    url: base + '/idconfirm',
    method: 'post',
    data
  })
}

//data是用户编号
export function refresh(data) {
  return request({
    url: base + '/refresh',
    method: 'post',
    data
  })
}

//记录播放日志
export function play() {
  return request({
    url: base + '/play',
    method: 'get'
  })
}