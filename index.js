/*
* @Author: WuPeng
* @Date:   2020-02-27 21:59:48
* @Last Modified by:   WuPeng
* @Last Modified time: 2020-02-28 21:24:04
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


// 中间件的使用
app.use(auth());


// app.use(router);

// 启动服务
app.listen('3000', () => console.log('runnging at 3000 ...'));

