/*
* @Author: WuPeng
* @Date:   2020-02-27 22:09:16
* @Last Modified by:   WuPeng
* @Last Modified time: 2020-03-09 19:00:26
* @Descript:路由
*/

/* jshint esversion:8 */

// 引入 express
const express = require('express');
// sha1 加密
const sha1 = require('sha1');


// 引入回复用户信息
const reply = require('../reply');
// 引入公共 URL
const {url} = require('../config/index');
// 引入 wechat
const Wechat = require('../wechat/wechat');
// 引入数据库对象
const Theaters = require('../model/Theaters');

//创建实例对象
const wechatApi = new Wechat();
// 创建路由容器
const router = express.Router();



// 定义路由
router.get('/movie',(req,res) => {
	res.render('movie.html');
});

router.get('/search', (req,res) => {
	res.render('search.html');
});

// 详情页路由
router.get('/detail/:id', async (req,res) => {
	
	const {id} = req.params;

	// 判断 id 值是否存在
	if(!id){
		res.end('error');
	}

	// 去数据库中找到对应的id
	const data = await Theaters.findOne({doubanId:id},{_id:0,__v:0,createTime:0});

	res.render('detail.html',{data});

});


// 中间件的使用

// 获取并回复用户发来的信息
router.use(reply());

// 404 页面
router.use( async (req,res) => {

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

// 导出路由
module.exports = router;