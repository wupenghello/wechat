/*
* @Author: WuPeng
* @Date:   2020-02-27 21:59:48
* @Last Modified by:   WuPeng
* @Last Modified time: 2020-02-27 22:04:52
*/

/*
 jshint esversion:6
*/

// 引入模块
var express = require('express');

// 初始化
const app = express();


// 中间件的使用
app.use( (req,res,next) => {

	next();
});


// 路由
app.get('/', (req,res) => {
	res.send('首页');
});

app.get('/test', (req,res) => {
	res.send('测试');
});


// 启动服务
app.listen('3000', () => console.log('runnging at 3000 ...'));

