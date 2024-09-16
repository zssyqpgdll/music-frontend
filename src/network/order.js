import request from '@/network/request'

const base = '/order'

//支付，传入订单编号
export function pay(orderid){
  return request({
    url:   base + '/' +orderid+ '/pay' ,
    method: 'post',
  })
}

export function list(username){
  return request({
    url: base + '/fontsearch/' + username,
    method: 'get',
  })
}

//data：用户id、充值金额、充值原因
export function add(data){
  return request({
    url: base + '/add' ,
    method: 'post',
    data
  })
}

export function remove(id){
  return request({
    url: base + '/delete/' + id,
    method: 'get',
  })
}
