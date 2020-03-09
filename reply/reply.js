/*
* @Author: WuPeng
* @Date:   2020-03-05 23:34:33
* @Last Modified by:   WuPeng
* @Last Modified time: 2020-03-09 18:26:41
*
* 处理用户发送的消息类型和内容，决定返回不同的内容给用户
*/

// jshint esversion:8

const Theaters = require('../model/Theaters');
// 引入 url
const {url} = require('../config');

module.exports = async message => {
	
	let options = {
		toUserName:message.FromUserName,
		fromUserName:message.ToUserName,
		createTime:Date.now(),
		msgType:'text',		//默认text
	};
	
	let content = '你说啥啊';
	// 判断用户发送的消息是否是文本消息
	if( message.MsgType === 'text' ){
		// 判断用户发送的消息内容具体是什么

		if( message.Content === '热门' ){

			// //连接数据库
  	// 		await db;

			// 回复用户热门消息数据
			const data = await Theaters.find({}, {title: 1, summary: 1, doubanId: 1, _id: 0});

			// 将回复内容初始化为空数组
			content = [];
			options.msgType = 'news';

			// 通过遍历将数据添加进去
			for (var i = 0; i < data.length; i++) {
				let item = data[i];

				content.push({

					title:item.title,
					description:item.summary,
					picUrl:item.image,
					url:`${url}/detail/${item.doubanId}`

				});
			}

		}else if( message.Content === '2' ){
			content = '落地成盒';
		}else if( message.Content.match('吴鹏')){
			// 半匹配
			content = '吴鹏是最帅的';
		}
	}
	else if( 'image' === message.MsgType ){
		// 用户发送图片消息

		options.msgType = 'image';
		options.mediaId = message.MediaId;

	}
	else if( 'voice' === message.MsgType ){
		// 用户发送语音消息

		options.msgType = 'voice';
		options.mediaId = message.MediaId;

	}
	else if( 'location' === message.MsgType ){
		// 用户发送位置消息

		content = `维度：${message.Location_X} 经度：${message.Location_Y} 缩放大小：${message.Scale} 位置信息：${message.Label}`;
	}
	else if( 'event' === message.MsgType ){
		// 事件

		if( 'subscribe' === message.Event ){
			// 用户订阅事件
			content = '欢迎您的关注~ \n' +
                '回复 首页 能看到电影预告片页面 \n' +
                '回复 热门 能看到最新最热门的电影 \n' +
                '回复 文本 能查看指定的电影信息 \n' +
                '回复 语音 能查看指定的电影信息 \n' +
                '也可以点击下面的菜单按钮，来了解硅谷电影公众号' ;
		}
		else if( 'LOCATION' === message.Event ){
			content = `维度：${message.Latitude} 经度：${message.Longitude} 精度：${message.Precision}`;
		}
		else if( 'CLICK' === message.Event ){
			content = `你点击了按钮 : ${message.EventKey}`;
		}
	}
	
	options.content = content;

	return options;


};