/*
* @Author: WuPeng
* @Date:   2020-02-27 21:59:48
* @Last Modified by:   WuPeng
* @Last Modified time: 2020-02-28 20:57:47
*/

/*
 jshint esversion:6
*/

// 引入模块
var express = require('express');
const router = require('./router');
const sha1 = require('sha1');

// 初始化
const app = express();


//定义配置对象
const config = {
	appID:"wx7405ddee3aee9678",
	appsecret:"baa3e4590f52bce9e8c30224ff975121",
	token:"HxwdDjXE2Lukdle"
};

// 中间件的使用
app.use( (req,res,next) => {

	const {signature,echostr,timestamp,nonce} = req.query;
	const {token} = config;

	// 1.将参与微信的加密前面的三个参数（ temestamp , nonce , token ）,按照字典序排序组合在一起形成一个数组；
	const arr = [timestamp,nonce,token];
	const arrSort = arr.sort();

	// 2.将数组里所有参数拼接成一个字符串，进行 sha1 加密；
	const str = arr.join('');
	const sha1Str = sha1(str);

	//3.加密完成就生成了一个 signature ，和微信发送过来的进行对比。

	if(sha1Str === signature){
		//如果一样，就说明消息来自于微信服务器，返回 echostr 给微信服务器；
		res.send(echostr);
	}else{
		//如果不一样，说明不是微信服务器发送的消息，返回 error。
		res.end('error');
	}

	next();
});


app.use(router);

// 启动服务
app.listen('3000', () => console.log('runnging at 3000 ...'));

