<template>
	<div id="songs-search">
		<el-table :data="songsData" stripe style="width: 100%;" :header-cell-style="{ fontWeight: 'normal', border: 'none' }" >
			<!-- :header-cell-style="{ fontWeight: 'normal' }"设置表头样式，中间的连接符去掉，改成驼峰形式 -->
			<el-table-column align="center" prop="index" label="" width="120">
				<template #default="scope">
					<!--序号-->
                    <span style="font-size:16px;width:20px;display:inline-block;" >
						{{ scope.$index + 1 }}
					</span>
                    <!--播放-->
					<i class="iconfont icon-bofang" 
                        style="margin-left:10px;font-size:18px;width:20px;display:inline-block;" @click="startPlay(scope.$index)" :class="
								scope.row.downUrl == 'None' ? 'fail' : 'succ'" ></i>
					<!--收藏-->
                    <i class="iconfont icon-shoucang_huaban1" style="margin-left:10px;font-size:18px;width:20px;display:inline-block;"
						@click="addLove(scope.$index)" :class="[
							scope.row.downUrl == 'None' ? 'fail' : 'succ',
							scope.row.isLove === true ? 'active' : '', ]" ></i>
				</template>
			</el-table-column>

			<!--下载-->
            <el-table-column prop="operation" align="center" label="操作" width="120">
                <template #default="scope">
                    <el-button icon="el-icon-download" @click="handleDownload(scope.row.downUrl)" circle></el-button>
                </template>
            </el-table-column>

			<el-table-column align="center" prop="songName" label="歌曲名" width="220" >
				<!-- 在表格中添加跳转链接 -->
				<template #default="scope">
					{{ scope.row.songName }}
				</template>
			</el-table-column>

			<el-table-column align="center" prop="singerName" label="歌手" width="220" >
				<template #default="scope">
					{{ scope.row.singerName }}
				</template>
			</el-table-column>

			<el-table-column align="center" prop="album" label="专辑" width="300" ></el-table-column>

			<el-table-column align="center" prop="songTime" label="时长" width="200" >
				<template #default="scope">
					{{ scope.row.songTime }}
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页 -->
		<el-pagination background layout="prev, pager, next" :total="totalNum" :current-page="currentPage"
         style="padding-top:30px;" @current-change="handleCurrentChange" ></el-pagination>
	</div>
</template>


<script>
import { useStore } from "vuex"
import {downloadMusic} from "../network/music"
import { _getSearchSongs, _addLoveSong, _cancelLoveSong, _getLoveSongList } from "../network/request.js"

