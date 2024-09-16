<template>
	<div id="user-index">
		<el-container class="all-screen" direction="vertical">
            <!--头部-->
			<el-header height="50px">
                <!--图标-->
				<div class="dots" style="display:inline-block;">
					<i class="iconfont icon-yuandianda" style="color:#dd6d60;font-size:25px;padding-right:5px;"></i>
					<i class="iconfont icon-yuandianda" style="color:#aed292;font-size:25px;"></i>
				</div>

                <!--搜索框-->
				<el-input placeholder="请输入关键词" v-model="searchInput" prefix-icon="el-icon-search" clearable @keyup.enter="searchSongs" @clear="clearSearchInput">
                </el-input>
				
                <!--右上角用户-->
                <!-- 这里的样式需要放在这里才能生效，写到style标签里面不行，暂时还未解决 -->
				<el-dropdown style="position: absolute !important;right: 40px;top: 10px;color: #fff !important;width:120px;height: 30px;line-height: 30px;">
					<button class="user-settings" style="border-radius:15px;padding:1px;width:100%;height:30px;">
                        <!--用户头像暂时写死-->
						<img src="../assets/imgs/user-image.jpg" alt="加载失败" srcset=""
							style="display: inline-block;width:30px;height:30px;margin-right: 5px;border-radius:15px;"/>
						<span>
							{{ name }}
						</span>
					</button>

                    <!--下拉菜单内容-->
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item @click="refresh">
								个人中心
							</el-dropdown-item>

							<el-dropdown-item @click="changePwDialog">
								修改密码
							</el-dropdown-item>

                            <el-dropdown-item @click="changeIdDialog">
                                实名认证
                            </el-dropdown-item>

                            <el-dropdown-item @click="showPayDialog = true">
                                充值
                            </el-dropdown-item>

							<el-dropdown-item @click="logOut">
								退出登录
							</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</el-header>
            
            <!--主体-->
			<el-container>
                <!--侧边导航栏-->
				<el-aside width="200px">
					<el-menu default-active="1" class="el-menu-vertical-music" text-color="#fff"
                    background-color="transparent" active-text-color="#f56c6c" router="true">
						<el-menu-item route="/discover" index="1">
							<i class="iconfont icon-discover" style="padding-right:10px;"></i>
							<template #title>音乐库</template>
						</el-menu-item>

						<el-menu-item route="/hotmusic" index="2">
							<i class="iconfont icon-new-music" style="padding-right:10px;"></i>
							<template #title>最热音乐</template>
						</el-menu-item>

						<el-menu-item route="/recommendsongs" index="3">
							<i class="iconfont icon-musiclist" style="padding-right:10px;"></i>
							<template #title>推荐歌曲</template>
						</el-menu-item>

						<el-menu-item route="/recommendusers" index="4">
							<i class="iconfont icon-userlist" style="padding-right:10px;"></i>
							<template #title>相似用户</template>
						</el-menu-item>

						<el-menu-item route="/loveSong" index="5">
							<i class="iconfont icon-shoucang_huaban1" style="padding-right:10px;"></i>
							<template #title>收藏列表</template>
						</el-menu-item>
					</el-menu>
				</el-aside>

                <!--主体-->
				<el-container style="border-radius:5px;position:relative;">
					<!-- height:0;flex-grow:1;这里设置el-main内容超出时使用滑动条，el-footer不会被推到下面 -->
                    <!--中间音乐列表-->
					<el-main style="background-color:#fff;padding:10px;height:0;flex-grow:1;border-radius:5px;position:relative;">
						<!-- 父组件监听子组件，传递过来的事件要放在router-view标签里面（这里就是playmusic） -->
						<router-view @playmusic="changMP3Url"></router-view>
					</el-main>

                    <!--底部音乐播放-->
					<el-footer style="background-color:rgb(241,243,244)" height="50px">
						<div>
							<div class="song-info">
								<img :src="picUrl" alt="图片丢失" style="display: inline-block;width:50px;height:50px;"/>
								<div>
									<span style="display:inline-block;width:100px;overflow:hidden;font-size:14px;line-height: 100%">
										{{ songName }}
									</span>
									<span style="display:inline-block;width:100px;overflow:hidden;font-size:14px;color:#9b9b9b;line-height: 100%">
										{{ "-  " + singerName }}
									</span>
								</div>
								<!-- <div>歌曲名、歌手名</div> -->
							</div>

                            <!--音乐播放-->
							<audio id="audio" :src="MP3Url" controls="controls" loop="loop" controlsList="nodownload"
                             @timeUpdate="audioTimeUpdate" style="width:1100px;height:50px;right: 0;position: absolute;">
                            </audio>
						</div>
					</el-footer>

				</el-container>
			</el-container>
		</el-container>


		<!-- 个人中心弹出框 -->
		<el-dialog title="个人中心" modal="false" v-model="userinfoDialogVisibleEdit" >
			<el-form :model="form">
				<el-form-item label="用户id" :label-width="formLabelWidth">
					<el-input v-model="uid" autocomplete="off" disabled="true"></el-input>
				</el-form-item>

				<el-form-item label="姓名" :label-width="formLabelWidth">
					<el-input v-model="name" autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item label="性别" :label-width="formLabelWidth">
					<el-input v-model="gender" autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item label="年龄" :label-width="formLabelWidth">
					<el-input v-model="age" autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item label="所在地区" :label-width="formLabelWidth" style="text-align:left">
					<el-input v-model="value" autocomplete="off" style="width:300px;"></el-input>
					<!--级联选择器-->
					<el-cascader :options="areaOptions" :props="props" @change="handleChange" style="width:100px"></el-cascader>
				</el-form-item>

				<el-form-item label="手机号" :label-width="formLabelWidth">
					<el-input v-model="phone" autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item label="注册时间" :label-width="formLabelWidth">
					<el-input v-model="registerTime" autocomplete="off" disabled="true"></el-input>
				</el-form-item>

                <el-form-item label="钱包余额" :label-width="formLabelWidth">
                    <el-input v-model="bal" autocomplete="off" disabled="true"></el-input>
                </el-form-item>
				
                <el-form-item label="个人介绍" :label-width="formLabelWidth">
					<el-input v-model="des" autocomplete="off"></el-input>
				</el-form-item>
				
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <!--不可修改-->
					<el-input v-model="password" autocomplete="off" disabled="true" style="width:550px" :type="pwType"></el-input>
					<i style="margin-left:10px;cursor:pointer;" @click="changePwType"
                        :class="[
                            'iconfont',
                            'icon-mimaxianshi',
                            //如果pwType == 'password'则隐藏，否则显示密码
                            pwType == 'password' ? 'hide' : 'display',
                        ]">
                    </i>
				</el-form-item>
			</el-form>

            <!--模态框底部按钮-->
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="updateUser">
						确 定
					</el-button>
					<el-button @click="userinfoDialogVisibleEdit = false">
						取 消
					</el-button>
				</span>
			</template>
		</el-dialog>


		<!-- 修改密码弹出框 -->
		<el-dialog title="修改密码" modal="false" v-model="pwDialogVisibleEdit">
			<el-form :model="form">
				<el-form-item label="原密码" :label-width="formLabelWidth">
					<el-input clearable v-model="oldPassword" autocomplete="off" placeholder="请输入原密码" style="width:550px" :type="pwType"></el-input>
					<i style="margin-left:10px;cursor:pointer;" class="iconfont icon-mimaxianshi" @click="changePwType"></i>
				</el-form-item>

				<el-form-item label="新密码 " :label-width="formLabelWidth">
					<el-input clearable v-model="newPassword" autocomplete="off" placeholder="请输入新密码" style="width:550px" :type="pwType"></el-input>
					<i style="margin-left:10px;cursor:pointer;" class="iconfont icon-mimaxianshi" @click="changePwType" ></i>
				</el-form-item>
				
                <el-form-item label="重复新密码 " :label-width="formLabelWidth">
					<el-input clearable v-model="repeatNewPassword" autocomplete="off" placeholder="请重复新密码" style="width:550px" :type="pwType" ></el-input>
					<i style="margin-left:10px;cursor:pointer;" class="iconfont icon-mimaxianshi" @click="changePwType"></i>
				</el-form-item>
			</el-form>

            <!--模态框底部按钮-->
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="updatePw">
						修 改
					</el-button>
					<el-button @click="pwDialogVisibleEdit = false">
						取 消
					</el-button>
				</span>
			</template>
		</el-dialog>


        <!-- 实名认证弹出框 -->
        <el-dialog title="实名认证" modal="false" v-model="idDialog">
            <el-form>
                <el-form-item label="上传身份证图片" :label-width="formLabelWidth">

                <el-upload ref="upload" action="api/baidu/idRecognize"
                    :show-file-list=false :file-list="fileList" list-type="picture-card" :on-success="handleSuccess">
                    
                    <img v-if="imageUrl" :src="imageUrl" style="width:300px; height:160px">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>

                </el-form-item>
                    <el-form-item label="身份证号" :label-width="formLabelWidth">
                    <el-input clearable v-model="idno" autocomplete="off" id="idnoidno" disabled="true"></el-input>
                </el-form-item>
            </el-form>

            <!--模态框底部按钮-->
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="idConfirm">
                        认 证
                    </el-button>
                    <el-button @click="idDialog = false">
                        取 消
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog title="账户充值" modal="false" v-model="showPayDialog">
            <el-form>
                <el-form-item label="充值金额" :label-width="formLabelWidth">
                    <el-input clearable v-model="amount" autocomplete="off" ></el-input>
                </el-form-item>
            </el-form>

            <!--模态框底部按钮-->
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="pay">
                        充 值
                    </el-button>
                    <el-button @click="showPayDialog = false">
                        取 消
                    </el-button>
                </span>
            </template>
        </el-dialog>
	</div>
