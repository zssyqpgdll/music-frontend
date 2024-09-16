import axios from 'axios'

axios.defaults.baseURL = "/api"

const request = axios.create({
	baseURL: '/api',  // 注意！！ 这里是全局统一加上了 '/api' 前缀，也就是说所有接口都会加上'/api'前缀在，页面里面写接口的时候就不要加 '/api'了，否则会出现2个'/api'，类似 '/api/api/user'这样的报错，切记！！！
    timeout: 10000    //超时
})

// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
// request.interceptors.request.use(config => {
//     //请求头
//     config.headers['Content-Type'] = 'application/json;charset=utf-8';
  
//  // config.headers['token'] = user.token;  // 设置请求头
//     return config
// }, error => {
//     return Promise.reject(error)
// });

// // response 拦截器
// // 可以在接口响应后统一处理结果
// request.interceptors.response.use(
//     response => {
//         let res = response.data;
//         // 如果是返回的文件
//         if (response.config.responseType === 'blob') {
//             return res
//         }
//         // 兼容服务端返回的字符串数据
//         if (typeof res === 'string') {
//             res = res ? JSON.parse(res) : res
//         }
//         return res;
//     },
//     error => {
//         console.log('err' + error) // for debug
//         return Promise.reject(error)
//     }
// )


export default request

// 获得歌曲的详情信息
export function getSongDetail(id) {
	return axios.get("https://netease-cloud-music-api-psi-three.vercel.app/song/detail?ids=" + id)
}

// 登录,参数是用户id和密码
export function getLogin(params) {
	console.log(params)
	return axios.post("/login", params)
}

// 获得推荐歌曲
export function getRecommendSongs(param) {
	return axios.post("/recommendSongs", param)
}

// 获得推荐用户
export function getRecommendUsers(param) {
	return axios.post("/recommendUsers", param)
}

// 发现歌曲，新歌
export function getDiscoverSongs(param) {
	return axios.post("/discover", param)
}

// 获得歌曲列表，用于管理员
export function _getDisplaySongs(param) {
	return axios.post("/display", param)
}

// 热门歌曲
export function getHotSongs(param) {
	return axios.post("/hot", param)
}

// 获得所有歌曲
export function _getAllSongs(param) {
	return axios.post("/songList", param)
}

// 搜索歌曲
export function _getSearchSongs(param) {
	return axios.post("/searchSongs", param)
}

// 添加歌曲
export function _addSong(param) {
	return axios.post("/addSong", param)
}

// 删除歌曲
export function _deleteSong(param) {
	return axios.post("/deleteSong", param)
}

// 更新歌曲
export function _updateSong(param) {
	return axios.post("/updateSong", param)
}

// 用户注册
export function _register(param) {
	return axios.post("/register", param)
}

// 更新用户
export function _updataUser(param) {
	return axios.post("/updateUser", param)
}

// 更新用户密码
export function _updataPw(param) {
	return axios.post("/updatePw", param)
}

// 添加播放记录，参数传入用户id和歌曲id即可
export function _addRecord(param) {
	return axios.post("/addRecord", param)
}

// 获得收藏歌曲列表
export function _getLoveSongList(param) {
	return axios.post("/loveSongList", param)
}

// 添加收藏记录
export function _addLoveSong(param) {
	return axios.post("/addLoveSong", param)
}

// 取消收藏
export function _cancelLoveSong(param) {
	return axios.post("/cancelLoveSong", param)
}

// 获得播放记录歌曲
export function _getRecordSong(param) {
	return axios.post("/getRecordSong", param)
}

// 获得播放记录歌曲,user-record页面
export function _getRecordSong1(param) {
	return axios.post("/getRecordSong1", param)
}