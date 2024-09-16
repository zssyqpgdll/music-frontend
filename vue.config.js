// vue.config.js
// 解决跨域问题
module.exports = {
	// 选项...
	devServer: {
        // Paths
        open: true,
		//新版的webpack-dev-server出于安全考虑，默认检查hostname，如果hostname不是配置内的就不能访问
		//跳过检查
		disableHostCheck: true,
        // host: 'localhost',
        host: '0.0.0.0',
        port: 8080,
		proxy: {
			'/api': {
				target: 'http://localhost:8080/',
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/api': '',
				},
			},
		},
	},
}