export default {
	name: "searchMusic",
	data() {
		const item = {
			iid: "",
			songName: "",
			singerName: "",
			album: "",
			songTime: "",
			downUrl: "",
			picUrl: "",
			isLove: false,
		}
		return {
			uid: "",
			// 后台的所有数据
			songsData: Array(10).fill(item),
			// 搜索关键词
			keyword: "",
			// 当前页面
			currentPage: 1,
			pageSize: 10,
			// 分页中的总条目数
			totalNum: 1000,

			// lovesData: Array(10).fill(item),
		}
	},

	created() {
		// 获得用户id
		this.uid = useStore().state.user.uid
		console.log("用户id：" + this.uid)
        //获取url后面的参数
		this.keyword = this.$route.query.keyword
		console.log(this.currentPage)
		// 得到搜索歌曲歌曲的详情信息
		_getSearchSongs({ keyword: this.keyword, currentPage: 1 }).then((response) => {
			this.songsData = response.data.data
			console.log(this.songsData)
		})

		// 页面加载时读取数据
		if (window.sessionStorage.getItem("user")) {
			console.log("页面加载")
            const session_user = JSON.parse(window.sessionStorage.getItem("user"))
			console.log(session_user)
			this.$store.commit("SET_USER", session_user)
		}
		// 页面刷新时保存状态
		window.addEventListener("beforeunload", () => {
			console.log("页面刷新")
			console.log(this.$store.state.user)
			window.sessionStorage.setItem(
				"user",
				JSON.stringify(this.$store.state.user),
			)
		})
	},

	// mounted() {
	// 	// 得到歌曲是否为该用户的收藏
	// 	_getLoveSongList({ uid: this.uid }).then((response) => {
	// 		this.lovesData = response.data.data
	// 		// console.log(this.lovesData)
	// 		for (var i = 0; i < this.songsData.length; i++) {
	// 			for (var j = 0; i < this.lovesData.length; j++) {
	// 				if(this.songsData[i] === this.lovesData[j]){
	// 					this.songsData[i].isLove = true;
	// 				}
	// 			}
	// 		}
	// 	})
	// },

	methods: {

		//下载歌曲方法
        handleDownload(url){
            if(url=='')
                return
            downloadMusic({'uid':this.uid}).then(res=>{
                const r = res.data
                if(r.code!=0){
                    this.$message({type: "warning", message: r.message,})
                }else{
                    this.$message({type: "success", message: "成功，账户扣除1币,在新页面中下载",})
                    setTimeout(()=>{
                        window.open(url)
                    },1000)
                }
            })
        },

		startPlay(index) {
			console.log(index)
			var song = this.songsData[parseInt(index)]
			console.log(song)
			this.downUrl = song.downUrl
			console.log(this.downUrl)
			console.log(song.picUrl)
			var iid = song.iid
			var picUrl = song.picUrl
			var songNae = song.songName
			var singerName = song.singerName
			var mp3Url = this.downUrl
			// 将事件传递给子组件，第一个参数为自定义事件名，后续参数为传递过去的数据
			console.log("开始emit")
			this.$emit("playmusic", iid, mp3Url, picUrl, songNae, singerName)
			console.log("结束emit")
		},

		// 下一页
		handleCurrentChange(val) {
			// 得到歌曲的详情信息
			_getSearchSongs({ keyword: this.keyword, currentPage: val }).then((response) => {
				this.songsData = response.data.data
				console.log(this.songsData)
			})
		},

		// 添加收藏歌曲
		addLove(index) {
			var isLove = this.songsData[parseInt(index)].isLove
			var songName = this.songsData[parseInt(index)].songName
			if (isLove === true) {
				this.songsData[parseInt(index)].isLove = false
				_cancelLoveSong({
					uid: this.uid,
					iid: this.songsData[parseInt(index)].iid,
				}).then((response) => {
					if (response.data.code === 200) {
						console.log("取消收藏")
						this.$message({
							type: "info",
							message: songName + " " + "取消收藏!",
						})
					}
				})
			} else {
				this.songsData[parseInt(index)].isLove = true
				_addLoveSong({
					uid: this.uid,
					iid: this.songsData[parseInt(index)].iid,
				}).then((response) => {
					if (response.data.code === 200) {
						console.log("收藏歌曲")
						this.$message({
							type: "success",
							message: songName + " " + "收藏成功!",
						})
					}
				})
			}
		},
	},
}
</script>

<style scoped>
#songs-search {
	position: absolute;
	width: 1060px !important;
	right: 0;
	left: 0;
	margin-left: auto;
	margin-right: auto;
}
/* 字体图标鼠标覆盖变色 */
#songs-search i.iconfont.icon-bofang:hover {
	cursor: pointer;
	/* color: rgb(231, 56, 40); */
	color: #f56c6c;
}
/* #song-discover .el-table{
    position: absolute;
    right: 0;
    left: 0;
    margin-left: auto;
    margin-right: auto;
    width: 1400px;
} */

/* 收藏歌曲激活状态 */
#songs-search .active {
	color: #f56c6c;
}

/* 字体图标鼠标覆盖变色 */
#songs-search i.iconfont.icon-shoucang_huaban1:hover {
	cursor: pointer;
}

/* 表格中不可播放的的禁止点击样式 */
#songs-search .fail {
	/* pointer-events: none; */
	color: #9b9b9b;
	cursor: not-allowed;
}
/* 可以播放则不做任何修改 */
#songs-search .succ {
	/* pointer-events: none; */
	/* color: #9b9b9b;
	cursor: not-allowed; */
}

</style>
