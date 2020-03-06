/*
* @Author: WuPeng
* @Date:   2020-02-27 21:59:48
* @Last Modified by:   WuPeng
* @Last Modified time: 2020-03-06 19:46:08
*/

/*
 jshint esversion:6
*/

// 引入模块
var express = require('express');

const auth = require('./wechat/auth');
const router = require('./router');

// 初始化
const app = express();

// 设置公共资源
app.use('/node_modules/',express.static('./node_modules'));
app.use('/public/',express.static('./public'));

// 使用模板引擎
app.engine('html',require('express-art-template'));

// 配置路由
// app.use(router);

// 中间件的使用
app.use(auth());

// app.use(function(req,res){
// 	res.render('404.html');
// });

// 启动服务
app.listen('3000', () => console.log('runnging at 3000 ...'));