</template>


<script>
import { ref } from "vue"
// 引入状态管理
import { useStore } from "vuex"
// 引入接口
import { getHotSongs, _updataPw, _updataUser, _addRecord } from "../network/request"
import {idconfirm, refresh, play} from "../network/user";
import {add, pay} from "../network/order";

export default {
	name: "main",
	created() {
		const user = useStore().state.user
		console.log(useStore().state)
		// 得到state
		this.state = useStore().state
		// 得到用户信息
		this.uid = user.uid
        this.id = user.id
		this.gender = user.gender
		this.age = user.age
		this.value = user.area
		console.log(this.value)
		this.des = user.des
		this.registerTime = user.registerTime
		this.name = user.name
		this.password = user.password
        this.idno = user.idno
		console.log("身份证号:" + this.idno)
        this.phone = user.phone
        this.bal = user.bal
		console.log("用户名：" + user.name)

		// 页面加载时读取数据
        // 如果缓存中有用户信息
		if (window.sessionStorage.getItem("user")) {
			console.log("页面加载")
			const session_user = JSON.parse(
				window.sessionStorage.getItem("user"),
			)
			console.log(session_user)
			this.$store.commit("SET_USER", user)
		}

		// 页面刷新时保存状态， 用户信息写入缓存
		window.addEventListener("beforeunload", () => {
			console.log("页面刷新")
			console.log(this.$store.state.user)
			window.sessionStorage.setItem(
				"user",
				JSON.stringify(this.$store.state.user),
			)
		})


		// 得到歌曲的详情信息
		getHotSongs({ currentPage: "1" }).then((response) => {
			this.songsData = response.data.data
			console.log(this.songsData)
			var song = this.songsData[0]
			this.songName = song.songName
			this.singerName = song.singerName
			this.MP3Url = song.downUrl
			this.picUrl = song.picUrl
		})

		

	},

	data() {
		const item = {
			iid: "",
			songName: "",
			singerName: "",
			album: "",
			songTime: "",
			downUrl: "",
			picUrl: "",
		}

		return {
			songsData: Array(10).fill(item),
            amount: 0.0,//充值金额
            showPayDialog:false,//支付模态框
			// 用户状态
			state: useStore().state,
			// 用户信息开始
			// 用户uid
            id: 0,
			uid: ref("uid"),
			// 用户名
			name: ref("初始名"),
			gender: ref("性别"),
			age: ref(""),

			// 地区选择器的属性
			props: { expandTrigger: "hover" },

			value: "",
			

			// 地区选择器
			areaOptions: [
				{
					value: "北京市",
					label: "北京市",
					children: [
						{
							value: "北京城区",
							label: "北京城区",
						},
					],
				},
				{
					value: "天津市",
					label: "天津市",
					children: [
						{
							value: "天津城区",
							label: "天津城区",
						},
					],
				},
				{
					value: "上海市",
					label: "上海市",
					children: [
						{
							value: "上海城区",
							label: "上海城区",
						},
					],
				},
				{
					value: "重庆市",
					label: "重庆市",
					children: [
						{
							value: "重庆城区",
							label: "重庆城区",
						},
					],
				},
				{
					value: "河南省",
					label: "河南省",
					children: [
						{
							value: "郑州市",
							label: "郑州市",
						},
						{
							value: "周口市",
							label: "周口市",
						},
						{
							value: "洛阳市",
							label: "洛阳市",
						},
						{
							value: "开封市",
							label: "开封市",
						},
						{
							value: "新乡市",
							label: "新乡市",
						},
						{
							value: "南阳市",
							label: "南阳市",
						},
						{
							value: "信阳市",
							label: "信阳市",
						},
						{
							value: "安阳市",
							label: "安阳市",
						},
						{
							value: "漯河市",
							label: "漯河市",
						},
						{
							value: "平顶山市",
							label: "平顶山市",
						},
						{
							value: "鹤壁市",
							label: "鹤壁市",
						},
						{
							value: "焦作市",
							label: "焦作市",
						},
						{
							value: "许昌市",
							label: "许昌市",
						},
						{
							value: "三门峡市",
							label: "三门峡市",
						},
						{
							value: "商丘市",
							label: "商丘市",
						},
						{
							value: "济源市",
							label: "济源市",
						},
					],
				},
				{
					value: "湖北省",
					label: "湖北省",
					children: [
						{
							value: "武汉市",
							label: "武汉市",
						},
						{
							value: "黄石市",
							label: "黄石市",
						},
						{
							value: "孝感市",
							label: "孝感市",
						},
						{
							value: "襄阳市",
							label: "襄阳市",
						},
						{
							value: "十堰市",
							label: "十堰市",
						},
						{
							value: "宜昌市",
							label: "宜昌市",
						},
						{
							value: "荆门市",
							label: "荆门市",
						},
						{
							value: "仙桃市",
							label: "仙桃市",
						},
						{
							value: "荆州市",
							label: "荆州市",
						},
						{
							value: "黄冈市",
							label: "黄冈市",
						},
						{
							value: "咸宁市",
							label: "咸宁市",
						},
						{
							value: "恩施土家族苗族自治州",
							label: "恩施土家族苗族自治州",
						},
						{
							value: "随州市",
							label: "随州市",
						},
						{
							value: "潜江市",
							label: "潜江市",
						},
						{
							value: "天门市",
							label: "天门市",
						},
						{
							value: "神农架林区",
							label: "神农架林区",
						},
					],
				},
				{
					value: "山西省",
					label: "山西省",
					children: [
						{
							value: "太原市",
							label: "太原市",
						},
						{
							value: "大同市",
							label: "大同市",
						},
						{
							value: "阳泉市",
							label: "阳泉市",
						},
						{
							value: "晋城市",
							label: "晋城市",
						},
						{
							value: "长治市",
							label: "长治市",
						},
						{
							value: "晋中市",
							label: "晋中市",
						},
						{
							value: "朔州市",
							label: "朔州市",
						},
						{
							value: "忻州市",
							label: "忻州市",
						},
						{
							value: "运城市",
							label: "运城市",
						},
						{
							value: "临汾市",
							label: "临汾市",
						},
						{
							value: "吕梁市",
							label: "吕梁市",
						},
					],
				},
				{
					value: "四川省",
					label: "四川省",
					children: [
						{
							value: "成都市",
							label: "成都市",
						},
						{
							value: "自贡市",
							label: "自贡市",
						},
						{
							value: "攀枝花市",
							label: "攀枝花市",
						},
						{
							value: "泸州市",
							label: "泸州市",
						},
						{
							value: "德阳市",
							label: "德阳市",
						},
						{
							value: "绵阳市",
							label: "绵阳市",
						},
						{
							value: "乐山市",
							label: "乐山市",
						},
						{
							value: "广元市",
							label: "广元市",
						},
						{
							value: "遂宁市",
							label: "遂宁市",
						},
						{
							value: "内江市",
							label: "内江市",
						},
					],
				},
				{
					value: "广东省",
					label: "广东省",
					children: [
						{
							value: "广州市",
							label: "广州市",
						},
						{
							value: "深圳市",
							label: "深圳市",
						},
						{
							value: "韶关市",
							label: "韶关市",
						},
						{
							value: "珠海市",
							label: "珠海市",
						},
						{
							value: "汕头市",
							label: "汕头市",
						},
						{
							value: "佛山市",
							label: "佛山市",
						},
						{
							value: "东莞市",
							label: "东莞市",
						},
					],
				},
				{
					value: "安徽省",
					label: "安徽省",
					children: [
						{
							value: "合肥市",
							label: "合肥市",
						},
						{
							value: "阜阳市",
							label: "阜阳市",
						},
						{
							value: "芜湖市",
							label: "芜湖市",
						},
						{
							value: "蚌埠市",
							label: "蚌埠市",
						},
						{
							value: "淮南市",
							label: "淮南市",
						},
						{
							value: "黄山市",
							label: "黄山市",
						},
						{
							value: "滁州市",
							label: "滁州市",
						},
					],
				},
				{
					value: "湖南省",
					label: "湖南省",
					children: [
						{
							value: "长沙市",
							label: "长沙市",
						},
						{
							value: "株洲市",
							label: "株洲市",
						},
						{
							value: "湘潭市",
							label: "湘潭市",
						},
						{
							value: "岳阳市",
							label: "岳阳市",
						},
						{
							value: "衡阳市",
							label: "衡阳市",
						},
						{
							value: "邵阳市",
							label: "邵阳市",
						},
						{
							value: "常德市",
							label: "常德市",
						},
					],
				},
				{
					value: "辽宁省",
					label: "辽宁省",
					children: [
						{
							value: "沈阳市",
							label: "沈阳市",
						},
						{
							value: "大连市",
							label: "大连市",
						},
						{
							value: "本溪市",
							label: "本溪市",
						},
						{
							value: "丹东市",
							label: "丹东市",
						},
						{
							value: "锦州市",
							label: "锦州市",
						},
						{
							value: "辽阳市",
							label: "辽阳市",
						},
						{
							value: "营口市",
							label: "营口市",
						},
					],
				},
			],

			registerTime: ref(""),
			des: ref("个人描述"),
			password: ref(""),
			oldPassword: ref(""),
			newPassword: ref(""),
			repeatNewPassword: ref(""),
            imageUrl:'',
            idno:"",
            phone:"",
            bal:0.0,//钱包
			// 用户信息结束

			// 歌曲id
			iid: "",
            fileList:[],
			// 歌曲搜索关键词输入
			searchInput: ref(""),
			// 歌曲信息开始
            // 设置初始歌曲
			songName: "",
			singerName: "",
			MP3Url: ref(""),
			picUrl: ref(""),
			// 歌曲信息结束

			// 是否正在播放歌曲
			audioIsPlaying: false,
			// 是否显示用户信息弹出框
			userinfoDialogVisibleEdit: false,
			// 是否显示修改密码弹出框
			pwDialogVisibleEdit: false,
            // 是否显示实名认证弹出框
            idDialog: false,
			// 弹出框中输入框的宽度
			formLabelWidth: "120px",
			// 当前歌曲是否添加播放记录
			isAddRecord: false,
			// 密码显示与隐藏，默认隐藏
			pwType: "password",
		}
	},

	methods: {
		// 地区选择器选择
		handleChange(value) {
			console.log(value)
			this.value = value[0] + "-" + value[1]
		},


        refresh(){
            refresh({'id':this.id}).then(res=>{
                // console.log(res.data.data);
                this.bal = res.data.data.bal
                this.userinfoDialogVisibleEdit = true
            })
        },

        //点击支付按钮
        pay(){
			console.log("用户id:" + this.uid)
            add({'user_id':this.uid,'amount':this.amount,'reason':'充值'}).then(res=>{
                const orderId = res.data.data.id//订单id
                this.showPayDialog = false  //成功后关闭窗口
                // console.log(res);
                pay(orderId).then(res=>{
                    console.log(res)
                    //打开一个窗口,返回这个窗口的名称
                    const win = window.open('')
                    win.document.open()//打开输出流
                    win.document.write(res.data)//输出文本
                    win.document.close()//关闭输出流
                })
            })
        },

        //点击认证按钮
        idConfirm(){
            idconfirm({'uid':this.uid,'idno':this.idno}).then(res=>{
                // console.log(res);
                this.$message({type: "success", message: res.data.message,})
                this.idDialog = false;//成功后关闭窗口
            })
        },


        //上传身份证照片成功后
        handleSuccess(file, res){
            console.log(res.response.data)
            this.imageUrl = res.response.data.fileDownloadUri;//显示所上传的图片
            this.idno = res.response.data.words;//显示识别成功后的身份证号
        },

		// 清空修改密码表单
		clearChangePwForm() {
			this.oldPassword = ref("")
			this.newPassword = ref("")
			this.repeatNewPassword = ref("")
		},

		// 更新用户信息
		updateInfo() {
			const user = this.state.user
			user.name = this.name
			user.area = this.value
			user.des = this.des
			user.age = this.age
			user.gender = this.gender
			console.log(user)
			this.$store.commit("SET_USER", user)
		},

		// audio标签播放
		autoPlay() {
			const audio = document.getElementById("audio")
			audio.play()
		},

		//  audio标签暂停并重新加载
		closePlay() {
			const audio = document.getElementById("audio")
			audio.pause()
			audio.load()
		},

		// 接受子组件传过来的MP3Url，并切换MP3Url，然后audio切歌
		changMP3Url(
			valueIid,
			valueMP3Url,
			valuePicUrl,
			valueSongName,
			valueSingerName,
		) {
            play() //记录播放日志
			console.log("开始接收事件及参数")
			this.iid = valueIid
            console.log(this.iid)
			console.log(valueMP3Url)
			this.MP3Url = valueMP3Url
			console.log(valuePicUrl)
			this.picUrl = valuePicUrl
			console.log(valueSongName)
			this.songName = valueSongName
			console.log(valueSingerName)
			this.singerName = valueSingerName
			console.log("接收事件及参数结束")
			// 切换后播放新的音乐
			console.log("关闭正在播放的音乐")
			this.closePlay()
			console.log("播放新的音乐")
			this.autoPlay()
			// 切歌时修改播放记录标志为false
			this.isAddRecord = false
		},

		// 退出登录
		logOut() {
			this.$confirm("是否退出?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			}).then(() => {
                this.$message({
                    type: "success",
                    message: "退出成功!",
                })
                // 清空登录状态内容
                window.sessionStorage.clear()
                // 跳转到登录页
                this.$router.push("/login")
            }).catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消退出",
                })
            })
		},

		// 更新用户信息，用户名、性别、年龄、所在地区、个人简介等
		updateUser() {
			this.$confirm("此操作将永久更新用户信息, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			}).then(() => {
                _updataUser({
                    uid: this.uid,
                    name: this.name,
                    gender: this.gender,
                    age: this.age,
                    area: this.value,
                    des: this.des,
					phone: this.phone
                }).then((response) => {
                    if (response.data.code == 200) {
                        this.$message({
                            type: "success",
                            message: "更新成功!",
                        })
                        this.userinfoDialogVisibleEdit = false
                        // 更新状态管理中的用户信息
                        this.updateInfo()
                    } else {
                        this.$message({
                            type: "info",
                            message: "更新失败!",
                        })
                        this.userinfoDialogVisibleEdit = false
                    }
                })
            }).catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消更新",
                })
            })
		},

		// 弹出更新密码提示框
		changePwDialog() {
            this.pwDialogVisibleEdit = true
                this.clearChangePwForm()
        },

        // 弹出实名认证框
        changeIdDialog() {
            this.idDialog = true
        },

		// 更新密码
		updatePw() {
			this.$confirm("此操作将永久更新密码, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			}).then(() => {
                console.log(this.oldPassword == "")
                if (
                    this.oldPassword == "" ||
                    this.newPassword == "" ||
                    this.repeatNewPassword == ""
                ) {
                    console.log("密码为空，不可修改")
                    this.$message({
                        type: "warning",
                        message: "密码为空，修改失败！",
                    })
                    // 弹出框隐藏
                    this.pwDialogVisibleEdit = false
                    return false
                }
                if (this.newPassword === this.repeatNewPassword) {
                    _updataPw({
                        uid: this.uid,
                        oldPw: this.oldPassword,
                        newPw: this.newPassword,
                    }).then((response) => {
                        console.log(response.data)
                        if (response.data.code == 200) {
                            this.$message({
                                type: "success",
                                message: "更新成功!",
                            })
                            this.password = this.newPassword
                            console.log("更新密码")
                            this.pwDialogVisibleEdit = false
                        } else {
                            this.$message({
                                type: "warning",
                                message: "更新失败!",
                            })
                            console.log("更新失败")
                            this.pwDialogVisibleEdit = false
                        }
                    })
                } else {
                    this.$message({
                        type: "warning",
                        message: "两次新密码输入不同，更新失败!",
                    })
                }
            }).catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消更新",
                })
            })
		},

		// 搜索歌曲
		searchSongs() {
			console.log("关键字：" + this.searchInput)
			console.log("搜索歌曲")
			//
			this.$router.push({
				path: "/searchMusic",
				query: {
					keyword: this.searchInput,
				},
			})
		},

		// 点击清空时触发事件，跳转到discover界面
		clearSearchInput() {
			console.log("清空搜索框内容")
			this.$router.push("/discover")
		},

		// 听歌时间超过30秒则添加到播放记录中
		audioTimeUpdate() {
			// console.log("准备添加播放记录")
			var audio = document.getElementById("audio")
			var currTime = audio.currentTime
			console.log(currTime)
			// 超过30秒则添加播放记录
			if (!this.isAddRecord && currTime > 30) {
				console.log("正在添加播放记录")
				_addRecord({
					uid: this.uid,
					iid: this.iid,
				}).then((response) => {
					console.log(response.data.data)
					if (response.data.code == 200) {
						console.log("添加成功")
						// 添加记录成功一次之后，本首歌时间更新则不再重复添加
						this.isAddRecord = true
					}
				})
			}
		},

		// 更改密码显示
		changePwType() {
			console.log("改变密码显示类型")
			if (this.pwType == "password") {
				console.log("改变密码显示类型为明文")
				this.pwType = "name"
			} else {
				console.log("改变密码显示类型为密文")
				this.pwType = "password"
			}
		},
	},
}
</script>


<style scoped src="../assets/css/main.css">
/* 引入外部css文件且作用域是局部，则需要使用src属性引入 */

/* 密码显示与隐藏样式 */
#user-index >>> .display {
	cursor: pointer;
	color: #f56c6c;
}

#user-index >>> .hide {
	cursor: pointer;
}

.avatar {
  width: 100px;
  height: 60px;
}
</style>