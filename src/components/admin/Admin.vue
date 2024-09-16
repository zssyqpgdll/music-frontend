<template>

    <div class="admin-background"></div>

    <div id="admin-login-form">
        <div style="position:absolute;top:5px;left:100px;font-weight:bolder;color:#606266">
            个性化音乐推荐系统后台管理
        </div>

        <!-- 登陆表单 -->
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			<!-- 第一项:管理员用户名 -->
            <el-form-item label="用户名：" prop="username">
				<el-input type="name" v-model="ruleForm.username" autocomplete="off" placeholder="请输入用户名" clearable></el-input>
			</el-form-item>

            <!-- 第二项:管理员密码 -->
			<el-form-item label="密码：" prop="password">
				<el-input type="password" v-model="ruleForm.password" autocomplete="off" placeholder="请输入密码" clearable></el-input>
			</el-form-item>

            <!-- 第三项:按钮 -->
			<el-form-item style="padding-top:25px;margin-bottom:0;margin-right:0;margin-left:-100px;">
				<el-button type="primary" @click="submitForm('ruleForm')">
					登录
				</el-button>
				<el-button style="margin-left:20px;" @click="resetForm('ruleForm')">
					重置
				</el-button>
			</el-form-item>
		</el-form>
    </div>

</template>


<script>
export default {
	name: "admin",
	data() {
		// 校验数据，见Element-Plus
		var validateUsername = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("请输入用户名"))
			} else {
				if (this.ruleForm.username !== "") {
					this.$refs.ruleForm.validateField("username")
				}
				callback()
			}
		}

        //校验密码
		var validatePass = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("请输入密码"))
			} else {
				callback()
			}
		}

		return {
			// 表单数据,初始为空
			ruleForm: {
				username: "",
				password: "",
			},
			// 表单验证规则，见Element-Plus
			rules: {
                //trigger: 触发验证的方法，值可用字符串’blur’, ‘change’，也可是数组[‘blur’, ‘change’]，默认是全部
                //规则数组是按序逐一被执行验证的（trigger='blur’时，更改input框的值不会触发验证）
				//validator自定义验证方法
                username: [{ validator: validateUsername, trigger: "blur" }],
				password: [{ validator: validatePass, trigger: "blur" }],
			},
		}
	},

	methods: {
		// 重置表单内容
		resetForm(formName) {
			this.$refs[formName].resetFields()
		},

        //登陆
		login() {
			this.$axios
				.post(
					"/adminLogin",
                    //将 JavaScript 值转换为 JSON 字符串
					JSON.stringify({
						// user: {
						// 	username: this.ruleForm.username,
						// 	password: this.ruleForm.password,
						// },
						name: this.ruleForm.username,
						password: this.ruleForm.password,
						// 这里需要加Content-type，不然传参数会有问题
					}),
                    //头部
					{ headers: { "content-type": "application/json" } },
				)
				.then((response) => {
					console.log(response)
					// 在前端进行比较数据的方法并不好，需要在后端进行比较
					console.log(response.data.data.password)
                    //密码正确
					if (response.data.data.password == this.ruleForm.password) {
                        //导航到指定URL，这个方法会向history栈添加一个新纪录，所以，当用户点击浏览器后退按钮时，会回到之前的URL
						//带查询参数，变成/adminMenu?name=this.ruleForm.username
                        this.$router.push({
							path: "/adminMenu",
							query: {
								name: this.ruleForm.username,
							},
						})
						this.$message({
							type: "success",
							message: "登录成功!",
						})
					} else {
						// 重置表单
						this.resetForm("ruleForm")
						// 弹出提示
						this.$message({
							type: "info",
							message: "用户名或密码错误，登录失败!",
						})
					}
				})
		},

		// 提交表单的事件处理
		submitForm(formName) {
            //ref：获取该表单form组件
            //validate: 对整个表单进行校验的方法
            //valid: 每个必填表单项都提交为true,否则为false
			this.$refs[formName].validate((valid) => {
				if (valid) {//必填项都提交了,则执行登陆函数
					// callback(new Error('用户名或密码错误'));
					// alert("submit!");
					this.login()
				} else {
					console.log("error submit!!")
					// callback(new Error('用户名或密码错误'));
					return false
				}
			})
		},
	},
}
</script>


<style scoped>
/* 
scoped表示旨在本文件内起作用，局部声明
@import url(); 引入公共css类 
*/
#admin-login-form {
	z-index: 1;
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	margin: auto;
	width: 400px;
	height: 300px;
	background-color: rgba(204, 204, 204, 0.6);
	border-radius: 10px;
}

#admin-login-form .el-form {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	margin: auto;
	height: 200px;
	width: 400px;
}

#admin-login-form .el-form .el-form-item {
	margin-right: 30px;
}

#admin-login-form .el-form .el-form-item .el-form-item__content {
	margin-left: 0 !important;
}

/* 仅在管理员模块界面显示该背景图 */
.admin-background {
	background: url("../../assets/imgs/background-admin.jpg") no-repeat center
		center;
	background-size: cover;
	background-attachment: fixed;
	background-color: #cccccc;
	z-index: -1;
	position: absolute;
	width: 100%;
	height: 100%;
}

</style>