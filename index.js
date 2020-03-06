/*
* @Author: WuPeng
* @Date:   2020-02-27 21:59:48
* @Last Modified by:   WuPeng
* @Last Modified time: 2020-03-06 23:03:48
*/

/*
 jshint esversion:8
*/

// 引入模块
var express = require('express');

const auth = require('./wechat/auth');
const router = require('./router');

const Wechat = require('./wechat/wechat');
const {url} = require('./config/index');

const sha1 = require('sha1');

// 初始化
const app = express();

//创建实例对象
const wechatApi = new Wechat();

// 设置公共资源
app.use('/node_modules/',express.static('./node_modules'));
app.use('/public/',express.static('./public'));

// 使用模板引擎
app.engine('html',require('express-art-template'));

// 配置路由
app.use(router);

// 中间件的使用
app.use(auth());

app.use( async (req,res) => {

	//获取随机字符串
	const noncestr = Math.random().toString().split('.')[1];

	// 获取时间戳
	const timesTamp = Date.now();

	// 获取票据
	const {ticket} = await wechatApi.fetchTicket();

	// 组合参与签名的四个参数：jsapi_ticket , noncestr , timestamp , url ；
	const arr = [
		`jsapi_ticket=${ticket}`,
		`noncestr=${noncestr}`,
		`timesTamp=${timesTamp}`,
		`url=${url}`
	];

	// 将其进行字典序排序，以“&”拼接在一起；
	const str = arr.sort().join('&');

	// 进行 sha1 加密，最终生成 signature
	const signature = sha1(str);


	res.render('404.html',{
		signature,
		noncestr,
		timesTamp
	});
});

// 启动服务
app.listen('3000', () => console.log('runnging at 3000 ...'));

