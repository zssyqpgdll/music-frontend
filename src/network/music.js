import request from '@/network/request'

const base = '/user'

//data是用户id
export function downloadMusic(data) {
  return request({
    url: base + '/downloadMusic',
    method: 'post',
    data
  })
}