/*
* @Author: WuPeng
* @Date:   2020-02-28 21:14:28
* @Last Modified by:   WuPeng
* @Last Modified time: 2020-03-06 00:09:05
*
* 微信的服务器验证有效性
*/


//jshint esversion:8

const sha1 = require('sha1');
const config = require('../config/index');
const { getUserDataAsync , parseXMLAsync , formatMessage } = require('../utils/tool');
const template = require('./template');
const replay = require('./reply');

module.exports = () => {

	return async (req,res,next) => {

		const {signature,echostr,timestamp,nonce} = req.query;
		const {token} = config;

		// 1.将参与微信的加密前面的三个参数（ temestamp , nonce , token ）,按照字典序排序组合在一起形成一个数组；
		const arr = [timestamp,nonce,token];
		const arrSort = arr.sort();

		// 2.将数组里所有参数拼接成一个字符串，进行 sha1 加密；
		const str = arr.join('');
		const sha1Str = sha1(str);

		// GET 用来验证服务器的有效性
		if( req.method === 'GET'){
			//3.加密完成就生成了一个 signature ，和微信发送过来的进行对比。
			if(sha1Str === signature){
				//如果一样，就说明消息来自于微信服务器，返回 echostr 给微信服务器；

				res.send(echostr);
			}else{
				//如果不一样，说明不是微信服务器发送的消息，返回 error。
				res.end('error:消息不是来自微信服务器');
			}
		}else if( req.method === 'POST' ){

			// POST 用来获取用户发送的消息
			// 验证消息来自于微信服务器

			if(sha1Str !== signature){
				//走到这里说明消息不是来自微信服务器

				res.send('error:消息不是来自微信服务器');

			}

			const xmlData = await getUserDataAsync(req);

			// 得到的 xmlData 是一个 xml 数据，需要解析成一个 js 对象
			const jsData = await parseXMLAsync(xmlData);

			//格式化数据
			const message = formatMessage(jsData);

			

			// 简单的自动回复，回复文本内容

			const options = replay(message);

			// 最终回复的内容
			let replayMessage = template(options);

			console.log(replayMessage)

			res.end(replayMessage);

		}else{
			res.end('error');
		}
		

		next();
	};
};